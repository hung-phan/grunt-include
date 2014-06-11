/*
 * grunt-include
 * https://github.com/hung-phan/grunt-include
 *
 * Copyright (c) 2014 Hung Quang Phan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    include: {
      js: {
        options: {
          ext:'js',
          cache:true,
          showFiles:'Building'
        },
        files: [{
          expand: true,
          cwd: 'test/fixtures/js',
          src  : ['**/*.js'],
          dest : 'test/tmp/js',
        }]
      },
      html: {
        options: {
          ext:'html',
          cache:true,
          showFiles:'Building'
        },
        files: [{
          expand: true,
          cwd: 'test/fixtures/html',
          src  : ['**/*.html'],
          dest : 'test/tmp/html',
        }]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'include', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
