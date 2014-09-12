'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            'dist'
                        ]
                    }
                ]
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd:    '',
                        dest:   'dist',
                        src:    [
                            '.ebextensions/*.config',
                            'collections/**/*.js',
                            'models/**/*.js',
                            'modules/**/*.js',
                            'routes/**/*.js',
                            'migrations/**/*.js',
                            'views/**/*.jade',
                            'app.js',
                            'package.json'
                        ]
                    }
                ]
            }
        }
    });

    grunt.registerTask('build', [
        'clean:dist',
        'copy:dist'
    ]);
};
