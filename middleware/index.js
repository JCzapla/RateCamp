var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err || !foundCampground){
               req.flash("error", "Campgrounds not found");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have premission to do that");
                res.redirect("back");
            }
           }
        });
    }
    else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
};


middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have premission to do that");
                res.redirect("back");
            }
           }
        });
    } 
    else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
};


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error", "You need to be logged in");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;