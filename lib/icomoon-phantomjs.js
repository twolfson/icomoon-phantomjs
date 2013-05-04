var casper = require('casper').create({
    verbose: true,
    logLevel: "debug"
});

// Open IcoMoon
casper.start('http://icomoon.io/app');

// Wait for loading to complete
casper.waitFor(function waitForLoadingComplete () {
  // Wait until div#loading no longer exists
  return this.evaluate(function () {
    return !document.getElementById('loading');
  });
});

// TODO: Submit many images (need a file path for all our images)
// TODO: Export our font
// TODO: Extract variables (if specified)

// DEV: Take a screenshot for progress
casper.then(function devScreenshot () {
  this.capture('app.png', {
    top: 0,
    left: 0,
    width: 800,
    height: 600
  });
});

// Run the script
casper.run();