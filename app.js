const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
if (process.resourcesPath) {
    dotenv.config({ path: path.join(process.resourcesPath, ".env") });
}

// Fallback defaults for standalone packaging (ensures professor can run .exe with 0 configuration)
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres.pgdxrszdbaijejrwhpxs:Superbase%40123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres";
process.env.SECRET = process.env.SECRET || "mySuperSecretCodeIsPassword";
process.env.CLOUD_NAME = process.env.CLOUD_NAME || "mj9jb9ik";
process.env.CLOUD_API_KEY = process.env.CLOUD_API_KEY || "255973885311815";
process.env.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || "zuMw_z1BXY7LR7i7iMXzANKTkY8";


const express = require("express");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const prisma = require("./prisma/client.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: process.env.SECRET || "mySuperSecretCodeIsPassword",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return done(null, false, { message: "Incorrect username" });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return done(null, false, { message: "Incorrect password" });
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.searchQuery = req.query.search || "";
    res.locals.activeCategory = req.query.category || "trending";
    res.locals.minPrice = req.query.minPrice || "";
    res.locals.maxPrice = req.query.maxPrice || "";
    next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/listings/:id/bookings", bookingRouter);
app.use("/", userRouter);

// Legal pages
app.get("/terms", (req, res) => res.render("legal/terms.ejs"));
app.get("/privacy", (req, res) => res.render("legal/privacy.ejs"));

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
})

app.use((err, req, res, next) => {
    console.error("Error handler caught:", err);
    if (res.headersSent) {
        return next(err);
    }
    let {statusCode=500, message="Something Went Wrong"} = err;
    res.status(statusCode).render("listings/error.ejs", {err});
})

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    const addr = server.address();
    console.log(`Server is listening to port ${addr ? addr.port : PORT}`);
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.warn(`Port ${PORT} is in use, falling back to a free port...`);
        server.listen(0);
    } else {
        console.error("Server error:", err);
    }
});

module.exports = { app, server };
