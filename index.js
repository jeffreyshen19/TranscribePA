var express = require("express"),
  app = express();
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var path = require('path');
var passport = require("passport");
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var config = require("./config.json");
require('dotenv').config();

// Configure Static Resources
app.use(express.static("./public"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/graphics',  express.static(__dirname + '/graphics'));
app.use('/uploads',  express.static(__dirname + '/uploads'));

// Configure Flash and Cookies
app.use(cookieParser("chocolate chip cookies"));
app.use(session({
  secret: 'chocolate chip cookie',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Configure views
app.set('views', './views');
app.set('view engine', 'pug');
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function(req, res, next){ // Automatically pass config variables in local
  res.locals.config = config;
  next();
});
global.appRoot = path.resolve(__dirname);

// Configure Database
mongoose.connect('mongodb://localhost/transcribe-pa');

// Load Routes
app.use(require('./app/controllers'));

// Startup
app.listen(3000);

module.exports = app;
