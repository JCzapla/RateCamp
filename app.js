var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    Campground          = require("./models/campgrounds"),
    Comment             = require("./models/comments"),
    User                = require("./models/user"),
    passport            = require("passport"),
    flash               = require("connect-flash"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    seedDB              = require("./seeds");
    
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    authRoutes          = require("./routes/auth")    
    
//seedDB();   
//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://jczapla:r4t3c3mp@ds125392.mlab.com:25392/rate_camp")
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Sauron will not have forgotten the sword of Elendil",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.errorMessage = req.flash("error");
    res.locals.succesMessage = req.flash("succes");
    res.locals.currentUser = req.user;
    next();
});


app.use("/", authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP);