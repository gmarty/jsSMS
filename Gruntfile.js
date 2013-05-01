module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-closure-compiler');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Project configuration.
  grunt.initConfig({
    // Options
    closurePath: function() {
      return process.env.CLOSURE_PATH;
    }(),
    js: [
      'src/setup.js',
      'src/sms.js',
      'src/utils.js',
      'src/z80.js',
      'src/debugger.js',
      'src/keyboard.js',
      'src/psg.js',
      'src/vdp.js',
      'src/ui.js',
      'src/ports.js',
      'src/build/exports.js'
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
          use_types_for_optimization: null,
          summary_detail_level: 3,
          warning_level: 'VERBOSE',
          output_wrapper: '(function(window){%output%})(window);',
          define: [
            '"DEBUG=false"',
            '"DEBUGGER=false"'
          ],
          debug: false
        }
      },

      // Generates a minified version of the script for debugging.
      debug: {
        js: '<%= js %>',
        jsOutputFile: 'min/jssms.debug.js',
        options: {
          externs: '<%= externs %>',
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT',
          use_types_for_optimization: null,
          summary_detail_level: 3,
          warning_level: 'VERBOSE',
          define: [
            '"DEBUG=true"',
            '"DEBUGGER=true"'
          ],
          debug: true,
          formatting: 'PRETTY_PRINT'
        }
      },

      // Generates a unminified concatenated version.
      // @todo Refactor to remove 'src/build/exports.js' from object `js` prop.
      concat: {
        js: [
          'src/setup.js',
          'src/sms.js',
          'src/utils.js',
          'src/z80.js',
          'src/debugger.js',
          'src/keyboard.js',
          'src/psg.js',
          'src/vdp.js',
          'src/ui.js',
          'src/ports.js'
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
      },

      // Generates a minified version of the script to use with node.js.
      node: {
        js: [
          'src/setup.js',
          'src/sms.js',
          'src/utils.js',
          'src/z80.js',
          'src/debugger.js',
          'src/keyboard.js',
          'src/psg.js',
          'src/vdp.js',
          'src/node-ui.js',
          'src/ports.js',
          'src/build/node-exports.js'
        ],
        jsOutputFile: 'min/jssms.node.js',
        options: {
          externs: [
            'src/build/externs/node.js',
            '<%= closurePath %>/contrib/externs/webkit_console.js',
            '<%= closurePath %>/contrib/html5.js'
          ],
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT',
          use_types_for_optimization: null,
          summary_detail_level: 3,
          warning_level: 'VERBOSE',
          output_wrapper: '(function(window){%output%})(global);',
          define: [
            '"DEBUG=true"',
            '"DEBUGGER=true"'
          ],
          debug: true,
          formatting: 'PRETTY_PRINT'
        }
      }
    },

    concat: {
      options: {
        banner: grunt.file.read('src/license.js')
      },
      min: {
        src: ['min/jssms.min.js'],
        dest: 'min/jssms.min.js'
      },
      debug: {
        src: ['min/jssms.debug.js'],
        dest: 'min/jssms.debug.js'
      },
      concat: {
        src: ['min/jssms.concat.js'],
        dest: 'min/jssms.concat.js'
      },
      node: {
        src: ['min/jssms.node.js'],
        dest: 'min/jssms.node.js'
      }
    }

  });

  // Default task.
  grunt.registerTask('default', [
    'closure-compiler:min',
    'closure-compiler:debug',
    'closure-compiler:concat',
    'concat:min',
    'concat:debug',
    'concat:concat'
  ]);
  grunt.registerTask('node', [
    'closure-compiler:node',
    'concat:node'
  ]);

};
