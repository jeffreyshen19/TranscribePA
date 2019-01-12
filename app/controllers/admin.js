var express = require('express'),
  router = express.Router();
var Document = require("../models/Document"),
  Collection = require("../models/Collection");
var auth = require("../middleware/auth.js");
var fs = require("fs");

// Admin Dashboard
router.get("/", function(req, res){
  res.render("admin");
});

// Create Collection
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

// var doc = new Document({
//   lines: 'Anim tempor labore laborum aliquip culpa ut ut enim nostrud ipsum ex laboris quis reprehenderit. Incididunt dolor enim labore id labore veniam consequat eiusmod cupidatat tempor ut commodo ea enim. Ex fugiat fugiat sit voluptate voluptate sit qui sunt aute eu reprehenderit. Velit culpa mollit quis exercitation ea ut tempor duis Lorem.'
// });
//
// doc.save(function (err) {
//   if (err) console.log(err);
//   res.send("done!");
// });

module.exports = router;
