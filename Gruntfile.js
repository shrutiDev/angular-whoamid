module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Watch command
        watch: {
            grunt: { files: ['Gruntfile.js'] },
            jsconcat: { 
                files: '/src/**/**.js',
                tasks: ['concat']
            },
            cssconcat: { 
                files: 'src/**/*.js',
                tasks: ['concat']
            },
            bootstraptemplatecopy: { 
                files: 'src/waid-bootstrap/templates/**/*.html',
                tasks: ['copy']
            }
        },

        // purifycss: {
        //     options: {},
        //     // bootstrap3themesimplexnoconflict: {
        //     //   src: ['dist/bootstrap3/noconflict.js', 'dist/bootstrap3/templates.js'],
        //     //   css: ['dist/bootstrap3/css/themes/simplex-noconflict.css'],
        //     //   dest: 'dist/bootstrap3/css/themes/simplex-noconflict.css'
        //     // },
        //     // bootstrap3themeslatenoconflict: {
        //     //   src: ['dist/bootstrap3/noconflict.js', 'dist/bootstrap3/templates.js'],
        //     //   css: ['dist/bootstrap3/css/themes/slate-noconflict.css'],
        //     //   dest: 'dist/bootstrap3/css/themes/slate-noconflict.css'
        //     // },
        //     //  bootstrap3themeyetinoconflict: {
        //     //   src: ['dist/bootstrap3/noconflict.js', 'dist/bootstrap3/templates.js'],
        //     //   css: ['dist/bootstrap3/css/themes/yeti-noconflict.css'],
        //     //   dest: 'dist/bootstrap3/css/themes/yeti-noconflict.css'
        //     // },
        // },

        sass: {
            options: {
                includePaths: [],
                sourceMap: false
            },
            // Create bootstrap3 no conflict
            dist: {
                files: {
                    'dist/bootstrap3/css/simplex.css': 'src/waid-bootstrap3/sass/simplex.scss',
                    'dist/bootstrap3/css/simplex-noconflict.css': 'src/waid-bootstrap3/sass/simplex-noconflict.scss',
                    'dist/bootstrap3/css/slate.css': 'src/waid-bootstrap3/sass/slate.scss',
                    'dist/bootstrap3/css/slate-noconflict.css': 'src/waid-bootstrap3/sass/slate-noconflict.scss',
                    'dist/bootstrap3/css/yeti.css': 'src/waid-bootstrap3/sass/yeti.scss',
                    'dist/bootstrap3/css/yeti-noconflict.css': 'src/waid-bootstrap3/sass/yeti-noconflict.scss'
                }
            }
        },

        // cssmin: {
        //   options: {
        //     shorthandCompacting: false,
        //     roundingPrecision: -1
        //   },
        //   target: {
        //     files: {
        //       'dist/bootstrap3/waid.min.css': [
        //         'dist/bootstrap3/waid.css'
        //       ]
        //     }
        //   },
        //   bootstrap3noconflict: {
        //     files: {
        //       'dist/bootstrap3/css/themes/simplex.min.css': [
        //         'dist/bootstrap3/css/themes/simplex.css'
        //       ],
        //       'dist/bootstrap3/css/themes/simplex-noconflict.min.css': [
        //         'dist/bootstrap3/css/themes/simplex-noconflict.css'
        //       ],
        //       'dist/bootstrap3/css/themes/slate.min.css': [
        //         'dist/bootstrap3/css/themes/slate.css'
        //       ],
        //       'dist/bootstrap3/css/themes/slate-noconflict.min.css': [
        //         'dist/bootstrap3/css/themes/slate-noconflict.css'
        //       ],
        //       'dist/bootstrap3/css/themes/yeti.min.css': [
        //         'dist/bootstrap3/css/themes/yeti.css'
        //       ],
        //       'dist/bootstrap3/css/themes/yeti-noconflict.min.css': [
        //         'dist/bootstrap3/css/themes/yeti-noconflict.css'
        //       ]
        //     }
        //   }
        // },

        // ngtemplates: {
        //   // Make all boostrap3 templates for caching
        //   bootstrap3:{
        //     options: {
        //       prefix: '/',
        //       bootstrap: function(module, script) {
        //         return 'angular.module(\'waid.templates\',[]).run([\'$templateCache\', function($templateCache) { ' + "\n" + script + '}]);';
        //       },
        //       url:    function(url) { return url.replace('bootstrap3/', ''); }
        //     },
        //     cwd: 'src/',
        //     src:      '**/bootstrap3/templates/**/**.html',
        //     dest:     'dist/bootstrap3/templates.js'
        //   }
        // },

        copy: {
          main: {
            files: [
              // includes files within path and its sub-directories
              {expand: true, flatten: true, src: ['src/fonts/*'], dest: 'dist/bootstrap3/fonts/'}
            ],
          },
          bootstrap3templates: {
            files: [
              // includes files within path and its sub-directories
              {expand: true, cwd: 'src/waid-bootstrap3/templates/', src: ['**'], dest: 'dist/bootstrap3/templates/'}
            ],
          }
        },

        concat: {
          // Base waid.js for core functionality
          waidjs : {
            src: [
                'src/waid/core/app.js',
                'src/waid/core/core.js',
                'src/waid/core/strategy.js',
                'src/waid/core/services.js',
                'src/waid/core/controllers.js',
                'src/waid/core/directives.js',

                'src/waid/idm/app.js',
                'src/waid/idm/controllers.js',
                'src/waid/idm/directives.js',

                'src/waid/comments/app.js',
                'src/waid/comments/controllers.js',
                'src/waid/comments/directives.js',

                'src/waid/rating/app.js',
                'src/waid/rating/controllers.js',
                'src/waid/rating/directives.js'
              ],
              dest: 'dist/waid.js'
          },
          waiddependenciesjs:{
              src: [
                'src/dependencies/angular-slugify.js',
                'src/dependencies/elastic.js',
                'src/dependencies/fingerprint2.js',
              ],
              dest: 'dist/waid-dependencies.js'
          },
          bootstrap3js:{
              src: [
                'src/waid-bootstrap3/js/strategy.js',
              ],
              dest: 'dist/bootstrap3/waid.js'
          },
          bootstrap3dependenciesjs:{
              src: [
                'src/waid-bootstrap3/js/dependencies/angular-confirm.js',
                'src/waid-bootstrap3/js/dependencies/angular-growl.js',
                'src/waid-bootstrap3/js/dependencies/ui-bootstrap.js',
              ],
              dest: 'dist/bootstrap3/waid-dependencies.js'
          }
        }
        // // Javascript compression
        // uglify: {
        //     options: {
        //         compress: {},
        //         mangle: false,
        //         beautify: false
        //     },
        //     base:{
        //         files: { 
        //             'dist/waid.min.js': ['dist/waid.js']
        //         }
        //     },
        //     bootstrap3noconflict:{
        //         files: { 
        //             'dist/bootstrap3/noconflict.min.js': ['dist/bootstrap3/noconflict.js']
        //         }
        //     }
        // }

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
    grunt.registerTask('default', ['copy', 'concat', 'sass', 'watch']);
}
