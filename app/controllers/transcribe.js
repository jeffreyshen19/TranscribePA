var express = require('express'),
  router = express.Router();
var Document = require("../models/Document");

// Get a random document to transcribe based upon designated search parameters
router.get('/', function(req, res){
  var filter = {
    transcribed: false
  };
  
  Document.count(filter).exec(function (err, count) {
    var random = Math.floor(Math.random() * count);

    Document.findOne(filter).skip(random).exec(
      function (err, result) {
        res.render("transcribe", {
          document: result
        });
      });
  });
});

module.exports = router;
