var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campgrounds"),
    middleware = require("../middleware/index.js");


router.get("/", function (req, res) {
    //  res.render("campgrounds", {
    //    campgrounds: campgrounds
    //  });

    //get all campgrpounds from db
    Campground.find({}, function (err, allCampgrpounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrpounds,
                currentUser: req.user
            });
        }
    });
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});
router.post("/", middleware.isLoggedIn, function (req, res) {
    //get data from form and add to database
    //redirect to campgrounds
    var name = req.body.name;
    var price = req.body.price;
    var desc = req.body.description;
    var image = req.body.image;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newcampground = {
        name: name,
        image: image,
        price: price,
        description: desc,
        author: author
    };
    // create a new campground and save to database
    Campground.create(newcampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//shows more info about one campground
router.get("/:id", function (req, res) {
    //find campground with given id
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundcampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {
                campground: foundcampground
            });
        }
    });
    //render show template with that id

});

//EDIT 
router.get("/:id/edit", middleware.checkCampgroundOwner, function (req, res) {
    //check if logged in

    //does user own the compound
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", {
            campground: foundCampground
        });
    });
});
//UPDATE
router.put("/:id", middleware.checkCampgroundOwner, function (req, res) {
    //find and update 
    //redirect to show page
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, UpdatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE
router.delete("/:id", middleware.checkCampgroundOwner, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;