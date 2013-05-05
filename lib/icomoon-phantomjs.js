var page = require('webpage').create(),
    async = require('../node_modules/async/lib/async.js'),
    downloadLink;

// Run a check function every 100 ms
function waitFor(checkFn, cb) {
  if (checkFn()) {
    cb();
  } else {
    setTimeout(function waitForFn () {
      waitFor(checkFn, cb);
    }, 100);
  }
}

function openIcoMoon(cb) {
  // Open IcoMoon
  page.open('http://icomoon.io/app', function (status) {
    cb();
  });
}
function waitForLoading(cb) {
  // Wait for loading to complete
  waitFor(function () {
    return page.evaluate(function () {
      return !document.getElementById('loading');
    });
  }, cb);
}

// In series
async.series([
  openIcoMoon,
  waitForLoading,
  // function clearCache (cb) {
  //   page.evaluate(function () {
  //     $('#reset').click();
  //   });

  //   waitFor(function () {
  //     return page.evaluate(function () {
  //       return $('#confirm_yes').length;
  //     });
  //   }, function () {
  //     page.evaluate(function () {
  //       $('#confirm_yes').click();
  //     });

  //     cb();
  //   });
  // },
  // openIcoMoon,
  waitForLoading,
  function uploadImages (cb) {
    // Submit many images (need a file path for all our images)
    var fs = require('fs'),
        filesPath = phantom.args[0],
        filesJSON = fs.read(filesPath),
        files = JSON.parse(filesJSON);
    page.uploadFile('#files', files);

    // Continue
    waitFor(function () {
      var itemsCreated = page.evaluate(function () {
        return $('#imported').find('.checkbox-icon').length;
      });
      return itemsCreated === files.length;
    }, cb);
  },
  function moveToDownloadScreen (cb) {
    // Move to the downlod screen
    page.evaluate(function () {
      // Select our images
      $('#imported').find('.checkbox-icon').click();

      // "Click" the 'Next' link
      window.location.hash = 'font';
    });

    // Wait for the next screen to load
    waitFor(function () {
      return page.evaluate(function () {
        return $('#saveFont').length;
      });
    }, cb);
  },
  function exportFont (cb) {
    // Save any zip redirect requests
    page.onNavigationRequested = function (url) {
      if (url.indexOf('.zip') > -1) {
        downloadLink = url;
      }
    };

    // Click the download link
    page.evaluate(function () {
      $('#saveFont').click();
    });

    // Wait for the redirect request to our zip
    waitFor(function () {
      return downloadLink;
    }, cb);
  }
], function output (err) {
  // // DEV: Take a screenshot for progress
  // page.render('app.png');

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