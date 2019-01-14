var multer = require("multer");
var crypto = require('crypto');
var mime = require('mime');

var storage = multer.diskStorage({
  destination: appRoot + '/uploads/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
    });
  }
});

module.exports = multer({
  storage: storage
});
