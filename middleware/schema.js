const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.alternatives().try(
            Joi.array().items(
                Joi.object({
                    filename: Joi.string().allow("", null),
                    url: Joi.string().allow("", null),
                })
            ),
            Joi.object({
                filename: Joi.string().allow("", null),
                url: Joi.string().allow("", null),
            })
        ).allow("", null),
        category: Joi.string().valid("apartment", "house", "villa", "cabin", "cottage", "farmhouse", "beach-house", "mountain-lodge", "treehouse", "bungalow", "guest-house", "hostel", "hotel", "resort", "camping").allow("", null),
        amenities: Joi.array().items(
            Joi.string().valid("wifi", "air-conditioning", "kitchen", "free-parking", "washing-machine", "swimming-pool", "pet-friendly", "tv", "workspace", "hot-water")
        ).allow(null)
    }).required(),
    deleteImages: Joi.array().items(Joi.string()).allow(null)
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
        image: Joi.alternatives().try(
            Joi.array().items(
                Joi.object({
                    filename: Joi.string().allow("", null),
                    url: Joi.string().allow("", null),
                })
            ),
            Joi.object({
                filename: Joi.string().allow("", null),
                url: Joi.string().allow("", null),
            })
        ).allow("", null)
    }).required(),
    deleteImages: Joi.array().items(Joi.string()).allow(null)
});