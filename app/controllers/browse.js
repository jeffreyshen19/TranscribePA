var express = require('express'),
  router = express.Router();
var Document = require("../models/Document");
var Collection = require("../models/Collection");

// See all completed documents
router.get('/', function(req, res) {
  Document.find({
    "completed": true
  }, function(err, documents){
    res.render("browse", {documents: documents});
  });
});

// View by collection
router.get('/collections', function(req, res){
  Collection.find({}, function(err, collections){
    res.render("collections", {collections: collections});
  });
});

// View all documents in one collection
router.get('/collections/:slug', function(req, res){
  Collection.findOne({
    slug: slug
  }, function(err, collection){
    Document.find({
      "completed": true,
      "collection_id": collection._id
    }, function(err, documents){
      res.render("browse", {documents: documents});
    });
  });
});

module.exports = router;
