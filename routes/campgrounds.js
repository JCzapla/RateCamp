var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campgrounds");
var middleware  = require("../middleware");


//Index route
router.get("/", function(req, res){
    Campground.find({}, function(error, campgrounds){
       if(error){
           console.log(error);
       } 
       else{
            res.render("campgrounds/index", {campgrounds: campgrounds});
       }
    });
});


//Create route
router.post("/", middleware.isLoggedIn, function(req, res){
    var author = {id: req.user._id, username: req.user.username};
    var newCampground = {name: req.body.name, image: req.body.image, description: req.body.description, author: author};
    Campground.create(newCampground, function(error, newlyCreatedCampground){
        if(error){
            console.log(error);
        }
        else{
            res.redirect("/campgrounds");    
        }
    });
});


//New route
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});


//Show route
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCamp){
       if(error || !foundCamp){
           req.flash("error", "Campground not found");
           res.redirect("back");
           console.log(error);
       }
       else{
            res.render("campgrounds/show", {campgrounds: foundCamp}); 
       }
    });
});


//Edit route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(error, foundCamp){
       if(error){
           
           console.log(error);
       }
       else{
            res.render("campgrounds/edit", {campgrounds: foundCamp});
       }
    });
});


//Update route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, foundCamp){
        if(error){
            console.log(error);
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//Destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(error){
       if(error){
           res.redirect("/campgrounds");
       } 
       else{
           res.redirect("/campgrounds");
       }
    });
});

//Middleware
/*function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login");
    }
}*/


/*function checkCampgroundOwnership(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}*/



module.exports = router;