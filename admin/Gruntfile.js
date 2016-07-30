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
            }
        },

        cssmin: {
          options: {
            shorthandCompacting: false,
            roundingPrecision: -1
          },
          target: {
            files: {
              'public/css/main.css': [
                // Build waid sources
                'src/bower_components/textAngular/dist/textAngular.css',
                'src/bower_components/font-awesome/css/font-awesome.min.css',
                'src/bower_components/angular-growl/build/angular-growl.min.css',
                'src/bower_components/angular-whoamid/assets/bootstrap3-themes/simplex.css',

                'src/main.css'
              ]
            }
          }
        },

        copy: {
          main: {
            files: [
              // includes files within path and its sub-directories
              {expand: true, flatten: true, src: ['src/bower_components/angular-whoamid/dist/fonts/*'], dest: 'public/fonts/'},
            ],
          },
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
                    

                    // waid resources
                    'src/bower_components/fingerprintjs2/fingerprint2.js',
                    'src/bower_components/jquery/dist/jquery.min.js',
                    'src/bower_components/angular/angular.min.js',
                    'src/bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'src/bower_components/angular-resource/angular-resource.min.js',
                    'src/bower_components/angular-cookies/angular-cookies.min.js',
                    'src/bower_components/angular-sanitize/angular-sanitize.min.js',
                    'src/bower_components/angular-route/angular-route.js',
                    'src/bower_components/angular-growl/build/angular-growl.js',
                    'src/bower_components/angular-bootstrap/ui-bootstrap.min.js',
                    'src/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    'src/bower_components/angular-confirm-modal/angular-confirm.min.js',

                  
                    'src/bower_components/angular-slugify/angular-slugify.js',
                  
                    'src/bower_components/angular-elastic/elastic.js',

                    'src/bower_components/textAngular/dist/textAngular-rangy.min.js',
                    'src/bower_components/textAngular/dist/textAngular-sanitize.min.js',
                    'src/bower_components/textAngular/dist/textAngular.min.js',

                    'src/bower_components/jquery/dist/jquery.min.js',
                    'src/bower_components/jquery.stellar/src/jquery.stellar.js',

                    // Build waid
                    'src/bower_components/angular-whoamid/dist/waid.js',
                    'src/bower_components/angular-whoamid/dist/templates.js',

                    // // Build admin
                    'src/app/app.js',
                    
                    'src/app/config.js',
                    'src/app/controllers.js'
                ],
                dest: 'public/js/script.js'
            }
        }

    });

    // Loading tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Register tasks, can be used on command line
    grunt.registerTask('default', ['uglify', 'cssmin', 'copy', 'watch']);
}
