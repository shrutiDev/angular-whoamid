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
            templates: { 
                files: 'src/**/*.html',
                tasks: ['ngtemplates']
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
            dest:     'src/dist/templates.js'
          }
        },

        copy: {
          main: {
            files: [
              // includes files within path and its sub-directories
              {expand: true, flatten: true, src: ['src/assets/fonts/*'], dest: 'src/dist/fonts/'},
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
                    // Build waid
                    'src/waid.js',
                    'src/core/config.js',
                    'src/core/services.js',
                    'src/idm/config.js',
                    'src/idm/controllers.js',
                    'src/idm/directives.js'
                ],
                dest: 'src/dist/waid.js'
            }
        }

    });

    // Loading tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Register tasks, can be used on command line
    grunt.registerTask('default', ['uglify', 'ngtemplates', 'copy', 'watch']);
}
