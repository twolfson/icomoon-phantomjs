// Load in module dependencies
var exec = require('child_process').exec;

// Grab the phantomjs version
exec('phantomjs --version', function checkPhantomJsVersion (err, stdout, stderr) {
  // Fallback err with stderr
  if (!err && stderr) {
    err = new Error(stderr);
  }

  // If there is an error, throw it
  if (err) {
    console.error('Cannot detect PhantomJS version. Please install PhantomJS >= 1.9.0');
    throw err;
  }

  // Otherwise, verify the phantomjs version is at least 1.9.0
  var parts = stdout.split('.'),
      major = +parts[0],
      minor = +parts[1];

  // If we are over 1.9.0, leave gracefully
  if (major >= 2 || (major === 1 && minor >= 9)) {
    process.exit(0);
  }

  // Otherwise, complain and leave
  console.error('PhantomJS must be at least 1.9.0');
  process.exit(1);
});