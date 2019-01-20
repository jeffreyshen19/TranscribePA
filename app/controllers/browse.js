/*jshint esversion: 6 */

var express = require('express'),
  router = express.Router();
var Document = require("../models/Document");
var Collection = require("../models/Collection");
var paginate = require('express-paginate');

// See all completed documents
router.get('/', paginate.middleware(50, 100), async (req, res) => {
  const [ results, itemCount ] = await Promise.all([
      Document.find({completed: true}).limit(req.query.limit).skip(req.skip).lean().exec(),
      Document.count({completed: true})
    ]);

  const pageCount = Math.ceil(itemCount / req.query.limit);

  res.render("browse", {
    documents: results,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
  });
});

// See all documents
router.get('/all', paginate.middleware(50, 100), async (req, res) => {
  const [ results, itemCount ] = await Promise.all([
      Document.find({}).limit(req.query.limit).skip(req.skip).lean().exec(),
      Document.count({})
    ]);

  const pageCount = Math.ceil(itemCount / req.query.limit);

  res.render("browse", {
    documents: results,
    pageCount,
    itemCount,
    currentPage: req.query.page,
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
