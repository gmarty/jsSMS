module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-closure-compiler');

  // Project configuration.
  grunt.initConfig({
    'closure-compiler': {
      js:      [
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
        '<%= process.env.CLOSURE_PATH %>/contrib/externs/webkit_console.js',
        '<%= process.env.CLOSURE_PATH %>/contrib/externs/jquery-1.7.js',
        'source/build/externs/fullscreen.js'
      ],

      // Generates a minified version of the script.
      min:     {
        js:           '<config:closure-compiler.js>',
        jsOutputFile: 'min/jssms.min.js',
        options:      {
          externs:              '<config:closure-compiler.externs>',
          compilation_level:    'ADVANCED_OPTIMIZATIONS',
          language_in:          'ECMASCRIPT5_STRICT',
          summary_detail_level: 3,
          warning_level:        'VERBOSE',
          define:               [
            '"DEBUG=false"'
          ],
          debug:                false
        }
      },

      // Generates a advanced minified version of the script.
      adv:     {
        js:           '<config:closure-compiler.js>',
        jsOutputFile: 'min/jssms.adv.js',
        options:      {
          externs:              '<config:closure-compiler.externs>',
          compilation_level:    'ADVANCED_OPTIMIZATIONS',
          language_in:          'ECMASCRIPT5_STRICT',
          summary_detail_level: 3,
          warning_level:        'VERBOSE',
          define:               [
            '"DEBUG=true"'
          ],
          debug:                true,
          formatting:           'pretty_print'
        }
      },

      // Generates a unminified concatenated version.
      // @todo Refactor to remove 'source/build/exports.js' from object `js` prop.
      concat:  {
        js:           [
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
        options:      {
          compilation_level:    'WHITESPACE_ONLY',
          language_in:          'ECMASCRIPT5_STRICT',
          summary_detail_level: 3,
          warning_level:        'VERBOSE',
          debug:                true,
          formatting:           'PRETTY_PRINT'
        }
      }
    }

  });

  // Default task.
  grunt.registerTask('default', 'closure-compiler:min closure-compiler:adv closure-compiler:concat');

};
