var express = require('express'),
  router = express.Router();
var fs = require("fs");
var path = require("path");
var unzipper = require("unzipper");
var slugify = require("slugify");

var Document = require("../models/Document"),
  Collection = require("../models/Collection");
var auth = require("../middleware/auth");
var multer = require("../middleware/multer");
var ocr = require("../helpers/ocr.js");

// Admin Dashboard
router.get("/", function(req, res){
  res.render("admin");
});

// Review documents
router.get("/review", function(req, res){
  res.render("admin-review");
});

// Manage collections
router.get("/collections", function(req, res){
  res.render("admin-collections");
});

// Create collection
router.get("/create", function(req, res){
  res.render("admin-create");
});


// Create Collection and add its documents
router.post("/new-collection", multer.fields([{name: 'zip', maxCount: 1}, {name: 'img', maxCount: 1}]), function(req, res){
  var name = req.body.name,
    description = req.body.description,
    slug = slugify(req.body.name.toLowerCase());

  var collection = new Collection({
    name: name,
    description: description,
    slug: slug,
    img: path.relative(appRoot, req.files.img[0].path)
  });

  collection.save(function (err) {
    if (err) console.log(err);
    res.send("Collection created! Uploading documents rn");

    fs.mkdirSync(appRoot + "/uploads/" + slug);

    var files = [];

    // Unzip the file
    fs.createReadStream(req.files.zip[0].path)
      .pipe(unzipper.Parse())
      .on('entry', function (entry) {
        if(!entry.path.includes("__MACOSX") && (entry.path.includes(".jpeg") || entry.path.includes(".jpg") || entry.path.includes(".png"))) {
          files.push(entry.path.replace(/^[^\/]+\//gi, ""));
          entry.pipe(fs.createWriteStream(appRoot + "/uploads/" + slug + "/" + entry.path.replace(/^[^\/]+\//gi, "")));
        }
        else entry.autodrain();

      })
      .on('close', function () {
        // Delete the ZIP
        fs.unlink(req.files.zip[0].path, function(err){
          if(err) console.log("err");
        });

        function bulkOCR(files, i){
          console.log(files[i]);
          if(i < files.length){
            ocr(appRoot + "/uploads/" + slug + "/" + files[i], {}, function(data){

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
                img: path.relative(appRoot, slug + "/" + files[i]),
                collection_id: collection._id
              });

              document.save(function (err) {
                if (err) console.log(err);
                bulkOCR(files, i + 1);
              });
            });
          }
        }

        // Save all files into the database
        bulkOCR(files, 0);

      });

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
