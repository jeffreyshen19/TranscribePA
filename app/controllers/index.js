var express = require('express'),
  router = express.Router();

//Import routes
router.use('/transcribe', require('./transcribe'));
router.use('/admin', require('./admin'));
router.use('/verify', require('./verify'));
router.use('/browse', require('./browse'));

//
router.get('/', function(req, res) {

});

module.exports = router;
