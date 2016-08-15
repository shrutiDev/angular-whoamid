module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Watch command
        watch: {
            grunt: { files: ['Gruntfile.js'] },
            js: { 
                files: '/src/**/*.js',
                tasks: ['concat', 'uglify']
            },
            concat: { 
                files: 'src/**/*.js',
                tasks: ['concat']
            },
            templates: { 
                files: 'src/**/*.html',
                tasks: ['ngtemplates']
            },
            css: { 
                files: 'src/**/*.css',
                tasks: ['cssmin']
            }
        },
        cssmin: {
          options: {
            shorthandCompacting: false,
            roundingPrecision: -1
          },
          target: {
            files: {
              'dist/waid-bootstrap3-min.css': [
                'dist/waid-bootstrap3.css'
              ]
            }
          }
        },
        ngtemplates: {
          bootstrap3:{
            options: {
              prefix: '/',
              bootstrap: function(module, script) {
                return 'angular.module(\'waid.templates\',[]).run([\'$templateCache\', function($templateCache) { ' + "\n" + script + '}]);';
              },
              url:    function(url) { return url.replace('bootstrap3/', ''); }
            },
            cwd: 'src/',
            src:      '**/bootstrap3/templates/**.html',
            dest:     'dist/waid-bootstrap3-templates.js'
          },
         
        },

        copy: {
          main: {
            files: [
              // includes files within path and its sub-directories
              {expand: true, flatten: true, src: ['src/assets/fonts/*'], dest: 'dist/fonts/'},
            ],
          },
        },

        concat: {
          bootstrap3css:{
            src:[
                'src/waid.css',
                'src/core/bootstrap3/css/main.css'
              ],
            dest:'dist/waid-bootstrap3.css'
          },
          bootstrap3:{
              src: [
                'src/core/app.js',
                'src/core/core.js',
                'src/core/strategy.js',
                
                'src/core/services.js',
                'src/core/controllers.js',
                'src/core/directives.js',
                'src/core/bootstrap3/strategy.js',
                
                'src/idm/app.js',
                'src/idm/controllers.js',
                'src/idm/directives.js',

                'src/comments/app.js',
                'src/comments/controllers.js',
                'src/comments/directives.js',
                
              ],
              dest: 'dist/waid-bootstrap3.js'
          }
        },
        // Javascript compression
        uglify: {
            bootstrap3:{
                options: {
                    compress: false,
                    mangle: false,
                    beautify: false
                },
                buildScriptjs: { 
                    src: [
                        // Build waid
                        'dist/waid-bootstrap3.js',
                    ],
                    dest: 'dist/waid-bootstrap3.min.js'
                }
            }
        }

    });

    // Loading tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    // Register tasks, can be used on command line
    grunt.registerTask('default', ['uglify', 'ngtemplates', 'concat', 'cssmin', 'copy', 'watch']);
}
