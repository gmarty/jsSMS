'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-closure-compiler');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
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
      'src/sync-client.js',
      'src/z80.js',
      'src/debugger.js',
      'src/keyboard.js',
      'src/psg.js',
      'src/vdp.js',
      '<%= grunt.task.current.nameArgs == "closure-compiler:alec" ? "src/alec/ui.js" : grunt.task.current.nameArgs == "closure-compiler:node" ? "src/node/ui.js" : "src/ui.js" %>',
      'src/ports.js',
      'src/compiler/bytecode.js',
      'src/compiler/parser.js',
      'src/compiler/opcodes-ast.js',
      'src/compiler/opcodes-CB.js',
      'src/compiler/opcodes-DD-FD.js',
      'src/compiler/opcodes-ED.js',
      'src/compiler/opcodes.js',
      'src/compiler/analyzer.js',
      'src/compiler/optimizer.js',
      'src/compiler/generator.js',
      'src/compiler/recompiler.js',
      '<%= grunt.task.current.nameArgs == "closure-compiler:node" ? "src/node/build/exports.js" : "src/build/exports.js" %>' // Required for targets using `output_wrapper`.
    ],
    externs: [
      '<%= closurePath %>/contrib/externs/jquery-1.9.js'
    ],

    'closure-compiler': {
      // Generates a minified version of the script.
      min: {
        js: '<%= js %>',
        jsOutputFile: 'min/jssms.min.js',
        options: {
          externs: '<%= externs %>',
          compilation_level: 'SIMPLE',
          language_in: 'ECMASCRIPT5_STRICT',
          language_out: 'ECMASCRIPT5_STRICT',
          use_types_for_optimization: null,
          summary_detail_level: 3,
          warning_level: 'VERBOSE',
          output_wrapper: '(function(window){%output%})(window);',
          define: [
            //'"DEBUG=false"',
            '"ENABLE_DEBUGGER=false"',
            //'"ENABLE_COMPILER=true"',
            '"ACCURATE_INTERRUPT_EMULATION=false"',
            '"ENABLE_SERVER_LOGGER=false"'
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
          compilation_level: 'SIMPLE',
          language_in: 'ECMASCRIPT5_STRICT',
          language_out: 'ECMASCRIPT5_STRICT',
          use_types_for_optimization: null,
          summary_detail_level: 3,
          warning_level: 'VERBOSE',
          define: [
            //'"DEBUG=true"',
            '"ENABLE_DEBUGGER=true"',
            //'"ENABLE_COMPILER=true"',
            '"ACCURATE_INTERRUPT_EMULATION=false"',
            '"ENABLE_SERVER_LOGGER=false"'
          ],
          debug: true,
          formatting: 'PRETTY_PRINT'
        }
      },

      // Generates a unminified concatenated version.
      // @todo Refactor to remove 'src/build/exports.js' from object `js` prop.
      concat: {
        js: '<%= js %>',
        jsOutputFile: 'min/jssms.concat.js',
        options: {
          compilation_level: 'WHITESPACE_ONLY',
          language_in: 'ECMASCRIPT5_STRICT',
          language_out: 'ECMASCRIPT5_STRICT',
          summary_detail_level: 3,
          warning_level: 'VERBOSE',
          debug: true,
          formatting: 'PRETTY_PRINT'
        }
      },

      // Generates a minified version of the script for the Firefox OS app.
      alec: {
        js: [
          'src/setup.js',
          'src/sms.js',
          'src/utils.js',
          'src/sync-client.js',
          'src/z80.js',
          'src/keyboard.js',
          'src/psg.js',
          'src/vdp.js',
          'src/alec/ui.js',
          'src/ports.js',
          'src/compiler/bytecode.js',
          'src/compiler/parser.js',
          'src/compiler/opcodes-ast.js',
          'src/compiler/opcodes-CB.js',
          'src/compiler/opcodes-DD-FD.js',
          'src/compiler/opcodes-ED.js',
          'src/compiler/opcodes.js',
          'src/compiler/analyzer.js',
          'src/compiler/optimizer.js',
          'src/compiler/generator.js',
          'src/compiler/recompiler.js',
          'src/build/exports.js'
        ],
        jsOutputFile: 'alec/min/alec.min.js',
        options: {
          externs: '<%= externs %>',
          compilation_level: 'SIMPLE_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT',
          language_out: 'ECMASCRIPT5_STRICT',
          use_types_for_optimization: null,
          summary_detail_level: 3,
          warning_level: 'VERBOSE',
          output_wrapper: '(function(window){%output%})(window);',
          define: [
            //'"DEBUG=false"',
            '"ENABLE_DEBUGGER=false"',
            //'"ENABLE_COMPILER=true"',
            '"FORCE_TYPED_ARRAYS=true"',
            '"FORCE_DATAVIEW=true"',
            '"FORCE_DESTRUCTURING=true"',
            '"ACCURATE_INTERRUPT_EMULATION=false"',
            '"ENABLE_SERVER_LOGGER=false"'
          ],
          debug: false
        }
      },

      // Minify the bootstrap file for the Firefox OS app.
      'alec-bootstrap': {
        js: [
          'src/setup.js',
          'src/alec/bootstrap.js'
        ],
        jsOutputFile: 'alec/min/bootstrap.min.js',
        options: {
          externs: [
            '<%= closurePath %>/contrib/externs/jquery-1.9.js',
            'src/build/externs/jssms.js'
          ],
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT',
          language_out: 'ECMASCRIPT5_STRICT',
          use_types_for_optimization: null,
          summary_detail_level: 3,
          warning_level: 'VERBOSE',
          output_wrapper: '(function(window,document,navigator){%output%})(window,document,navigator);',
          define: [
            '"DEBUG=false"'
          ],
          debug: false
        }
      },

      // Generates a minified version of the script to use with node.js.
      node: {
        js: '<%= js %>',
        jsOutputFile: 'min/jssms.node.js',
        options: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT',
          language_out: 'ECMASCRIPT5_STRICT',
          use_types_for_optimization: null,
          summary_detail_level: 3,
          warning_level: 'VERBOSE',
          output_wrapper: '(function(window){%output%module.exports=JSSMS\n})(global);',
          define: [
            //'"DEBUG=true"',
            '"ENABLE_DEBUGGER=true"',
            '"ENABLE_COMPILER=false"',
            '"ACCURATE_INTERRUPT_EMULATION=true"',
            '"ENABLE_SERVER_LOGGER=false"'
          ],
          debug: true,
          formatting: 'PRETTY_PRINT'
        }
      }
    },

    htmlmin: {
      alec: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          html5: true
        },
        files: {
          'alec/index.html': 'alec/src.html'
        }
      }
    },

    concat: {
      jssms: {
        options: {
          banner: grunt.file.read('src/license.js')
        },
        files: {
          'min/jssms.min.js': ['min/jssms.min.js'],
          'min/jssms.debug.js': ['min/jssms.debug.js'],
          'min/jssms.concat.js': ['min/jssms.concat.js']
        }
      },
      'alec': {
        options: {
          banner: grunt.file.read('src/license.js')
        },
        files: {
          'alec/min/alec.min.js': ['alec/min/alec.min.js']
        }
      },
      'alec-bootstrap': {
        // No banner on this one.
        options: {
          process: function(src) {
            // Inline JavaScript bootstrap code.
            return src.replace(/<script src=\.\.\/src\/setup\.js>.+<\/script>/,
              '<script>' + grunt.file.read('alec/min/bootstrap.min.js').trim() + '</script>');
          }
        },
        files: {
          'alec/index.html': ['alec/index.html']
        }
      },
      node: {
        options: {
          banner: grunt.file.read('src/license.js')
        },
        files: {
          'min/jssms.node.js': ['min/jssms.node.js']
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', [
    'closure-compiler:min',
    'closure-compiler:debug',
    'closure-compiler:concat',
    'concat:jssms'
  ]);
  grunt.registerTask('alec', [
    'closure-compiler:alec',
    'closure-compiler:alec-bootstrap',
    'htmlmin:alec',
    'concat:alec',
    'concat:alec-bootstrap'
  ]);
  grunt.registerTask('node', [
    'closure-compiler:node',
    'concat:node'
  ]);
};
