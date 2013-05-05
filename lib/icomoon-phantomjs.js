var page = require('webpage').create(),
    nimble = require('../node_modules/nimble/nimble.js');

// Open IcoMoon
casper.start('http://icomoon.io/app');

// Wait for loading to complete
casper.waitWhileVisible('#loading');

// Submit many images (need a file path for all our images)
var fs = require('fs'),
    filesPath = phantom.args[3],
    filesJSON = fs.read(filesPath),
    files = JSON.parse(filesJSON);
casper.then(function () {
  // Name the field for `fill` to hook into
  this.evaluate(function () {
    $('#files').attr('name', 'files');
  });

  // Upload our file =D
  this.fill('#import', {
    'files': files
  });
});

// Export our font
casper.then(function () {
  // Select our images
  this.evaluate(function () {
    $('#imported').find('.checkbox-icon').click();
  });

  // Move to the next screen
  this.click('#generate');

  // Grab the download link
  this.click('#saveFont');
});

// Wait for a redirect request
var downloadLink;
casper.waitFor(function () {
  casper.on('navigation.requested', function (url) {
    downloadLink = url;
  });
  return downloadLink;
});

// Output the download link for the next module
casper.then(function () {
  console.log(downloadLink);
});

// // DEV: Take a screenshot for progress
// casper.then(function devScreenshot () {
//   this.capture('app.png', {
//     top: 0,
//     left: 0,
//     width: 800,
//     height: 600
//   });
// });

// Run the script
casper.run();