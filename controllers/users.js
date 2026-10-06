const bcrypt = require("bcryptjs");
const prisma = require("../prisma/client.js");
const { cloudinary } = require("../config/cloudConfig.js");

module.exports.renderSingupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password, fullName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const registeredUser = await prisma.user.create({
            data: {
                email,
                username,
                fullName,
                password: hashedPassword,
            }
        });

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to StayNest");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to StayNest");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Your are Logged Out");
        res.redirect("/listings");
    });
};

module.exports.showProfile = async (req, res) => {
    let id = req.params.id || (req.user ? req.user.id : null);
    if (!id) {
        req.flash("error", "You must be logged in to view your profile");
        return res.redirect("/login");
    }
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        req.flash("error", "User profile not found");
        return res.redirect("/listings");
    }
    const userListings = await prisma.listing.findMany({
        where: { ownerId: user.id },
        include: { images: true }
    });
    userListings.forEach((l) => { l.image = l.images; });
    res.render("users/profile.ejs", { user, userListings });
};

module.exports.renderEditProfileForm = (req, res) => {
    res.render("users/editProfile.ejs", { user: req.user });
};

module.exports.updateProfile = async (req, res) => {
    const { fullName, phone, bio, role, email } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
        req.flash("error", "User not found");
        return res.redirect("/login");
    }

    const updateData = {
        fullName,
        phone,
        bio,
        email
    };

    if (role) {
        // Prevent privilege escalation: only allow setting to "admin" if current user is already an admin
        if (role === "user" || role === "host") {
            updateData.role = role;
            updateData.isHost = (role === "host");
        } else if (role === "admin" && req.user.role === "admin") {
            updateData.role = role;
            updateData.isHost = true;
        }
    }

    if (req.file) {
        if (user.profileImageFilename && user.profileImageFilename !== "defaultavatar") {
            try {
                await cloudinary.uploader.destroy(user.profileImageFilename);
            } catch (err) {
                console.log("Error deleting profile image from cloudinary", err);
            }
        }
        updateData.profileImageUrl = req.file.path;
        updateData.profileImageFilename = req.file.filename;
    }

    await prisma.user.update({
        where: { id: req.user.id },
        data: updateData
    });

    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
};