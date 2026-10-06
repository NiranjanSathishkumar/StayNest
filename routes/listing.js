const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware/index.js");
const multer = require('multer');
const {storage} = require("../config/cloudConfig.js");
const upload = multer({storage});


const listingController = require("../controllers/listings.js");

router
    .route("/")
    .get(wrapAsync(listingController.index))   
    .post(
        isLoggedIn,
        upload.array('listing[image]', 10), 
        validateListing,
        wrapAsync(listingController.createListing)
    );


router.get("/new", isLoggedIn, listingController.renderNewForm);


router
    .route("/:id")
    .get(
        wrapAsync(listingController.showListing))
    .put(
        isLoggedIn, 
        isOwner,
        upload.array("listing[image]", 10), 
        validateListing, 
        wrapAsync(listingController.updateListing)) 
    .delete(
        isLoggedIn, 
        isOwner, 
        wrapAsync(listingController.destroyListing));


router.get("/:id/edit", isLoggedIn, isOwner,
    wrapAsync(listingController.renderEditForm));

module.exports = router;