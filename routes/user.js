const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {savedRedirectUrl} = require("../middleware/index.js");

const userController = require("../controllers/users.js");
const pagesController = require("../controllers/pages.js");

// Root landing page
router.get("/", wrapAsync(pagesController.renderLandingPage));

router
    .route("/signup")
    .get(userController.renderSingupForm)
    .post(wrapAsync(userController.signup));


router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(savedRedirectUrl,
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true
        }),
        userController.login
    );

router.get("/logout", userController.logout);

// Profile routes
const {isLoggedIn} = require("../middleware/index.js");
const multer = require('multer');
const {storage} = require("../config/cloudConfig.js");
const upload = multer({storage});

router.get("/profile", isLoggedIn, wrapAsync(userController.showProfile));
router.get("/profile/edit", isLoggedIn, wrapAsync(userController.renderEditProfileForm));
router.put("/profile", isLoggedIn, upload.single("profileImage"), wrapAsync(userController.updateProfile));
router.get("/profile/:id", wrapAsync(userController.showProfile));

// Bookings ("My Bookings" + single booking receipt)
const bookingController = require("../controllers/bookings.js");
router.get("/bookings", isLoggedIn, wrapAsync(bookingController.myBookings));
router.get("/bookings/:bookingId", isLoggedIn, wrapAsync(bookingController.showBooking));


module.exports = router;