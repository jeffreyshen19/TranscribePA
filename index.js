var express = require("express"),
  app = express();
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var path = require('path');
require('dotenv').config();

// Configure App
app.use(express.static("./public"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.set('views', './views');
app.set('view engine', 'pug');
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));
global.appRoot = path.resolve(__dirname);

// Configure Database
mongoose.connect('mongodb://localhost/transcribe-pa');

// Load Routes
app.use(require('./app/controllers'));

// Startup
app.listen(3000);
console.log("Listening on port 3000");

module.exports = app;
