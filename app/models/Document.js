var mongoose = require("mongoose");

// Schema for a single page of a document
var DocumentSchema = new mongoose.Schema({
  lines: String, // Properly formatted transcription
  raw: String, // Searchable raw format
  handwritten: Boolean, // Is the document handwritten?
  languages: [String], // What languages does the computer think the document is written in
  metadata: {}, // Metadata the library provides
  transcribed: Boolean, // Has the document been transcribed
  verified: Boolean, // Has the document been verified by a volunteer
  completed: Boolean, // Has a librarian accepted this document into the database
  changelog: [{}], // Keep track of who's edited this document
  collection_id: mongoose.Schema.ObjectId, //What collection is this document part of?
  img: String, // Path to image upload
  name: String // Name
});

DocumentSchema.index({"raw": "text"});

module.exports = mongoose.model("Document", DocumentSchema);
