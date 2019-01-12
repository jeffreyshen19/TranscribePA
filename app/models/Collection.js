var mongoose = require("mongoose");

// Schema for a collection of documents
var CollectionSchema = new mongoose.Schema({
  name: String, // Name of the collection
  description: String,
  slug: String, // URL friendly version of the collection (user has the option to select this)
  img: String, // Path to cover image 
});

module.exports = mongoose.model("Collection", CollectionSchema);
