module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Watch command
        watch: {
            grunt: { files: ['Gruntfile.js'] },
            js: { 
                files: 'src/**/*.js',
                tasks: ['uglify']
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
              'dist/waid.css': [
                'src/waid.css'
              ]
            }
          }
        },
        ngtemplates:  {
          options: {
            prefix: '/',
            bootstrap: function(module, script) {
                return 'angular.module(\'waid.templates\',[]).run([\'$templateCache\', function($templateCache) { ' + "\n" + script + '}]);';
            }
          },
          app: {
            cwd: 'src/',
            src:      '**/templates/**.html',
            dest:     'dist/templates.js'
          }
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
          // noconflict:{
          //     src: [
          //       'src/noconflict-start.js',

          //       // 'src/bower_components/fingerprintjs2/fingerprint2.js',
          //       // 'src/bower_components/jquery/dist/jquery.min.js',
          //       'src/bower_components/angular/angular.min.js',
          //       // 'src/bower_components/bootstrap/dist/js/bootstrap.min.js',
          //       'src/bower_components/angular-resource/angular-resource.min.js',
          //       'src/bower_components/angular-cookies/angular-cookies.min.js',
          //       'src/bower_components/angular-sanitize/angular-sanitize.min.js',
          //       // 'src/bower_components/angular-route/angular-route.js',
          //       // 'src/bower_components/angular-growl/build/angular-growl.js',
          //       // 'src/bower_components/angular-bootstrap/ui-bootstrap.min.js',
          //       // 'src/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
          //       // 'src/bower_components/angular-confirm-modal/angular-confirm.min.js',
          //       // 'src/bower_components/angular-slugify/angular-slugify.js',
          //       // 'src/bower_components/angular-elastic/elastic.js',
          //       // 'src/bower_components/textAngular/dist/textAngular-rangy.min.js',
          //       // 'src/bower_components/textAngular/dist/textAngular-sanitize.min.js',
          //       // 'src/bower_components/textAngular/dist/textAngular.min.js',


                
          //       // 'src/bower_components/isotope/jquery.isotope.js',
          //       // 'src/bower_components/angular-isotope/dist/angular-isotope.js',

          //       // 'src/waid.js',
          //       // 'src/core/app.js',
          //       // 'src/core/config.js',
          //       // 'src/core/services.js',
          //       // 'src/idm/config.js',
          //       // 'src/idm/controllers.js',
          //       // 'src/idm/directives.js',
          //       // 'dist/templates.js',
 
          //       'src/noconflict-end.js'
          //     ],
          //     dest: 'dist/waid-noconflict.js'
          // },
          default:{
              src: [
                'src/waid.js',

                'src/core/config.js',
                'src/core/translations.js',
                'src/core/services.js',
                'src/core/controllers.js',
                'src/core/directives.js',

                'src/idm/config.js',
                'src/idm/translations.js',
                'src/idm/controllers.js',
                'src/idm/directives.js',

                'src/comments/config.js',
                'src/comments/translations.js',
                'src/comments/controllers.js',
                'src/comments/directives.js',
                
              ],
              dest: 'dist/waid.js'
          }
        },
        // Javascript compression
        uglify: {
            options: {
                compress: false,
                mangle: false,
                beautify: false
            },
            buildScriptjs: { // Put here all your files that you want to be loaded in the header of the ps-framework
                src: [
                    // Build waid
                    'src/waid.js',
                    'src/core/config.js',
                    'src/core/services.js',
                    'src/idm/config.js',
                    'src/idm/translations.js',
                    'src/idm/controllers.js',
                    'src/idm/directives.js'
                ],
                dest: 'dist/waid.min.js'
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
