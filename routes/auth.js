var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

router.get("/", function (req, res) {
    res.render("landing");
});


//show regsiteration form
router.get("/register", function (req, res) {
    res.render("register");
});

//handle sign up form
router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp" + user.username);
            res.redirect("/campgrounds");
        });
    })
})

//SHOW LOGIN
router.get("/login", function (req, res) {
    res.render("login");
});

//login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {

});

//logout
router.get("/logout", function (req, res) {
    req.logOut();
    req.flash("success", "Logged You Out");
    res.redirect("/campgrounds");
});


module.exports = router;