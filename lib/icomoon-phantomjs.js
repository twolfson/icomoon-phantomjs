var casper = require('casper').create({
    verbose: true,
    logLevel: "debug"
});

// Open IcoMoon
casper.start('http://icomoon.io/app');

// Wait for loading to complete
casper.waitWhileVisible('#loading');

// Submit many images (need a file path for all our images)
var files = ['test/test_files/eye.svg'];
casper.then(function () {
  console.log('abc', this.evaluate(function (file) {
    // try {
    $('#files').val(file);
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', true, true);
    $('#files')[0].dispatchEvent(evt);
    //   $('#files').change();
    //   return $('#files').val();
    // } catch (e) {
    //   return e;
    // }
  }, files[0]));
});

// casper.wait(5000);

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