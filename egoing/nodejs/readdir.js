var testFolder = './data/';
var fs = require('fs');
fs.readdir(testFolder, function(error, files){
    console.log(files);
});