var casper = require('casper').create({
    verbose: true,
    logLevel: "debug"
});


// Open IcoMoon
casper.start('http://icomoon.io/app');

// Wait for loading to complete
casper.waitWhileVisible('#loading');

// Submit many images (need a file path for all our images)
var files = [
      '/home/todd/github/icomoon-phantomjs/test/test_files/eye.svg',
      '/home/todd/github/icomoon-phantomjs/test/test_files/moon.svg',
      '/home/todd/github/icomoon-phantomjs/test/test_files/building_block.svg'
    ];
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

// Wait for the link to no longer be disabled
casper.waitFor(function () {
  console.log(this.getCurrentUrl());
});

// TODO: [node only] Extract variables (if specified)

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