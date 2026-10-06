const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const prisma = require("./client.js");
const { sampleUsers, sampleListings } = require("./data.js");

const PAYMENT_SUCCESS_RATE = 0.9; // matches controllers/bookings.js

const REVIEW_POOL = {
  5: [
    "Exactly as described, check-in was smooth and the host replied within minutes.",
    "Loved this place. Would book again on our next trip.",
    "Better than the photos, honestly. Comfortable bed, quiet at night.",
    "Host was very responsive and gave great recommendations for nearby food.",
    "Perfect for our weekend trip. Everything was clean and worked as expected.",
    "Great location, easy to find, exactly where the map said it would be.",
    "We stayed three nights and didn't want to leave. Already planning a repeat visit.",
    "Simple, comfortable, and the host checked in on us without being intrusive.",
    "One of the better stays we've had this year. No complaints at all.",
    "Beautiful views from the room, especially in the morning.",
    "Check-in instructions were clear and the place matched the listing exactly.",
    "Spacious for the price, and the host arranged a late checkout without any fuss.",
    "Would recommend to anyone visiting the area. Great value.",
    "The kids loved it, plenty of space to run around.",
    "Peaceful spot, good for unwinding after a long drive.",
    "Host went out of the way to help us plan the local sightseeing.",
    "Comfortable stay, hot water worked fine even early morning.",
    "Everything was as promised, and the host was easy to reach on WhatsApp.",
    "Great for a couple's getaway, quiet and well maintained.",
    "Second time staying here and it's just as good as the first.",
  ],
  4: [
    "Good stay overall, just a bit farther from the main market than we expected.",
    "Nice place, wifi was a little slow in the evenings but otherwise fine.",
    "Comfortable enough for two nights. Would stay again if travelling this way.",
    "Clean and well kept, though the road noise picks up in the morning.",
    "Solid option for the price. Host was polite and quick to respond.",
    "Room was smaller than it looked in the photos, but everything else was fine.",
    "Good location, though parking was a bit tight for our car.",
    "Decent stay, hot water took a few minutes to kick in.",
    "Nice view, and the host was helpful with directions.",
    "Would recommend, just carry a torch for the last stretch of the road at night.",
    "Comfortable bed, though the AC was a bit noisy.",
    "Good value for money, basic but clean.",
    "Enjoyed our stay, breakfast wasn't included but nearby options were good.",
    "Quiet neighbourhood, easy check-in, minor issue with the wifi password.",
    "Pleasant stay, though it took a while for the host to respond initially.",
    "Overall a good experience, would consider staying again on a future trip.",
  ],
  3: [
    "Decent for the price but nothing special. Wifi didn't work for most of our stay.",
    "Location was fine, but the place could use a deeper clean.",
    "It was okay. A few things in the listing didn't quite match reality.",
    "Average stay, host was hard to reach on the day of check-in.",
    "Comfortable enough but noisier than expected, especially at night.",
    "Fine for a short stopover, wouldn't plan a longer trip around it.",
    "Some maintenance issues — a leaking tap and a door that didn't lock properly.",
    "Photos looked better than the actual place, but it did the job.",
    "Mixed experience. Great location, but the room itself needed some upkeep.",
    "It's a budget option and feels like one. Manage expectations accordingly.",
    "Stay was fine, just a lot smaller than we expected from the listing.",
    "Not bad, but we probably wouldn't choose it again given other options nearby.",
  ],
  2: [
    "Room wasn't as clean as we'd hoped. Had to ask for fresh sheets.",
    "Host was slow to respond and check-in was delayed by almost two hours.",
    "The pictures were misleading — the actual place felt run down.",
    "Noisy street outside made it hard to sleep, wasn't mentioned in the listing.",
    "Amenities listed weren't all available. No hot water on our first night.",
    "Disappointing for the price we paid. Wouldn't book again.",
    "Had trouble getting a response for a maintenance issue during our stay.",
  ],
  1: [
    "Cancelled on us a day before check-in with no proper explanation.",
    "Nothing like the photos. Would not recommend.",
    "Extremely poor upkeep, we left a night early.",
    "Booking process was fine but the actual stay was a letdown from start to finish.",
  ],
};

