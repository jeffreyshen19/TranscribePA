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

    const collection = await Collection.findOne({"_id": result.collection_id});

    if(result) res.render("transcribe", {
      document: result,
      languages: languages,
      codeToName: languageCodeToName,
      collections: collections,
      collection: collection,
      messages: req.flash('success-transcribe')
    });
  }
  catch{
    res.render("404");
  }

});

// Submit document
router.post('/finish', function(req, res){ //TODO: add error handling
  Document.findOne({
    "_id": req.body.id
  }, function (err, document) {
    if(!document.transcribed){
      document.changelog.push({
        "timestamp": Date.now(),
        "prevVersion": document.lines,
        "action": "TRANSCRIBE"
      });
      document.lines = req.body.transcription;
      document.raw = req.body.transcription.replace(/\n/g, ' ').replace(/ - /g, "");
      document.languages = req.body.languages;
      document.transcribed = true;

      document.save(function (err, updatedDocument) {
        if (err) return handleError(err);
        req.flash('success-transcribe', 'Document successfully transcribed and awaiting verification!');
        res.sendStatus(200);
      });
    }
  });
});


// Save document

module.exports = router;
