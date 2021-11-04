var fs = require('fs');
var https = require('https');
//Node.js Function to save image from External URL.
function saveImageToDisk(url, localPath) {var fullUrl = url;
var file = fs.createWriteStream(localPath);
var request = https.get(url, function(response) {
response.pipe(file);
});
}