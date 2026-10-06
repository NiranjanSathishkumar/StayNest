const prisma = require("../prisma/client.js");

const PAYMENT_SUCCESS_RATE = 0.9;

// Day-granularity only (no time slots): parse an <input type="date"> value
// ("YYYY-MM-DD") as a UTC midnight Date so it maps cleanly onto a Postgres DATE column.
function parseDate(value) {
    if (!value) return null;
    const d = new Date(`${value}T00:00:00.000Z`);
    return Number.isNaN(d.getTime()) ? null : d;
}

module.exports.renderBookingForm = async (req, res) => {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!listing) {
        req.flash("error", "Listing You Requested DOESN'T EXIST");
        return res.redirect("/listings");
    }
    // The booking timeline: every currently-confirmed date range for this listing,
    // so a guest can see what's taken before picking dates.
    const bookedRanges = await prisma.booking.findMany({
        where: { listingId: listing.id, status: "confirmed", checkOut: { gte: new Date() } },
        orderBy: { checkIn: "asc" },
        select: { checkIn: true, checkOut: true },
    });
    res.render("bookings/new", { listing, bookedRanges });
};

// Same book-and-pay logic as the transaction below, but run entirely inside
// Postgres via the book_and_pay() PL/pgSQL function — offered as a real,
// user-selectable alternative on the booking form, not a separate demo.
async function bookViaStoredProcedure(listing, guestId, checkIn, checkOut, amount) {
    const [result] = await prisma.$queryRaw`
        SELECT * FROM book_and_pay(${listing.id}, ${guestId}, ${checkIn}::date, ${checkOut}::date, ${amount})
    `;
    return prisma.booking.findUnique({ where: { id: result.booking_id } });
}

// Books and pays in one DB transaction: the Booking row and its Payment row are
// written together, and the booking's final status is derived from the payment
// outcome — so the two rows can never disagree about what happened.
//
// The overlap check ("no one can book a day someone else already has") runs
// inside the same transaction, escalated to SERIALIZABLE isolation. Under the
// default READ COMMITTED level, two concurrent requests could each pass the
// check before either commits, both booking the same day (a classic
// check-then-insert race). SERIALIZABLE makes Postgres detect that conflict and
// force one of the transactions to abort and retry instead.
module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    const amount = Number(req.body.amount);
    const checkIn = parseDate(req.body.checkIn);
    const checkOut = parseDate(req.body.checkOut);

    if (!Number.isFinite(amount) || amount <= 0) {
        req.flash("error", "Enter a valid amount to pay");
        return res.redirect(`/listings/${id}/bookings/new`);
    }
    if (!checkIn || !checkOut || checkOut <= checkIn) {
        req.flash("error", "Enter a valid check-in/check-out date range");
        return res.redirect(`/listings/${id}/bookings/new`);
    }

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
        req.flash("error", "Listing You Requested DOESN'T EXIST");
        return res.redirect("/listings");
    }

    let booking;
    try {
        if (req.body.useProcedure === "on") {
            booking = await bookViaStoredProcedure(listing, req.user.id, checkIn, checkOut, amount);
        } else {
            booking = await prisma.$transaction(async (tx) => {
                // Interval overlap test (half-open ranges [checkIn, checkOut)):
                // two ranges overlap iff each starts before the other ends.
                const conflict = await tx.booking.findFirst({
                    where: {
                        listingId: listing.id,
                        status: "confirmed",
                        checkIn: { lt: checkOut },
                        checkOut: { gt: checkIn },
                    },
                });
                if (conflict) {
                    throw new Error("DATE_CONFLICT");
                }

                const paymentSucceeded = Math.random() < PAYMENT_SUCCESS_RATE;

                const newBooking = await tx.booking.create({
                    data: {
                        amount,
                        checkIn,
                        checkOut,
                        status: paymentSucceeded ? "confirmed" : "failed",
                        listingId: listing.id,
                        guestId: req.user.id,
                    },
                });
                await tx.payment.create({
                    data: {
                        amount,
                        status: paymentSucceeded ? "success" : "failed",
                        bookingId: newBooking.id,
                    },
                });
                return newBooking;
            }, { isolationLevel: "Serializable" });
        }
    } catch (err) {
        if (err.message.includes("DATE_CONFLICT")) {
            req.flash("error", "Those dates are already booked. Please pick different dates.");
            return res.redirect(`/listings/${id}/bookings/new`);
        }
        if (err.code === "P2034") {
            req.flash("error", "Booking conflict detected — please try again.");
            return res.redirect(`/listings/${id}/bookings/new`);
        }
        throw err;
    }

    const via = req.body.useProcedure === "on" ? " (via the book_and_pay() stored procedure)" : "";
    if (booking.status === "confirmed") {
        req.flash("success", `Payment successful! Your booking is confirmed${via}.`);
    } else {
        req.flash("error", `Payment failed. No charge was made — please try again${via}.`);
    }
    res.redirect(`/bookings/${booking.id}`);
};

module.exports.showBooking = async (req, res) => {
    const booking = await prisma.booking.findUnique({
        where: { id: req.params.bookingId },
        include: { listing: true, payment: true },
    });
    if (!booking || booking.guestId !== req.user.id) {
        req.flash("error", "Booking not found");
        return res.redirect("/listings");
    }
    res.render("bookings/show", { booking });
};

module.exports.myBookings = async (req, res) => {
    const bookings = await prisma.booking.findMany({
        where: { guestId: req.user.id },
        include: { listing: true, payment: true },
        orderBy: { createdAt: "desc" },
    });
    res.render("bookings/index", { bookings });
};
