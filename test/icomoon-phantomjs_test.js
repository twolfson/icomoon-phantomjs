var assert = require('assert'),
    path = require('path'),
    exec = require('child_process').exec,
    Tempfile = require('temporary/lib/file');
describe('A set of SVGs', function () {
  before(function () {
    this.files = [
      path.join(__dirname, '/test_files/eye.svg'),
      path.join(__dirname, '/test_files/moon.svg'),
      path.join(__dirname, '/test_files/building_block.svg')
    ];
  });

  describe('processed by IcoMoon', function () {
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
      console.log(this.stdout);
      assert.notEqual(this.stdout, '');
    });

    describe('returns a zip file', function () {
      it('contains a CSS sheet inside of the zip file', function () {

      });
    });
  });
});