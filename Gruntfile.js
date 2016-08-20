module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Watch command
        watch: {
            grunt: { files: ['Gruntfile.js'] },
            js: { 
                files: '/src/**/**.js',
                tasks: ['concat', 'uglify']
            },
            concat: { 
                files: 'src/**/*.js',
                tasks: ['concat']
            },
            templates: { 
                files: 'src/**/**.html',
                tasks: ['ngtemplates']
            },
            css: { 
                files: 'src/**/*.css',
                tasks: ['sass', 'concat', 'purifycss', 'cssmin']
            }
        },

        purifycss: {
            options: {},
            bootstrap3themesimplexnoconflict: {
              src: ['dist/bootstrap3/noconflict.js', 'dist/bootstrap3/templates.js'],
              css: ['dist/bootstrap3/css/themes/simplex-noconflict.css'],
              dest: 'dist/bootstrap3/css/themes/simplex-noconflict.css'
            },
            bootstrap3themeslatenoconflict: {
              src: ['dist/bootstrap3/noconflict.js', 'dist/bootstrap3/templates.js'],
              css: ['dist/bootstrap3/css/themes/slate-noconflict.css'],
              dest: 'dist/bootstrap3/css/themes/slate-noconflict.css'
            },
             bootstrap3themeyetinoconflict: {
              src: ['dist/bootstrap3/noconflict.js', 'dist/bootstrap3/templates.js'],
              css: ['dist/bootstrap3/css/themes/yeti-noconflict.css'],
              dest: 'dist/bootstrap3/css/themes/yeti-noconflict.css'
            },
        },

        sass: {
            options: {
                includePaths: [],
                sourceMap: false
            },
            // Create bootstrap3 no conflict
            dist: {
                files: {
                    'dist/bootstrap3/css/themes/simplex.css': 'src/core/bootstrap3/sass/simplex.scss',
                    'dist/bootstrap3/css/themes/simplex-noconflict.css': 'src/core/bootstrap3/sass/simplex-noconflict.scss',
                    'dist/bootstrap3/css/themes/slate.css': 'src/core/bootstrap3/sass/slate.scss',
                    'dist/bootstrap3/css/themes/slate-noconflict.css': 'src/core/bootstrap3/sass/slate-noconflict.scss',
                    'dist/bootstrap3/css/themes/yeti.css': 'src/core/bootstrap3/sass/yeti.scss',
                    'dist/bootstrap3/css/themes/yeti-noconflict.css': 'src/core/bootstrap3/sass/yeti-noconflict.scss'
                }
            }
        },

        cssmin: {
          options: {
            shorthandCompacting: false,
            roundingPrecision: -1
          },
          target: {
            files: {
              'dist/bootstrap3/waid.min.css': [
                'dist/bootstrap3/waid.css'
              ]
            }
          },
          bootstrap3noconflict: {
            files: {
              'dist/bootstrap3/css/themes/simplex.min.css': [
                'dist/bootstrap3/css/themes/simplex.css'
              ],
              'dist/bootstrap3/css/themes/simplex-noconflict.min.css': [
                'dist/bootstrap3/css/themes/simplex-noconflict.css'
              ],
              'dist/bootstrap3/css/themes/slate.min.css': [
                'dist/bootstrap3/css/themes/slate.css'
              ],
              'dist/bootstrap3/css/themes/slate-noconflict.min.css': [
                'dist/bootstrap3/css/themes/slate-noconflict.css'
              ],
              'dist/bootstrap3/css/themes/yeti.min.css': [
                'dist/bootstrap3/css/themes/yeti.css'
              ],
              'dist/bootstrap3/css/themes/yeti-noconflict.min.css': [
                'dist/bootstrap3/css/themes/yeti-noconflict.css'
              ]
            }
          }
        },

        ngtemplates: {
          // Make all boostrap3 templates for caching
          bootstrap3:{
            options: {
              prefix: '/',
              bootstrap: function(module, script) {
                return 'angular.module(\'waid.templates\',[]).run([\'$templateCache\', function($templateCache) { ' + "\n" + script + '}]);';
              },
              url:    function(url) { return url.replace('bootstrap3/', ''); }
            },
            cwd: 'src/',
            src:      '**/bootstrap3/templates/**/**.html',
            dest:     'dist/bootstrap3/templates.js'
          }
        },

        copy: {
          main: {
            files: [
              // includes files within path and its sub-directories
              {expand: true, flatten: true, src: ['src/assets/fonts/*'], dest: 'dist/fonts/'},
            ],
          }
        },

        concat: {
          // Base waid.js for core functionality
          basejs : {
            src: [
                'src/core/app.js',
                'src/core/core.js',
                'src/core/strategy.js',
                
                'src/core/services.js',
                'src/core/controllers.js',
                'src/core/directives.js',

                'src/idm/app.js',
                'src/idm/controllers.js',
                'src/idm/directives.js',

                'src/comments/app.js',
                'src/comments/controllers.js',
                'src/comments/directives.js'
              ],
              dest: 'dist/waid.js'
          },
          bootstrap3js:{
              src: [
                'dist/waid.js',
                'src/core/bootstrap3/javascript/strategy.js',
              ],
              dest: 'dist/bootstrap3/waid.js'
          },
          bootstrap3noconflictjs:{
              src: [
                'dist/waid.js',
                'src/core/bootstrap3/javascripts/noconflict/ui-bootstrap.js',
                'src/core/bootstrap3/javascripts/noconflict/elastic.js',
                'src/core/bootstrap3/javascripts/noconflict/fingerprint2.js',
                'src/core/bootstrap3/javascripts/noconflict/angular-growl.js',
                'src/core/bootstrap3/javascripts/noconflict/angular-slugify.js',
                'src/core/bootstrap3/javascripts/strategy-noconflict.js',
              ],
              dest: 'dist/bootstrap3/noconflict.js'
          }
        },
        // Javascript compression
        uglify: {
            options: {
                compress: {},
                mangle: false,
                beautify: false
            },
            base:{
                files: { 
                    'dist/waid.min.js': ['dist/waid.js']
                }
            },
            bootstrap3noconflict:{
                files: { 
                    'dist/bootstrap3/noconflict.min.js': ['dist/bootstrap3/noconflict.js']
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
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-purifycss');

    // Register tasks, can be used on command line
    grunt.registerTask('default', ['copy', 'ngtemplates', 'sass', 'concat', 'purifycss', 'cssmin', 'uglify', 'watch']);
}
