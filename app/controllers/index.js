var express = require('express'),
  router = express.Router();

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

// 404
router.get('*', function(req, res){
  res.status(404);
  res.render('404');
});

module.exports = router;
