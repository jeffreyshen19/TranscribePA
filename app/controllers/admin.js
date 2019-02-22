var express = require('express'),
  router = express.Router();
var fs = require("fs");
var path = require("path");
var unzipper = require("unzipper");
var slugify = require("slugify");
var passport = require("passport");

var Document = require("../models/Document"),
  Collection = require("../models/Collection"),
  Admin = require("../models/Admin");
var auth = require("../middleware/auth");
var multer = require("../middleware/multer");
var ocr = require("../helpers/ocr.js");

/*
  Admin authentication
*/

// Login
router.get("/login", function(req, res) {
  if(req.isAuthenticated()) res.redirect("/admin");
  else res.render("admin/login", {messages: req.flash("login-message")});
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/admin',
  failureRedirect : '/admin/login',
  failureFlash : true
}));

// Logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// Manage admin accounts
router.get("/settings", auth, function(req, res){
  Admin.find({}, function(err, admins){
    res.render("admin/admin-settings", {
      "admins": admins,
      "messages": req.flash("admin-settings")
    });
  });
});

// Delete admin
router.get("/settings/delete/:id", auth, function(req, res){
  req.flash('success-transcribe', 'Document successfully transcribed and awaiting verification!');

  if(req.user._id == req.params.id) {
    req.flash("admin-settings", {
      message: "Can't delete the account you are currently logged in on!",
      error: true
    });
    res.redirect("/admin/settings");
  }
  else Admin.deleteOne({ _id: req.params.id }, function (err) {
    if (err) req.flash("admin-settings", {
      message: "Error deleting admin.",
      error: true
    });
    else req.flash("admin-settings", {
      message: "Successfully deleted admin.",
      error: false
    });

    res.redirect("/admin/settings");
  });
});

// Create admin
router.post("/settings/create", auth, function(req, res){
  if(!(req.body.username && req.body.name && req.body.password)){
    req.flash("admin-settings", {
      message: "Please fill out all fields",
      error: true
    });

    res.redirect("/admin/settings");
    return;
  }

  Admin.findOne({'username': req.body.username}, function(err, user) {
    if(user) {
      req.flash("admin-settings", {
        message: "That username is already taken",
        error: true
      });

      res.redirect("/admin/settings");
    }
    else{
      var newAdmin = new Admin();
      newAdmin.username = req.body.username;
      newAdmin.name = req.body.name;
      newAdmin.password = newAdmin.generateHash(req.body.password);

      newAdmin.save(function(err){
        if(err) req.flash("admin-settings", {
          message: "Error creating admin.",
          error: true
        });
        else req.flash("admin-settings", {
          message: "Successfully created a new user (" + newAdmin.name + ")",
          error: false
        });

        res.redirect("/admin/settings");
      });
    }
  });
});

/*
  Admin routes
*/

// Admin Dashboard
router.get("/", auth, function(req, res) {
  Collection.find({}, function(err, collections) {
    Document.aggregate([{
        "$group": {
          "_id": null,
          "completed_count": {
            "$sum": {
              "$cond": ["$completed", 1, 0] /* similar to "$cond": [ { "$eq": [ "$param1", true ] }, 1, 0 ] */
            }
          },
          "raw_count": {
            "$sum": {
              "$cond": ["$transcribed", 0, 1]
            }
          },
          "transcribed_count": {
            "$sum": {
              "$cond": [{$and: [{$eq: ["$transcribed", true]}, {$eq: ["$verified", false]}]}, 1, 0]
            }
          },
          "verified_count": {
            "$sum": {
              "$cond": [{$and: [{$eq: ["$verified", true]}, {$eq: ["$completed", false]}]}, 1, 0]
            }
          }
        }
      },
      {
        "$project": {
          "_id": 0,
          "param_counts": {
            "completed": "$completed_count",
            "raw": "$raw_count",
            "transcribed": "$transcribed_count",
            "verified": "$verified_count"
          }
        }
      }
    ], function(err, document_counts){
      Document.find({
        verified: true,
        completed: false
      }, function(err, documents){
        res.render("admin/admin", {
          collections: collections,
          document_counts: document_counts,
          documents: documents,
          user: req.user,
          messages: req.flash("login-message")
        });
      });
    });

  });
});

// Manage collections
router.get("/collections", auth, function(req, res) {
  Collection.find({}, function(err, collections) {
    res.render("admin/admin-collections", {
      collections: collections
    });
  });
});

/*
  REVIEW DOCUMENTS
*/

router.get("/review/:id", auth, function(req, res) {
  Document.findOne({
    _id: req.params.id,
    "verified": true,
    "completed": false
  }, function(err, document){
    if(err) res.redirect("/404");
    else if(!document) res.render("admin/admin-review", {
      "document": null
    });
    else res.render("admin/admin-review", {
      "document": document,
      "messages": req.flash("review-message")
    });
  });
});

