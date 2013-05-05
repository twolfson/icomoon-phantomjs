// Load in modules
var assert = require('assert'),
    path = require('path');

describe('A set of SVGs', function () {
  before(function () {
    this.files = [
      path.join(__dirname, '/test_files/eye.svg'),
      path.join(__dirname, '/test_files/moon.svg'),
      path.join(__dirname, '/test_files/building_block.svg')
    ];
  });

  describe('processed by IcoMoon', function () {
    var exec = require('child_process').exec,
        Tempfile = require('temporary/lib/file');
    before(function (done) {
      // Write the files to a temporary file
      var tmp = new Tempfile(),
          filesJSON = JSON.stringify(this.files, 'utf8');
      tmp.writeFileSync(filesJSON);

      // Run our script
      var that = this,
          scriptPath = path.join(__dirname, '../lib/icomoon-phantomjs.js');
      this.timeout(60000);
      exec('casperjs ' + scriptPath + ' ' + tmp.path, function (err, stdout, stderr) {
        // Save the output and calback
        that.stdout = stdout;
        done(err);
      });
    });

    it('returns a valid URL', function () {
      assert.notEqual(this.stdout, '');
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
        assert.notEqual(cssKey, undefined);
        assert.notEqual(zipFiles[cssKey], '');
      });
    });
  });
});