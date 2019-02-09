var colors = require('colors');
var readline = require('readline');
var mongoose = require("mongoose");
var Admin = require("../models/Admin");

var Writable = require('stream').Writable;
var mutableStdout = new Writable({
  write: function(chunk, encoding, callback) {
    if (!this.muted)
      process.stdout.write(chunk, encoding);
    callback();
  }
});

mutableStdout.muted = false;

var rl = readline.createInterface({
  input: process.stdin,
  output: mutableStdout,
  terminal: true
});

mongoose.connect('mongodb://localhost/transcribe-pa', {useNewUrlParser: true});
console.log("Welcome to the admin creation console!".bold.green);

rl.question("Please enter a username (i.e. librarian1010): ", function(username){
  rl.question("Please enter your name (i.e. Jane Doe): ", function(name){
    rl.question("Please enter a password: ", function(password){
      console.log();

      Admin.findOne({'username': username}, function(err, user) {
        if(user) {
          console.log("That username is already taken".bold.red);
          rl.close();
          mongoose.connection.close();
        }
        else{
          var newAdmin = new Admin();
          newAdmin.username = username;
          newAdmin.name = name;
          newAdmin.password = newAdmin.generateHash(password);

          newAdmin.save(function(err){
            if(err) console.log(err);
            else console.log(("Successfully registered " + username + " as admin").bold.green);

            rl.close();
            mongoose.connection.close();
          });
        }
      });

    });

    mutableStdout.muted = true;

  });
});
