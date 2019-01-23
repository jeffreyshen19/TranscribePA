/*jshint esversion: 6*/

var express = require('express'),
  router = express.Router();
var Document = require("../models/Document");
var Collection = require("../models/Collection");
var languageCodeToName = require('../helpers/languages');

// Get a random document to transcribe based upon designated search parameters
router.get('/', async function(req, res){
  var filter = {
    transcribed: false
  };

  if(req.query.handwritten == "true") filter.handwritten = true;
  else if(req.query.handwritten == "false") filter.handwritten = false;

  if(req.query.languages && req.query.languages != "all") filter.languages = {"$all": [req.query.languages]};

  if(req.query.collection) filter.collection_id = req.query.collection;

  try{
    const [ count, languages, collections] = await Promise.all([
      Document.count(filter),
      Document.find(filter).distinct('languages'),
      Collection.find()
    ]);

    const result = await Document.findOne(filter).skip(Math.floor(Math.random() * count)).exec();

    if(result == null) res.render("404"); //TODO: make this an error page instead
    else res.render("transcribe", {
      document: result,
      languages: languages,
      codeToName: languageCodeToName,
      collections: collections
    });
  }
  catch{
    res.render("404");
  }

});

module.exports = router;
