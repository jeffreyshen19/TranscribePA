var LocalStrategy = require('passport-local').Strategy;
var Admin = require('../app/models/Admin');

module.exports = function(passport) {

  /*
    SESSION SETUP
  */

  // Serialize user for session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(function(id, done) {
    Admin.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /*
    LOCAL LOGIN
  */

  passport.use('local-login', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, username, password, done) {
    Admin.findOne({'username' :  username}, function(err, user) {
      if (err)
        return done(err);

      // If no user found
      if (!user)
        return done(null, false, req.flash('login-message', 'No user found.'));

      // If password is wrong
      if (!user.validPassword(password))
        return done(null, false, req.flash('login-message', 'Oops! Wrong password.'));

      //Otherwise, let the user through
      return done(null, user, req.flash("login-message", "Welcome, " + user.name + "!"));
    });

  }));

};
