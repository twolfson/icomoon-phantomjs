// Load in our dependencies
var fs = require('fs');
var AdmZip = require('adm-zip');
var request = require('request');

// DEV: We wanted to use https://github.com/jiripospisil/chrome-ext-downloader for this but it seems broken
// URL generated via http://chrome-extension-downloader.com/how-does-it-work.php
var icomoonUrl = 'https://clients2.google.com/service/update2/crx?response=redirect&prodversion=38.0&x=id%3Dkppingdhhalimbaehfmhldppemnmlcjd%26installsource%3Dondemand%26uc';

// If there is an old cache file, do nothing
var targetDir = __dirname + '/../.cache/';
if (fs.existsSync(targetDir)) {
  console.log('`icomoon` already exists locally. Skipping download.');
  process.exit();
}

// Notify user we are downloading files
console.log('Downloading "' + icomoonUrl + '"');

// Request our file
var req = request({url: icomoonUrl, encoding: null}, function handleContent (err, res, buff) {
  // If there was an error, throw it
  if (err) {
    throw err;
  }

  // Notify user of completed download
  console.log('Download complete!');

  // Cut off unused buffer section
  var publicKeyLength = buff.readUInt32LE(8);
  var signatureLength = buff.readUInt32LE(12);
  var zipBuff = buff.slice(16 + publicKeyLength + signatureLength);

  // Otherwise, extract zip content to disk
  var zip = new AdmZip(zipBuff);
  zip.extractAllTo(targetDir);
});
