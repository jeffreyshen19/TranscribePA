var express = require('express'),
  router = express.Router();
var md = require('marked'),
  fs = require("fs");

//Import routes
router.use('/transcribe', require('./transcribe'));
router.use('/admin', require('./admin'));
router.use('/verify', require('./verify'));
router.use('/browse', require('./browse'));
router.use('/document', require('./document'));

//Root routes
router.get('/', function(req, res) {
  res.render("index");
});

// Static pages
router.get('/about', function(req, res) {
  res.render("static", {
    "md": md,
    "markdown": fs.readFileSync("./markdown/about.md").toString(),
    "title": "About"
  });
});

router.get('/help', function(req, res) {
  res.render("static", {
    "md": md,
    "markdown": fs.readFileSync("./markdown/help.md").toString(),
    "title": "Help"
  });
});

router.get('/privacy', function(req, res) {
  res.render("static", {
    "md": md,
    "markdown": fs.readFileSync("./markdown/privacy-policy.md").toString(),
    "title": "Privacy Policy"
  });
});

router.get('/tutorial', function(req, res) {
  res.render("static", {
    "md": md,
    "markdown": fs.readFileSync("./markdown/tutorial.md").toString(),
    "title": "Tutorial"
  });
});

// 404
router.get('*', function(req, res){
  res.status(404);
  res.render('404');
});

module.exports = router;
