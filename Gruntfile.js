module.exports = function(grunt) {
    var path = require('path');

    grunt.initConfig({
        browserify: {
            dist: {
                files: {
                    'tweeno.js': ['index.js'],
                },
                options: {
                    bundleOptions: {
                        standalone: 'Tweeno'
                    }
                }
            }
        },
        uglify: {
            default: {
                files: {
                    'tweeno.min.js': ['tweeno.js']
                }
            }
        },
        watch: {
            src: {
                files: './src/*.js',
                tasks: ['build'],
              },
        }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('build', ['browserify', 'uglify']);
};
