/*jshint esversion: 6*/

var express = require('express'),
  router = express.Router();
var Document = require("../models/Document");
var Collection = require("../models/Collection");
var languageCodeToName = require('../helpers/languages');

// Get a random document to transcribe based upon designated search parameters
router.get('/', async function(req, res){
  var filter = {
    verified: false,
    transcribed: true
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
    const collection = await Collection.findOne({"_id": result.collection_id});

    if(result) res.render("verify", {
      document: result,
      languages: languages,
      codeToName: languageCodeToName,
      collections: collections,
      collection: collection,
      successMessage: req.flash('verify-success'),
      errorMessage: req.flash('verify-error')
    });
  }
  catch{
    res.render("verify", { document: null });
  }

});

// Accept document
router.post('/accept', function(req, res){ //TODO: add error handling
  Document.findOne({
    "_id": req.body.id
  }, function (err, document) {
    document.verified = true;
    document.changelog.push({
      "timestamp": Date.now(),
      "action": "VERIFY"
    });

    document.save(function (err, updatedDocument) {
      if (err) return handleError(err);
      req.flash('verify-success', 'Document accepted, and waiting admin approval!');
      res.sendStatus(200);
    });
  });
});

// Reject document
router.post('/reject', function(req, res){ //TODO: add error handling
  Document.findOne({
    "_id": req.body.id
  }, function (err, document) {
    document.transcribed = false;
    document.changelog.push({
      "timestamp": Date.now(),
      "action": "REJECT_VERIFY"
    });

    document.save(function (err, updatedDocument) {
      if (err) return handleError(err);
      req.flash('verify-error', 'Document successfully rejected.');
      res.sendStatus(200);
    });
  });
});

module.exports = router;
