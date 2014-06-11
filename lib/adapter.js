/*
 *Module adapter to streaming file down to pipe
 */
var fs = require('vinyl-fs');
var chalk = require('chalk');
var include = require('./include');

var prefixer = function(filepath) {
  return './' + filepath;
};
/*
 * @glob  []
 * @options {}
 * @output ''
 */
module.exports = function(glob, options, output) {
  fs.src([prefixer(glob)])
    .pipe(include(options))
    .pipe(fs.dest(prefixer(output)))
    .on('end', function() {
        console.log(chalk.green(glob) + ' is done.');
    });
};
