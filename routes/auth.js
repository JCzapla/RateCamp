var express     = require("express");
var router      = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/",function(req, res){
    res.render("landing");
});


//Display registration form
router.get("/register", function(req, res) {
    res.render("register");
});


//Adding new user to db
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(error, user){
        if(error){
            console.log(error);
            req.flash("error", error.message);
            return res.redirect("register");
        }
        else{
            passport.authenticate("local")(req, res, function(){
                req.flash("succes", "Successfully registered " + user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});


//Display log in form
router.get("/login", function(req, res) {
    res.render("login");
});


//Login in to site
router.post("/login", passport.authenticate("local",
        {
           successRedirect: "/campgrounds",
           failureRedirect: "/login",
           failureFlash: true
        }), function(req, res) {
    
});


//Logout from site
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("succes", "Succesfully logged out");
    res.redirect("/campgrounds");
});


module.exports = router;