var page = require('webpage').create(),
    async = require('../node_modules/async/lib/async.js'),
    downloadLink;

console.log('hey');
// Run a check function every 100 ms
function waitFor(checkFn, cb) {
  console.log('hmmm');
  if (checkFn()) {
    console.log('cb');
    cb();
  } else {
      console.log('wait');
    setTimeout(function waitForFn () {
      console.log('wait2');
      waitFor(checkFn, cb);
    }, 100);
  }
}

// In series
async.series([
  function openIcoMoon (cb) {
    // Open IcoMoon
    page.open('http://icomoon.io/app', function (status) {
      cb();
    });
    console.log('hey');
  },
  function waitForLoading (cb) {
    // Wait for loading to complete
    waitFor(function () {
      console.log('wwww');
      return page.evaluate(function () {
        return !document.getElementById('loading');
      });
    }, cb);
    console.log('dddd');
  },
  function uploadImages (cb) {
    // Submit many images (need a file path for all our images)
    console.log('hey');
    console.log(phantom.args[3]);
    var fs = require('fs'),
        filesPath = phantom.args[3],
        filesJSON = fs.read(filesPath),
        files = JSON.parse(filesJSON);

    // TODO: We might need to submit this many times per file
    page.uploadFile('#files', files);

    // Continue
    cb();
  },
  function exportFont (cb) {
    console.log('hey');
    // Export our font
    page.evaluate(function () {
      // Select our images
      $('#imported').find('.checkbox-icon').click();

      // "Click" the 'Next' link
      window.location.hash = '#font';

      // Click the download link
      $('#saveFont').click();
    });

    // Continue
    cb();
  },
  function waitForRedirect (cb) {
    console.log('hey');
    console.log('hey');
    // Wait for a redirect request
    page.onNavigationRequested = function (url) {
      downloadLink = url;
    };
    waitFor(function () {
      return downloadLink;
    }, cb);
  }
], function output (err) {
  // DEV: Take a screenshot for progress
  page.render('app.png');

  // If there was an error, log it
  if (err) {
    console.error(err);
    phantom.exit(1);
  } else {
  // Otherwise, output the download link for the next module
    console.log(downloadLink);
    phantom.exit(0);
  }
});