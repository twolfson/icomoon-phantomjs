// Load in our dependencies
var AdmZip = require('adm-zip');
var progress = require('progress-stream');
var request = require('request');

// DEV: We wanted to use https://github.com/jiripospisil/chrome-ext-downloader for this but it seems broken
// Generated via http://chrome-extension-downloader.com/how-does-it-work.php
// var icomoonUrl = 'https://clients2.google.com/service/update2/crx?response=redirect&prodversion=38.0&x=id%3Dkppingdhhalimbaehfmhldppemnmlcjd%26installsource%3Dondemand%26uc';
var icomoonUrl = 'http://google.com/';

// Request our file
var req = request({url: icomoonUrl, encoding: null});

// When an error occurs, throw it
req.on('error', function handleError (err) {
  throw err;
});

// When we receive a response
req.on('response', function handleContent (res) {
  // Find how big the file is
  req.
  // TODO: Clean up old cache files

  // Otherwise, extract zip content to disk
  var zip = new AdmZip(buff);
  zip.extractAllTo(__dirname + '/.cache/');
});
