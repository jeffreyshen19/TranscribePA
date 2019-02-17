/*jshint esversion: 6 */

var express = require('express'),
  router = express.Router();
var paginate = require('express-paginate');
var Document = require("../models/Document");
var Collection = require("../models/Collection");
var languageCodeToName = require('../helpers/languages');

// See all completed documents
router.get('/', paginate.middleware(50, 100), async (req, res) => {
  var filter = {  };

  if(req.query.completed == null || req.query.completed == "true") filter.completed = true;
  else if(req.query.completed == "false") filter.completed = false;

  if(req.query.handwritten == "true") filter.handwritten = true;
  else if(req.query.handwritten == "false") filter.handwritten = false;

  if(req.query.languages && req.query.languages != "all") filter.languages = {"$all": [req.query.languages]};

  if(req.query.query) filter["$text"] = {"$search": req.query.query};

  if(req.query.collection) filter.collection_id = req.query.collection;

  try{
    const [ results, itemCount, languages ] = await Promise.all([
        Document.find(filter).limit(req.query.limit).skip(req.skip).lean().exec(),
        Document.countDocuments(filter),
        Document.find(filter).distinct('languages')
      ]);

    const pageCount = Math.ceil(itemCount / req.query.limit);

    res.render("browse", {
      documents: results,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
      languages: languages,
      codeToName: languageCodeToName
    });
  }
  catch{
    res.render("browse", {
      documents: [],
      pageCount: 0,
      itemCount: 0,
      pages: paginate.getArrayPages(req)(3, 0, req.query.page),
      languages: [],
      codeToName: languageCodeToName
    });
  }
});

// View by collection
router.get('/collections', function(req, res){
  Collection.find({}, function(err, collections){
    res.render("collections", {collections: collections});
  });
});

// Download data
router.get('/data', function(req, res){
  var filter = {  };

  if(req.query.completed == null || req.query.completed == "true") filter.completed = true;
  else if(req.query.completed == "false") filter.completed = false;

  if(req.query.handwritten == "true") filter.handwritten = true;
  else if(req.query.handwritten == "false") filter.handwritten = false;

  if(req.query.languages && req.query.languages != "all") filter.languages = {"$all": [req.query.languages]};

  if(req.query.query) filter["$text"] = {"$search": req.query.query};

  if(req.query.collection) filter.collection_id = req.query.collection;

  try{
    Document.find(filter, function(err, results){
      res.json(results);
    })
  }
  catch{
    res.json([]);
  }
});

module.exports = router;
