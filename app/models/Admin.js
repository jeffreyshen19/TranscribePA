var mongoose = require("mongoose");
var bcrypt = require('bcrypt');

// Schema for a collection of documents
var AdminSchema = new mongoose.Schema({
  name: String, //Admin's Name (i.e. Jane Doe)
  username: String,
  password: String
});

// Hash password
AdminSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check if password is valid
AdminSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model("Admin", AdminSchema);
