module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-closure-compiler');

  // Project configuration.
  grunt.initConfig({
    // Options
    closurePath: function() {
      return process.env.CLOSURE_PATH;
    }(),
    js: [
      'source/setup.js',
      'source/sms.js',
      'source/utils.js',
      'source/z80.js',
      'source/keyboard.js',
      'source/psg.js',
      'source/vdp.js',
      'source/ui.js',
      'source/ports.js',
      'source/build/exports.js'
    ],
    externs: [
      '<%= closurePath %>/contrib/externs/webkit_console.js',
      '<%= closurePath %>/contrib/externs/jquery-1.7.js',
      '<%= closurePath %>/contrib/html5.js'
    ],

    'closure-compiler': {
      // Generates a minified version of the script.
      min: {
        js: '<%= js %>',
        jsOutputFile: 'min/jssms.min.js',
        options: {
          externs: '<%= externs %>',
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT',
          summary_detail_level: 3,
          warning_level: 'VERBOSE',
          define: [
            '"DEBUG=false"'
          ],
          debug: false
        }
      },

      // Generates a minified version of the script for debugging.
      debug: {
        js: '<%= js %>',
        jsOutputFile: 'min/jssms.adv.js',
        options: {
          externs: '<%= externs %>',
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT',
          summary_detail_level: 3,
          warning_level: 'VERBOSE',
          define: [
            '"DEBUG=true"'
          ],
          debug: true,
          formatting: 'pretty_print'
        }
      },

      // Generates a unminified concatenated version.
      // @todo Refactor to remove 'source/build/exports.js' from object `js` prop.
      concat: {
        js: [
          'source/setup.js',
          'source/sms.js',
          'source/utils.js',
          'source/z80.js',
          'source/keyboard.js',
          'source/psg.js',
          'source/vdp.js',
          'source/ui.js',
          'source/ports.js'
        ],
        jsOutputFile: 'min/jssms.concat.js',
        options: {
          compilation_level: 'WHITESPACE_ONLY',
          language_in: 'ECMASCRIPT5_STRICT',
          summary_detail_level: 3,
          warning_level: 'VERBOSE',
          debug: true,
          formatting: 'PRETTY_PRINT'
        }
      }
    }

  });

  // Default task.
  grunt.registerTask('default', [
    'closure-compiler:min',
    'closure-compiler:debug',
    'closure-compiler:concat'
  ]);

};
