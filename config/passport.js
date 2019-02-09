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
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /*
    LOCAL SIGNUP
  */
};
