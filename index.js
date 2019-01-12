var express = require("express"),
  app = express();
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime');

// Configure App
app.use(express.static("./public"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.set('views', './views');
app.set('view engine', 'pug');
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

var storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
    });
  }
});
// var upload = multer({ storage: storage });
app.use(multer({
  storage: storage
}).single("image"));

// Configure Database
mongoose.connect('mongodb://localhost/transcribe-pa');

// Load Routes
app.use(require('./app/controllers'));

// Startup
app.listen(3000);
console.log("Listening on port 3000");

module.exports = app;
