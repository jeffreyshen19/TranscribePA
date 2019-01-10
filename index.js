var express = require("express"),
  app = express();
var mongoose = require("mongoose");

app.use(express.static("./public"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.set('views', './views');
app.set('view engine', 'pug');

//Load Routes
app.use(require('./app/controllers'));

//Startup
app.listen(3000);
console.log("Listening on port 3000");

module.exports = app;
