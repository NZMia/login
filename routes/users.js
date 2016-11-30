var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require('../models/user');
//register
router.get('/register',function(req,res){
    res.render('register');
});

// login
router.get('/login',function(req,res){
    res.render('login');
});

router.post("/register",function (req,res) {
    var name = req.body.name;
    var email = req.body.email;
    var userName = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // validation
    req.checkBody('name','name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('username','UserName is required').notEmpty();
    req.checkBody('password','password is required').notEmpty();
    req.checkBody('password2','passwords not matched').equals(req.body.password);
    var errors = req.validationErrors();

    if(errors)
    {
        res.render('register',{
            errors:errors
        });
    }
    else
    {
       var newUser = new User({
           name:name,
           email:email,
           username:userName,
           password:password
       });
        User.createUser(newUser,
            function (err,user) {
                if(err) throw  err;
                console.log(user);
        });
        req.flash('success_msg','you are register can be login');
        res.redirect('/users/login');
    }
});
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username,function(err,user){
            if(err) throw err;
            if(!user){
                return done(null,false,{message:"Unknown user"});
            }
            User.comparePassword(password, user.password, function(err,isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null,user);
                }else{
                    return done(null,false,{message:"Invalid password"})
                }
            });
        })
    }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});
router.post('/login',
    passport.authenticate('local',{successRedirect:"/",failureRedirect:"/users/login"}),
    function(req, res) {
        res.redirect("/");
        res.redirect('/users/' + req.user.username);
    });
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success_msg","you are logout");
    res.redirect("/users/login");
});
module.exports = router;