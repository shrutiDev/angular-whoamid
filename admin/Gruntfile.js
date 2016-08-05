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
            css: { 
                files: 'src/**/*.css',
                tasks: ['cssmin']
            },
            concat: { 
                files: 'src/**/*.js',
                tasks: ['concat']
            },
            templates: { 
                files: 'src/app/**/*.html',
                tasks: ['ngtemplates']
            }
        },
        ngtemplates:  {
          options: {
            prefix: '/',
            bootstrap: function(module, script) {
                return 'angular.module(\'waid.admin.templates\',[]).run([\'$templateCache\', function($templateCache) { ' + "\n" + script + '}]);';
            }
          },
          app: {
            cwd: 'src/',
            src:      'app/**/templates/*.html',
            dest:     'src/app/templates.js'
          }
        },
        cssmin: {
          options: {
            shorthandCompacting: false,
            roundingPrecision: -1
          },
          target: {
            files: {
              'public/static/css/main.css': [
                 // Build waid sources
                'src/bower_components/font-awesome/css/font-awesome.min.css',
                'src/bower_components/angular-growl/build/angular-growl.min.css',
                'src/angular-whoamid/src/assets/bootstrap3-themes/simplex.css',

                'src/angular-whoamid/dist/waid.css',
                'src/main.css',
              ]
            }
          }
        },

        copy: {
          main: {
            files: [
              // includes files within path and its sub-directories
              {expand: true, flatten: true, src: ['src/angular-whoamid/dist/fonts/*'], dest: 'public/static/fonts/'},
            ],
          },
        },

        concat: {
          default:{
              src: [
                    // waid resources
                    // browser fingerprinting
                    'src/bower_components/fingerprintjs2/fingerprint2.js',
                    // 
                    'src/bower_components/jquery/dist/jquery.min.js',
                    // Bootstrap libs
                    'src/bower_components/bootstrap/dist/js/bootstrap.min.js',
                    // Base angular resource
                    'src/bower_components/angular/angular.js',
                    'src/bower_components/angular-resource/angular-resource.js',
                    'src/bower_components/angular-cookies/angular-cookies.js',
                    'src/bower_components/angular-sanitize/angular-sanitize.js',
                    'src/bower_components/angular-route/angular-route.js',

                    // Growl
                    'src/bower_components/angular-growl/build/angular-growl.js',
                    // ui bootstrap
                    'src/bower_components/angular-bootstrap/ui-bootstrap.min.js',
                    'src/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    // Confirm modal
                    'src/bower_components/angular-confirm-modal/angular-confirm.min.js',
                    // Create slugs
                    'src/bower_components/angular-slugify/angular-slugify.js',
                    // dynamic textarea
                    'src/bower_components/angular-elastic/elastic.js',


                    'src/bower_components/textAngular/dist/textAngular-rangy.min.js',
                    'src/bower_components/textAngular/dist/textAngular-sanitize.min.js',
                    'src/bower_components/textAngular/dist/textAngular.min.js',

                    'src/bower_components/jquery.stellar/src/jquery.stellar.js',

                    'src/bower_components/isotope/jquery.isotope.js',
                    'src/bower_components/angular-isotope/dist/angular-isotope.js',

                    // Build waid
                    
                    'src/angular-whoamid/dist/waid.js',
                    'src/angular-whoamid/dist/templates.js',

                    //'src/angular-whoamid/dist/waid-noconflict.js',
                    // Build demo
                    'src/app/app.js',
                    'src/app/templates.js',
                    'src/app/config.js',
                    'src/app/controllers.js'
                
              ],
              dest: 'public/static/js/script.js'
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
                    'public/static/js/script.js',
                ],
                dest: 'public/static/js/script.min.js'
            }
        }

    });

    // Loading tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-angular-templates');
    // Register tasks, can be used on command line
    grunt.registerTask('default', ['uglify', 'ngtemplates', 'cssmin', 'concat', 'copy', 'watch']);
}
