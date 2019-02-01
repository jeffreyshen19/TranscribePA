var express = require('express'),
  router = express.Router();
var Document = require("../models/Document");
var Collection = require("../models/Collection");
var paginate = require('express-paginate');

// View a document
router.get('/:id', function(req, res){
  Document.findOne({
    "_id": req.params.id
  }, function(err, document){
    Collection.findOne({
      "_id": document.collection_id
    }, function(err, collection){
      res.render("document", {"document": document, "collection": collection});
    });
  });
});

module.exports = router;
