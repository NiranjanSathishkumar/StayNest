const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware/index.js");
const multer = require('multer');
const {storage} = require("../config/cloudConfig.js");
const upload = multer({storage});

const reviewContorller = require("../controllers/review.js");

// Post Route
router.post("/", isLoggedIn,
    upload.array('review[image]', 5),
    validateReview,
    wrapAsync(reviewContorller.createReview));

// Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,
    wrapAsync(reviewContorller.destroyReview)
);

// Put Route
router.put("/:reviewId", isLoggedIn, isReviewAuthor,
    upload.array('review[image]', 5),
    validateReview,
    wrapAsync(reviewContorller.updateReview)
);

module.exports = router;