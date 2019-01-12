var express = require('express'),
  router = express.Router();

//Import routes
// router.use('/transcribe', require('./transcribe'));
router.use('/admin', require('./admin'));
// router.use('/verify', require('./verify'));
router.use('/browse', require('./browse'));

//Root routes
router.get('/', function(req, res) {
  res.render("index");
});

module.exports = router;
