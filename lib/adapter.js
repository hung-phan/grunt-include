/*
 *Module adapter to streaming file down to pipe
 */
var fs = require('vinyl-fs');
var include = require('./include');

var prefixer = function(filepath) {
  return './' + filepath;
};
/*
 * @glob  []
 * @options {}
 * @output ''
 */
module.exports = function(glob, options, output, cb, index, arrLength) {
  var done = function() {
    if (index + 1 === arrLength) {
      cb(true);
    }
  };

  fs.src([prefixer(glob)])
    .pipe(include(options))
    .pipe(fs.dest(prefixer(output)))
    .on('end', done);
};
