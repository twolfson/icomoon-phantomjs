// Load in modules
var exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),
    expect = require('chai').expect,
    Tempfile = require('temporary/lib/file');

function runIcomoonPhantomjs(files) {
  before(function runIcomoonPhantomjsFn (done) {
    // Write the files to a temporary file
    var tmp = new Tempfile(),
        filesJSON = JSON.stringify(files, 'utf8');
    tmp.writeFileSync(filesJSON);

    // Run our script
    var that = this,
        scriptPath = path.join(__dirname, '../lib/icomoon-phantomjs.js');
    this.timeout(20000);
    exec('phantomjs ' + scriptPath + ' ' + tmp.path, function (err, stdout, stderr) {
      // Save the output and calback
      that.err = err;
      that.stdout = stdout;
      that.stderr = stderr;
      done();
    });
  });
  after(function cleanupThis () {
    delete this.err;
    delete this.stdout;
    delete this.stderr;
  });
}

describe('A set of SVGs', function () {
  var svgs = [
    path.join(__dirname, '/test_files/eye.svg'),
    path.join(__dirname, '/test_files/moon.svg'),
    path.join(__dirname, '/test_files/building_block.svg')
  ];

  describe('processed by IcoMoon', function () {
    runIcomoonPhantomjs(svgs);

    it('returns a valid URL', function () {
      expect(this.stderr).to.equal('');
      expect(this.err).to.equal(null);
      expect(this.stdout).to.not.equal('');
    });

    describe('returns a zip file', function () {
      // Download the file and save it for later
      var request = require('request');
      before(function (done) {
        var url = this.stdout,
            that = this;
        request({'url': url, 'encoding': 'binary'}, function (err, res, body) {
          that.zipBody = body;
          done(err);
        });
      });

      // Unzip the file
      var Zip = require('node-zip');
      before(function () {
        this.zip = new Zip(this.zipBody);
      });

      it('contains a CSS sheet inside of the zip file', function () {
        // DEV: Looks like icomoon69021/style.css
        // Find any style.css keys
        var zipFiles = this.zip.files,
            keys = Object.getOwnPropertyNames(zipFiles),
            cssKey = keys.filter(function (name) { return name.match('style.css'); })[0];

        // Assert the key exists and the file contents are non-empty
        expect(cssKey).to.not.equal(undefined);
        expect(zipFiles[cssKey]).to.not.equal('');
      });
    });
  });
});

describe('An empty array of SVGs processed by IcoMoon', function () {
  runIcomoonPhantomjs([]);

  it('exits with an error', function () {
    expect(this.err).to.not.equal(null);
  });
  it('informs the user what to next', function () {
    expect(this.stderr).to.contain('Please try your SVGs inside icomoon itself, http://icomoon.io/app-old');
  });

  // TODO: Handle these eventually
  it.skip('exits with an semantic error code', function () {
    expect(this.err).to.have.property('code', 2);
  });
  it.skip('informs the user what went wrong via stderr', function () {
    // TODO: Update text
    expect(this.stderr).to.contain('went wrong...');
  });
});

describe.only('An SVG containing a gradient processed by IcoMoon', function () {
  runIcomoonPhantomjs([
    path.join(__dirname, '/test_files/gradient.svg')
  ]);

  it('exits with an error', function () {
    expect(this.err).to.not.equal(null);
  });
  it('informs the user what went wrong', function () {
    expect(this.stderr).to.contain('');
  });
  it('informs to see what the script saw', function () {
    expect(this.stderr).to.contain('Saving debug screenshot to "icomoon-phantomjs-debug.png"');
    var debugImage = fs.statSync('icomoon-phantomjs-debug.png');
    expect(debugImage.size).to.be.at.least(1);
  });
});