router.get("/review", auth, async function(req, res) {
  filter = {
    "verified": true,
    "completed": false
  };

  try{
    const count= await Document.countDocuments(filter);
    const result = await Document.findOne(filter).skip(Math.floor(Math.random() * count)).exec();

    if(result) res.render("admin/admin-review", {
      document: result,
      messages: req.flash('review-message')
    });
  }
  catch{
    res.render("transcribe", {
      document: null
    });
  }
});

// Mark as complete
router.post("/review/accept", auth, function(req, res){
  Document.findOne({
    "_id": req.body.id
  }, function (err, document) {
    document.changelog.push({
      "timestamp": Date.now(),
      "prevVersion": document.lines,
      "action": "COMPLETE"
    });

    document.lines = req.body.transcription;
    document.raw = req.body.transcription.replace(/\n/g, ' ').replace(/ - /g, "");
    document.languages = req.body.languages;
    document.completed = true;

    document.save(function (err, updatedDocument) {
      if (err) return handleError(err);
      req.flash('review-message', {
        "message": 'Document accepted and officially marked as complete',
        "error": false
      });
      res.sendStatus(200);
    });
  });
});

// Save work on review
router.post("/review/save", auth, function(req, res){
  Document.findOne({
    "_id": req.body.id
  }, function (err, document) {
    document.changelog.push({
      "timestamp": Date.now(),
      "prevVersion": document.lines,
      "action": "REVIEW_SAVE"
    });

    document.lines = req.body.transcription;
    document.raw = req.body.transcription.replace(/\n/g, ' ').replace(/ - /g, "");
    document.languages = req.body.languages;

    document.save(function (err, updatedDocument) {
      if (err) return handleError(err);
      res.sendStatus(200);
    });
  });
});

// Reject document, sending it back to verification stage
router.post("/review/reject", auth, function(req, res){
  Document.findOne({
    "_id": req.body.id
  }, function (err, document) {
    document.verified = false;
    document.changelog.push({
      "timestamp": Date.now(),
      "action": "REJECT_COMPLETE"
    });

    document.save(function (err, updatedDocument) {
      if (err) return handleError(err);
      req.flash('review-message', {
        "message": 'Document successfully marked as incomplete',
        "error": true
      });
      res.sendStatus(200);
    });
  });
});

/*
  MANAGE COLLECTIONS
*/

// Create Collection
router.get("/create", auth, function(req, res) {
  res.render("admin/admin-create");
});

router.post("/new-collection", auth, multer.fields([{ //TODO: check that name exists
  name: 'zip',
  maxCount: 1
}, {
  name: 'img',
  maxCount: 1
}]), function(req, res) {
  var name = req.body.name,
    description = req.body.description,
    slug = slugify(req.body.name.toLowerCase());

  var collection = new Collection({
    name: name,
    description: description,
    slug: slug,
    img: path.relative(appRoot, req.files.img[0].path)
  });

  collection.save(function(err) {
    if (err) console.log(err);
    res.send("Collection created! Uploading documents rn");

    fs.mkdirSync(appRoot + "/uploads/" + slug);

    var files = [];

    // Unzip the file
    fs.createReadStream(req.files.zip[0].path)
      .pipe(unzipper.Parse())
      .on('entry', function(entry) {
        if (!entry.path.includes("__MACOSX") && (entry.path.includes(".jpeg") || entry.path.includes(".jpg") || entry.path.includes(".png"))) {
          files.push(entry.path.replace(/^[^\/]+\//gi, ""));
          entry.pipe(fs.createWriteStream(appRoot + "/uploads/" + slug + "/" + entry.path.replace(/^[^\/]+\//gi, "")));
        } else entry.autodrain();

      })
      .on('close', function() {
        // Delete the ZIP
        fs.unlink(req.files.zip[0].path, function(err) {
          if (err) console.log("err");
        });

        function bulkOCR(files, i) {
          console.log(files[i]);
          if (i < files.length) {
            ocr(appRoot + "/uploads/" + slug + "/" + files[i], {}, function(data) {

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
                collection_id: collection._id,
                title: path.relative(appRoot, req.file.path).split("/")[1].split(".")[0]
              });

              document.save(function(err) {
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
router.post("/new-document", auth, multer.single("image"), function(req, res) {
  ocr(req.file.path, {}, function(data) {

    if (data === "ERROR") res.send(data);

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
      img: path.relative(appRoot, req.file.path),
      title: path.relative(appRoot, req.file.path).split("/")[1].split(".")[0]
    });

    document.save(function(err) {
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
