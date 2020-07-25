var express = require("express"),
    router = express.Router({
        mergeParams: true
    });

var Campground = require("../models/campgrounds"),
    Comment = require("../models/comment"),
    middleware = require("../middleware/index.js");


router.get("/new", middleware.isLoggedIn, function (req, res) {
    // find new campground
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                campground: campground
            });
        }
    });
});


router.post("/", middleware.isLoggedIn, function (req, res) {
    //find campground using id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment then save
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
    //create comment
    //add comment to campgound
    //redirect
});

//Edit Comment
router.get("/:comment_id/edit", middleware.checkCommentOwner, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {
                campground_id: req.params.id,
                comment: foundComment
            });
        }
    });
});

//comment update
router.put("/:comment_id/", middleware.checkCommentOwner, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//comment delete
router.delete("/:comment_id", middleware.checkCommentOwner, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;