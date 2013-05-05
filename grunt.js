module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',

    // Dependencies
    curl: {
      'lib/async.js': 'https://raw.github.com/caolan/async/master/lib/async.js'
    },

    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },

    // Linting
    lint: {
      files: ['grunt.js', 'lib/**/*.js']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        browser: true,

        strict: false
      },
      globals: {
        exports: true,
        $: true
      }
    }
  });

  // Load in grunt-curl
  grunt.loadNpmTasks('grunt-curl');

  // Default task.
  grunt.registerTask('default', 'lint');

};