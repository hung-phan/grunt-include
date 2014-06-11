/*
 * grunt-include
 * https://github.com/hung-phan/grunt-include
 *
 * Copyright (c) 2014 Hung Quang Phan
 * Licensed under the MIT license.
 */

'use strict';

var chalk = require('chalk');
var adapter = require('./../lib/adapter');

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks


  grunt.registerMultiTask('include', 'Grunt task for template injection', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      keyword: 'INCLUDE',
      ext: 'js',
      cache: false,
      showFiles: undefined
    });

    // Iterate over all specified file groups.

    this.files.forEach(function (file) {
      // Concat specified files.

      file.src.filter(function (filepath) {
        // ignore file with _*
        if (filepath.split('/').pop().charAt(0) === '_') {
          grunt.log.warn('Template file "' + chalk.bold.green(filepath) + '".');
          return false;
        }
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + chalk.bold.red(filepath) + '" not found.');
          return false;
        }
        return true;
      }).forEach(function (filepath) {
        var dest = file.dest.substring(0, file.dest.lastIndexOf('/'));
        adapter(filepath, options, dest);
      });
    });
  });

};
