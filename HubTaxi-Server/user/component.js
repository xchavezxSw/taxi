// Generated by CoffeeScript 1.7.1
(function () {
    var FacebookStrategy, LocalStrategy, User, Utils, async, hash, localStrategy, passport;

    async = require('async');

    hash = require('../utils/pass').hash;

    Utils = require('../utils/utils').Utils;

    passport = require("passport");

    LocalStrategy = require('passport-local').Strategy;

    FacebookStrategy = require('passport-facebook').Strategy;

    User = require('./user').User;


    /*
     PassPort Setttings
     */

    localStrategy = new LocalStrategy({
        usernameField: 'username',
        passReqToCallback: true
    }, function ( req, username, password, done ) {
console.log("localStrategy")
        var siteId;
        siteId = req.body.siteId || '0';
console.log("localStrategy2")
        User.authenticate(siteId, username, password, done);
        console.log("localStrategy3")
    });

    passport.use(localStrategy);

    passport.use(new FacebookStrategy({
        clientID: "YOUR ID",
        clientSecret: "YOUR CODE",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    }, function ( accessToken, refreshToken, profile, done ) {
        User.authenticateFb(accessToken, refreshToken, profile, done);
    }));

    passport.serializeUser(function ( user, done ) {
        done(null, user.id);
    });

    passport.deserializeUser(function ( id, done ) {
        User.deserializeUser(id, done);
    });

    exports.User = User;

    exports.passport = passport;

}).call(this);

//# sourceMappingURL=component.map
