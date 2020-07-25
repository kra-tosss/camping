var middleware = {};

var Campground = require("../models/campgrounds"),
    Comment = require("../models/comment");

middleware.checkCampgroundOwner = function (req, res, next) {
    if (req.isAuthenticated()) {
        //does user own the compound
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not Found");
                res.redirect("back")
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }

            }
        });

    } else {
        res.redirect("back");
    }

}

middleware.checkCommentOwner = function (req, res, next) {
    if (req.isAuthenticated()) {
        //does user own the compound
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                req.flash("error", "Comment not Found");
                res.redirect("back")
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }

            }
        });

    } else {
        req.flash("error", "You need to be loggen in do that");
        res.redirect("back");
    }
}

middleware.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to that");
    res.redirect("/login");
}

module.exports = middleware;