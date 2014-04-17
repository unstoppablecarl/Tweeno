module.exports = function(grunt) {
    var path = require('path');

    grunt.initConfig({
        browserify: {
            dist: {
                files: {
                    'tweeno.js': ['index.js'],
                },
                options: {
                    // transform: ['coffeeify']
                }
            }
        },
        uglify: {
            default: {
                files: {
                    'tweeno.min.js': ['tweeno.js']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', ['browserify', 'uglify']);
};
