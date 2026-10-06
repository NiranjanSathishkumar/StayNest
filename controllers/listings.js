const prisma = require("../prisma/client.js");
const { cloudinary } = require("../config/cloudConfig.js");

module.exports.index = async (req, res) => {
    const { search, category, minPrice, maxPrice, greatValue } = req.query;

    const where = {};

    if (search && search.trim()) {
        const term = search.trim();
        where.OR = [
            { title: { contains: term, mode: "insensitive" } },
            { location: { contains: term, mode: "insensitive" } },
            { country: { contains: term, mode: "insensitive" } },
            { description: { contains: term, mode: "insensitive" } },
        ];
    }

    if (category && category !== "trending") {
        // Map filter tab data-category values to listing model categories
        const categoryMap = {
            room: "house",
            beachfront: "beach-house",
            arctic: "mountain-lodge",
            countryside: "cottage",
            cabins: "cabin",
            pools: "villa",
            views: "hotel",
            camping: "camping",
            farms: "farmhouse",
            islands: "resort",
            luxe: "resort",
            iconic: "hotel",
            tiny: "bungalow",
            towers: "apartment",
            trekking: "mountain-lodge",
            wellness: "resort",
            temples: "guest-house",
            farmstay: "farmhouse",
        };
        where.category = categoryMap[category] || category;
    }

    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
    }

    // Nested query (correlated): "Great Value" filter — cheaper than the
    // average price of other listings in the same category. Correlated because
    // the inner SELECT references l1.category from the outer query, re-running
    // per row rather than once for the whole table.
    const goodValueRows = await prisma.$queryRaw`
        SELECT id FROM "Listing" l1
        WHERE price < (SELECT AVG(price) FROM "Listing" l2 WHERE l2.category = l1.category)
    `;
    const greatValueIdSet = new Set(goodValueRows.map((r) => r.id));

    if (greatValue === "true") {
        where.id = { in: goodValueRows.map((r) => r.id) };
    }

    const allListings = await prisma.listing.findMany({
        where,
        include: { images: true }
    });

    // Tag each listing with isGreatValue for badge display and provide .image alias for views
    allListings.forEach((l) => {
        l.image = l.images;
        l.isGreatValue = greatValueIdSet.has(l.id);
    });

    res.render("listings/index", {
        allListings,
        activeCategory: category || "trending",
        searchQuery: search || "",
        minPrice: minPrice || "",
        maxPrice: maxPrice || "",
        greatValue: greatValue === "true",
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

module.exports.createListing = async (req, res, next) => {
    const listingData = req.body.listing || {};
    const images = (req.files && req.files.length > 0)
        ? req.files.map(f => ({ url: f.path, filename: f.filename }))
        : [];

    await prisma.listing.create({
        data: {
            title: listingData.title,
            description: listingData.description,
            price: listingData.price !== undefined && listingData.price !== "" ? Number(listingData.price) : null,
            location: listingData.location,
            country: listingData.country,
            category: listingData.category,
            amenities: Array.isArray(listingData.amenities)
                ? listingData.amenities
                : (listingData.amenities ? [listingData.amenities] : []),
            ownerId: req.user.id,
            images: {
                create: images
            }
        }
    });

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await prisma.listing.findUnique({
        where: { id },
        include: {
            images: true,
            owner: true,
            reviews: { include: { author: true, images: true } },
        },
    });
    if(!listing){
        req.flash("error", "Listing You Requested DOESN'T EXIST")
        return res.redirect("/listings");
    }

    listing.image = listing.images;
    listing.reviews.forEach((review) => { review.image = review.images; });

    // GROUP BY: rating distribution computed by the database instead of
    // counting in application code from the already-loaded reviews array.
    const ratingGroups = await prisma.$queryRaw`
        SELECT rating, COUNT(*) AS count FROM "Review"
        WHERE "listingId" = ${id} AND rating IS NOT NULL
        GROUP BY rating
    `;
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const row of ratingGroups) {
        ratingCounts[row.rating] = Number(row.count);
    }

    // View: owner-only analytics (review count, avg rating, bookings, revenue)
    // pulled from the listing_stats SQL view rather than assembled here.
    let analytics = null;
    if (req.user && listing.owner && req.user.id === listing.owner.id) {
        const [stats] = await prisma.$queryRaw`SELECT * FROM listing_stats WHERE listing_id = ${id}`;
        analytics = stats;
    }

    res.render("listings/show", { listing, ratingCounts, analytics });
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await prisma.listing.findUnique({
        where: { id },
        include: { images: true }
    });
    if(!listing){
        req.flash("error", "Listing You Requested DOESN'T EXIST")
        return res.redirect("/listings");
    }
    listing.image = listing.images;
    res.render("listings/edit", {listing});
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    const listingData = req.body.listing || {};

    const data = {};
    if (listingData.title !== undefined) data.title = listingData.title;
    if (listingData.description !== undefined) data.description = listingData.description;
    if (listingData.price !== undefined) data.price = listingData.price !== "" ? Number(listingData.price) : null;
    if (listingData.location !== undefined) data.location = listingData.location;
    if (listingData.country !== undefined) data.country = listingData.country;
    if (listingData.category !== undefined) data.category = listingData.category;
    if (listingData.amenities !== undefined) {
        data.amenities = Array.isArray(listingData.amenities) ? listingData.amenities : [listingData.amenities];
    }

    if (Object.keys(data).length > 0) {
        await prisma.listing.update({
            where: { id },
            data
        });
    }

    if (req.body.deleteImages && req.body.deleteImages.length > 0) {
        for (let filename of req.body.deleteImages) {
            if (filename && filename !== "listingimage") {
                try {
                    await cloudinary.uploader.destroy(filename);
                } catch (err) {
                    console.error("Cloudinary delete error:", err);
                }
            }
        }
        await prisma.listingImage.deleteMany({
            where: {
                listingId: id,
                filename: { in: req.body.deleteImages }
            }
        });
    }

    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(f => ({
            url: f.path,
            filename: f.filename,
            listingId: id
        }));
        await prisma.listingImage.createMany({
            data: newImages
        });
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    const listing = await prisma.listing.findUnique({
        where: { id },
        include: { images: true, reviews: { include: { images: true } } }
    });

    if (listing) {
        for (const review of listing.reviews) {
            for (const img of review.images) {
                if (img.filename && img.filename !== "reviewImage") {
                    try {
                        await cloudinary.uploader.destroy(img.filename);
                    } catch (err) {
                        console.error("Cloudinary review image delete error:", err);
                    }
                }
            }
        }
        for (const img of listing.images) {
            if (img.filename && img.filename !== "listingimage") {
                try {
                    await cloudinary.uploader.destroy(img.filename);
                } catch (err) {
                    console.error("Cloudinary listing image delete error:", err);
                }
            }
        }
        await prisma.listing.delete({ where: { id } });
    }

    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};