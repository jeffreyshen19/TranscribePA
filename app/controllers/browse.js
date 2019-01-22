/*jshint esversion: 6 */

var express = require('express'),
  router = express.Router();
var Document = require("../models/Document");
var Collection = require("../models/Collection");
var paginate = require('express-paginate');

// See all completed documents
router.get('/', paginate.middleware(50, 100), async (req, res) => {
  console.log(req.query);

  var filter = {  };

  if(req.query.completed == null || req.query.completed == "true") filter.completed = true;
  else if(req.query.completed == "false") filter.completed = false;

  if(req.query.handwritten == "true") filter.handwritten = true;
  else if(req.query.handwritten == "false") filter.handwritten = false;

  if(req.query.languages && req.query.languages != "all") filter.languages = {"$all": [req.query.languages]};

  const [ results, itemCount ] = await Promise.all([
      Document.find(filter).limit(req.query.limit).skip(req.skip).lean().exec(),
      Document.count(filter)
    ]);

  const pageCount = Math.ceil(itemCount / req.query.limit);

  res.render("browse", {
    documents: results,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
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
