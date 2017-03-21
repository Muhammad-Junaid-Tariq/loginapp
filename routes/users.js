var express=require("express");
var router=express.Router();
var User=require("../models/users");
var passport=require("passport");
var LocalStrategy=require("passport-local").Strategy;
//Register
router.get("/register",function(req,res){
    res.render("register");
});

//Login
router.get("/login",function(req,res){
    res.render("login");
});
//Register user
router.post("/register",function(req,res) {
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    console.log(name);

    //validation
    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("username", "Username is required").notEmpty();
    req.checkBody("email", "Email is required").notEmpty();
    req.checkBody("email", "Email is invalid").isEmail();
    req.checkBody("password", "Password is required").notEmpty();
    req.checkBody("password2", "Password do not match").equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        res.render("register", {errors: errors});
    }
    else {
        var newuser = User({
            name: name,
            username: username,
            email: email,
            password: password
        });
        User.createUser(newuser, function (err, user) {
            if (err) throw err;
            console.log(user);
        });
        req.flash("success_msg", "You are registered and can now login");
        res.redirect("/users/login");
    }
});
    passport.use(new LocalStrategy(function (username, password, done) {
        User.getUserByUserName(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false), {message: "Unknown User"};
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, {message: "Invalid Password"});
                }
            });
        });
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.getUserById(id, function (err, user) {
            done(err, user);
        });
    });
    router.post("/login", passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/users/login",
            failureFlash: true
        }),
        function (req, res) {
            res.redirect("/");
        }
    );
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success_msg","You are logged out");
    res.redirect("/users/login");
});
module.exports=router;