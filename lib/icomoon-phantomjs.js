var casper = require('casper').create({
    verbose: true,
    logLevel: "debug"
});

// Open IcoMoon
casper.start('http://icomoon.io/app');

// TODO: Wait for loading to complete
// TODO: Submit many images (need a file path for all our images)
// TODO: Export our font
// TODO: Extract variables (if specified)

casper.then(function () {
  this.capture('app.png', {
    top: 0,
    left: 0,
    width: 800,
    height: 600
  });
});

casper.run();