const DAY_MS = 24 * 60 * 60 * 1000;

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

// Weighted star rating: mostly good, a realistic minority of mediocre/bad ones.
function randomRating() {
  const r = Math.random();
  if (r < 0.45) return 5;
  if (r < 0.75) return 4;
  if (r < 0.90) return 3;
  if (r < 0.97) return 2;
  return 1;
}

// Most listings get a handful of reviews, a few are brand new, a few are "popular".
function reviewCountFor() {
  const r = Math.random();
  if (r < 0.12) return randInt(0, 2);
  if (r < 0.70) return randInt(3, 9);
  if (r < 0.93) return randInt(10, 17);
  return randInt(18, 28);
}

function pastDate(maxDaysAgo) {
  return new Date(Date.now() - randInt(1, maxDaysAgo) * DAY_MS);
}

function toUtcDate(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

async function main() {
  console.log("Clearing existing database records...");
  await prisma.payment.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.reviewImage.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.listingImage.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Seeding users (password for everyone: '1234')...");
  const passwordHash = await bcrypt.hash("1234", 10);

  const userRows = sampleUsers.map((u) => ({
    id: crypto.randomUUID(),
    email: u.email,
    username: u.username,
    fullName: u.fullName,
    password: passwordHash,
    phone: u.phone || null,
    bio: u.bio || null,
    isHost: u.isHost,
    role: u.role,
    profileImageUrl: u.profileImageUrl,
    profileImageFilename: "defaultavatar",
  }));
  await prisma.user.createMany({ data: userRows });
  const userIdByEmail = new Map(userRows.map((u) => [u.email, u.id]));
  const allUserIds = userRows.map((u) => u.id);
  console.log(`  ${userRows.length} users created`);

  console.log("Seeding listings...");
  const listingRows = sampleListings.map((l) => ({
    id: crypto.randomUUID(),
    title: l.title,
    description: l.description,
    price: l.price,
    location: l.location,
    country: l.country,
    category: l.category,
    amenities: l.amenities,
    ownerId: userIdByEmail.get(l.hostEmail),
  }));
  await prisma.listing.createMany({ data: listingRows });
  console.log(`  ${listingRows.length} listings created`);

  console.log("Seeding listing images...");
  const imageRows = [];
  sampleListings.forEach((l, i) => {
    for (const img of l.image) {
      imageRows.push({
        id: crypto.randomUUID(),
        filename: img.filename,
        url: img.url,
        listingId: listingRows[i].id,
      });
    }
  });
  await prisma.listingImage.createMany({ data: imageRows });
  console.log(`  ${imageRows.length} listing images created`);

  console.log("Seeding reviews...");
  const reviewRows = [];
  for (const listing of listingRows) {
    const candidates = allUserIds.filter((id) => id !== listing.ownerId);
    const count = reviewCountFor();
    for (let i = 0; i < count; i++) {
      const rating = randomRating();
      reviewRows.push({
        id: crypto.randomUUID(),
        comment: pick(REVIEW_POOL[rating]),
        rating,
        authorId: pick(candidates),
        listingId: listing.id,
        createdAt: pastDate(650),
      });
    }
  }
  // Batch the insert — a single INSERT with 1000+ rows works fine on Postgres,
  // but chunk it to keep individual statements a reasonable size.
  const REVIEW_CHUNK = 500;
  for (let i = 0; i < reviewRows.length; i += REVIEW_CHUNK) {
    await prisma.review.createMany({ data: reviewRows.slice(i, i + REVIEW_CHUNK) });
  }
  console.log(`  ${reviewRows.length} reviews created (Listing.averageRating recomputed per row by the DB trigger)`);

  console.log("Seeding bookings & payments...");
  const bookingRows = [];
  const paymentRows = [];
  const confirmedRangesByListing = new Map();

  const TARGET_BOOKINGS = 650;
  let attempts = 0;
  while (bookingRows.length < TARGET_BOOKINGS && attempts < TARGET_BOOKINGS * 4) {
    attempts++;
    const listing = pick(listingRows);
    const guestCandidates = allUserIds.filter((id) => id !== listing.ownerId);
    const guestId = pick(guestCandidates);

    const isFuture = Math.random() < 0.3;
    const nights = randInt(1, 7);
    const checkIn = isFuture
      ? toUtcDate(new Date(Date.now() + randInt(3, 180) * DAY_MS))
      : toUtcDate(new Date(Date.now() - randInt(5, 600) * DAY_MS));
    const checkOut = new Date(checkIn.getTime() + nights * DAY_MS);

    const existing = confirmedRangesByListing.get(listing.id) || [];
    const conflict = existing.some((r) => rangesOverlap(checkIn, checkOut, r.checkIn, r.checkOut));
    if (conflict) continue;

    const paymentSucceeded = Math.random() < PAYMENT_SUCCESS_RATE;
    const status = paymentSucceeded ? "confirmed" : "failed";
    const amount = Math.round(listing.price * nights);
    const bookingId = crypto.randomUUID();

    bookingRows.push({
      id: bookingId,
      amount,
      checkIn,
      checkOut,
      status,
      listingId: listing.id,
      guestId,
      createdAt: isFuture ? pastDate(30) : new Date(checkIn.getTime() - randInt(1, 20) * DAY_MS),
    });
    paymentRows.push({
      id: crypto.randomUUID(),
      amount,
      status: paymentSucceeded ? "success" : "failed",
      bookingId,
      createdAt: bookingRows[bookingRows.length - 1].createdAt,
    });

    if (paymentSucceeded) {
      existing.push({ checkIn, checkOut });
      confirmedRangesByListing.set(listing.id, existing);
    }
  }

  const BOOKING_CHUNK = 500;
  for (let i = 0; i < bookingRows.length; i += BOOKING_CHUNK) {
    await prisma.booking.createMany({ data: bookingRows.slice(i, i + BOOKING_CHUNK) });
  }
  for (let i = 0; i < paymentRows.length; i += BOOKING_CHUNK) {
    await prisma.payment.createMany({ data: paymentRows.slice(i, i + BOOKING_CHUNK) });
  }
  console.log(`  ${bookingRows.length} bookings + payments created`);

  // A couple of guaranteed, easy-to-find bookings for the demo account so the
  // "My Bookings" page always has something to show right after seeding.
  const demoId = userIdByEmail.get("demo@gmail.com");
  if (demoId && listingRows.length >= 2) {
    const past = listingRows[0];
    const upcoming = listingRows[1];
    const pastCheckIn = toUtcDate(new Date(Date.now() - 10 * DAY_MS));
    const pastCheckOut = toUtcDate(new Date(Date.now() - 7 * DAY_MS));
    const upcomingCheckIn = toUtcDate(new Date(Date.now() + 14 * DAY_MS));
    const upcomingCheckOut = toUtcDate(new Date(Date.now() + 17 * DAY_MS));

    await prisma.booking.create({
      data: {
        amount: past.price * 3,
        checkIn: pastCheckIn,
        checkOut: pastCheckOut,
        status: "confirmed",
        listingId: past.id,
        guestId: demoId,
        payment: { create: { amount: past.price * 3, status: "success" } },
      },
    });
    await prisma.booking.create({
      data: {
        amount: upcoming.price * 3,
        checkIn: upcomingCheckIn,
        checkOut: upcomingCheckOut,
        status: "confirmed",
        listingId: upcoming.id,
        guestId: demoId,
        payment: { create: { amount: upcoming.price * 3, status: "success" } },
      },
    });
    console.log("  2 guaranteed bookings added for demo@gmail.com");
  }

  console.log("\nDatabase seeding complete.");
  console.log("-------------------------------------------------------");
  console.log(`Users: ${userRows.length}  Listings: ${listingRows.length}  Reviews: ${reviewRows.length}  Bookings: ${bookingRows.length + 2}`);
  console.log("All passwords: 1234");
  console.log("Try: demo@gmail.com (guest) or neha.kulkarni@gmail.com (host)");
  console.log("-------------------------------------------------------");
}

main()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
