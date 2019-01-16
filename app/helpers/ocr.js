// Wrapper for Python OCR function
var spawn = require("child_process").spawn;
var exec = require("child_process").exec;

module.exports = function(path, metadata, callback){
  var pythonProcess = spawn('python', ["./transcriber/ocr.py", path, JSON.stringify(metadata)]);
  pythonProcess.stdout.on('data', function(data){
    callback(JSON.parse(data.toString('utf8')));
  });
  pythonProcess.stderr.on('data', function(data){
    callback("ERROR");
  });
};
