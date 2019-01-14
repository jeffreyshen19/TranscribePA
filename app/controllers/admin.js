var express = require('express'),
  router = express.Router();
var fs = require("fs");
var path = require("path");

var Document = require("../models/Document"),
  Collection = require("../models/Collection");
var auth = require("../middleware/auth");
var multer = require("../middleware/multer");
var ocr = require("../helpers/ocr.js");

// Admin Dashboard
router.get("/", function(req, res){
  res.render("admin");
});

// Create Collection and add its documents
router.post("/new-collection", function(req, res){
  // var name = req.body.name,
  //   description = req.body.description,
  //   slug = req.body.slug;

  var collection = new Collection({
    name: "Test Collection",
    img: req.file.path
  });

  collection.save(function (err) {
    if (err) console.log(err);
    res.send("done!");
  });
});

// Add a document to an existing collection
router.post("/new-document", multer.single("image"), function(req, res){
  ocr(req.file.path, {}, function(data){

    if(data === "ERROR") res.send(data);

    console.log(data);

    var document = new Document({
      lines: data.lines,
      raw: data.raw,
      handwritten: data.handwritten,
      languages: data.languages,
      metadata: {},
      transcribed: false,
      verified: false,
      completed: false,
      changelog: [],
      img: path.relative(appRoot, req.file.path)
    });

    document.save(function (err) {
      if (err) console.log(err);
      res.send("done!");
    });
  });
});

// Delete document

// Delete collection and all its documents

// var doc = new Document({
//   lines: 'Anim tempor labore laborum aliquip culpa ut ut enim nostrud ipsum ex laboris quis reprehenderit. Incididunt dolor enim labore id labore veniam consequat eiusmod cupidatat tempor ut commodo ea enim. Ex fugiat fugiat sit voluptate voluptate sit qui sunt aute eu reprehenderit. Velit culpa mollit quis exercitation ea ut tempor duis Lorem.'
// });
//
// doc.save(function (err) {
//   if (err) console.log(err);
//   res.send("done!");
// });

module.exports = router;
