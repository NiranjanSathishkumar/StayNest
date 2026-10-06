const prisma = require("../prisma/client.js");
const { cloudinary } = require("../config/cloudConfig.js");

// Listing.averageRating is recomputed by a DB trigger (review_rating_trigger)
// whenever a Review affecting it is inserted/updated/deleted — read it back
// after each mutation to surface that in the flash message.
async function currentAverageRating(listingId) {
    const listing = await prisma.listing.findUnique({ where: { id: listingId }, select: { averageRating: true } });
    return listing.averageRating.toFixed(1);
}

module.exports.createReview = async (req, res) => {
    const listingId = req.params.id;
    const reviewData = req.body.review || {};
    const images = (req.files && req.files.length > 0)
        ? req.files.map(f => ({ url: f.path, filename: f.filename }))
        : [];

    await prisma.review.create({
        data: {
            comment: reviewData.comment,
            rating: reviewData.rating !== undefined && reviewData.rating !== "" ? Number(reviewData.rating) : null,
            authorId: req.user.id,
            listingId,
            images: {
                create: images
            }
        }
    });

    const avg = await currentAverageRating(listingId);
    req.flash("success", `New Review Created — average rating recomputed to ${avg} (via DB trigger).`);
    res.redirect(`/listings/${listingId}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    const review = await prisma.review.findUnique({
        where: { id: reviewId },
        include: { images: true }
    });

    if (review && review.images && review.images.length > 0) {
        for (let img of review.images) {
            if (img.filename && img.filename !== "reviewImage") {
                try {
                    await cloudinary.uploader.destroy(img.filename);
                } catch (err) {
                    console.error("Cloudinary delete error:", err);
                }
            }
        }
    }

    await prisma.review.delete({ where: { id: reviewId } });
    const avg = await currentAverageRating(id);
    req.flash("success", `Review Deleted — average rating recomputed to ${avg} (via DB trigger).`);
    res.redirect(`/listings/${id}`);
};

module.exports.updateReview = async (req, res) => {
    let { id, reviewId } = req.params;
    const reviewData = req.body.review || {};

    const review = await prisma.review.findUnique({
        where: { id: reviewId },
        include: { images: true }
    });

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    // Handle review image deletions if any are selected
    if (req.body.deleteImages && req.body.deleteImages.length > 0) {
        for (let filename of req.body.deleteImages) {
            if (filename && filename !== "reviewImage") {
                try {
                    await cloudinary.uploader.destroy(filename);
                } catch (err) {
                    console.error("Failed to delete review image from Cloudinary:", err);
                }
            }
        }
        await prisma.reviewImage.deleteMany({
            where: {
                reviewId,
                filename: { in: req.body.deleteImages }
            }
        });
    }

    // Handle new review image uploads
    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(f => ({
            url: f.path,
            filename: f.filename,
            reviewId
        }));
        await prisma.reviewImage.createMany({
            data: newImages
        });
    }

    // Update review comment and rating
    await prisma.review.update({
        where: { id: reviewId },
        data: {
            comment: reviewData.comment,
            rating: reviewData.rating !== undefined && reviewData.rating !== "" ? Number(reviewData.rating) : null
        }
    });

    const avg = await currentAverageRating(id);
    req.flash("success", `Review Updated — average rating recomputed to ${avg} (via DB trigger).`);
    res.redirect(`/listings/${id}`);
};