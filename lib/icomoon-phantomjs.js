var system = require('system'),
    page = require('webpage').create(),
    async = require('./async.js'),
    downloadLink;

function errorFn(msg, trace) {
  // Log the error and trace
  system.stderr.writeLine(msg);
  trace.forEach(function(item) {
    system.stderr.writeLine('  ' + item.file + ':' + item.line);
  });

  // Leave with a bad exit code
  phantom.exit(1);
}
phantom.onError = errorFn;
page.onError = errorFn;

// Run a check function every 100 ms
function waitFor(checkFn, timeout, cb) {
  var start = Date.now();
  function runWaitFor() {
    if (checkFn()) {
      cb();
    } else if ((Date.now() - start) <= timeout) {
      setTimeout(runWaitFor, 100);
    } else {
      cb(new Error('Timeout of ' + timeout + 'ms reached. This usually means something went wrong. Please try your SVGs inside icomoon itself, http://icomoon.io/app-old'));
    }
  }
  runWaitFor();
}

function openIcoMoon(cb) {
  // Open IcoMoon
  page.open('http://icomoon.io/app-old', function (status) {
    // If the status was 'fail', callback with an error
    var err = null;
    if (status === 'fail') {
      err = new Error('IcoMoon app "http://icomoon.io/app-old" could not be opened.');
    }
    cb(err);
  });
}
function waitForLoading(cb) {
  // Wait for loading to complete
  waitFor(function () {
    return page.evaluate(function () {
      return !document.getElementById('loading');
    });
  }, 5000, cb); // 5 seconds
}

// In series
async.series([
  // On first open, cache bust
  openIcoMoon,
  waitForLoading,
  function clearCache (cb) {
    // Clear out indexedDB and localStorage
    page.evaluate(function () {
      if (window.indexedDB) {
        indexedDB.deleteDatabase('IDBWrapper-storage');
      }

      if (window.localStorage) {
        localStorage.clear();
      }
    });

    // Callback
    cb();
  },
  // Re-open page with busted cache
  openIcoMoon,
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
    }, 2000, function handleUploadError (err) {
      // If there was an error
      if (err) {
        // and there is a modal on the page
        console.log(page.evaluate(function () {
          return $('#modal_alert').hasClass('hidden');
        }));
      }

      // Callback
      cb(err);
    });
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
    }, 2000, cb); // 2 seconds
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
    }, 2000, cb); // 2 seconds
  }
], function output (err) {
  // If there was an error
  if (err) {
    // Log it
    system.stderr.writeLine(err);

    // Take a screenshot and notify the user
    page.render('icomoon-phantomjs-debug.png');
    system.stderr.writeLine('Saving screenshot to "icomoon-phantomjs-debug.png"');

    // Exit appropriately
    phantom.exit(1);
  } else {
  // Otherwise, output the download link for the next module
    console.log(downloadLink);
    phantom.exit(0);
  }
});
