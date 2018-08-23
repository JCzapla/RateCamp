var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campgrounds");
var Comment     = require("../models/comments");
var middleware  = require("../middleware");


//Display form for new comment
router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    });
});


//Adding new comment
router.post("/", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(error, campground){
        if(error){
            req.flash("error", "Something went wrong");
            console.log(error);
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment, function(error, comment){
               if(error){
                   console.log(error);
               }
               else{
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   req.flash("succes", "Added comment");
                   res.redirect("/campgrounds/" + campground._id);
               }
            });
        } 
    });
});


router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(error, foundComment){
    if(error){
        console.log(error);
    }
    else{
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
    }); 
});


router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, foundComment){
        if(error){
            console.log(error);
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(error){
       if(error){
           res.redirect("/campgrounds");
       } 
       else{
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});


//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login");
    }
}


/*function checkCommentOwnership(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundComment.author.id.equals(req.user._id)) {
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