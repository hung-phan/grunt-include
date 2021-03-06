/*
 * https://github.com/hung-phan/grunt-include
 * based on https://github.com/ng-vu/gulp-include-js
 * Copyright (c) 2014 Hung Quang Phan
 * Licensed under the MIT license.
 */

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var through = require('through2');
var trim = require('./trim');

var pluginName = 'include-js';
var magenta = chalk.magenta;
var errorColor = chalk.bold.red;

var cacheModules = {};    // {time: Date, includes: Array}
var cacheIncludes = {};   // {time: Date, content: String}

function error(context, err) {
  context.emit('error', console.log(errorColor(err)));
}

function exec(s, stack) {
  var result = '';
  var r = new RegExp('(//[^\r\n]*)?([^\\s]+[ \\t\\v]*)?' + this.options.keyword + '\\s*\\( *[\'"]([^\'"]*)[\'"]\\s*\\)');
  var m = r.exec(s);
  while (m) {
    var isCmt = m[1];
    var inline = m[2] || '';
    var id = m[3];

    result += s.slice(0, m.index);
    if (!isCmt) {
      var sinc = read.call(this, id, stack||[]);
      if (inline) sinc = trim(sinc);
      result += inline + sinc;

    } else {
      result += m[0];
    }
    s = s.slice(m.index + m[0].length);
    m = r.exec(s);
  }
  return result + s;
}

function read(id, stack) {

  var basename = path.basename(id);
  basename = basename[0] === '_'? basename : '_' + basename;
  basename = path.extname(basename) === this.options.ext? basename : basename + '.' + this.options.ext;

  var filepath = path.join(this.base, path.dirname(id), basename);
  var newStack = stack.concat([id]);

  if (stack.indexOf(id) >= 0) {
    error(this, new Error('Circular ' +
      newStack.map(function(i){ return magenta(i); }).join(', ')));
    return 'INCLUDE_ERROR(\'' + id + '\')';
  }

  this.includes[filepath] = this.includes[filepath] || time(filepath);

  var s = readIncFile.call(this, filepath);
  s = exec.call(this, s, newStack);
  return s;
}

function readIncFile(filepath) {
  var isCache = this.options.cache;
  var cache = cacheIncludes[filepath];
  if (isCache && cache && time(filepath) === cache.time) {
    return cache.content;
  }

  var s = fs.readFileSync(filepath, {encoding: 'utf8'});
  if (isCache) cacheIncludes[filepath] = {
    time: time(filepath),
    content: s
  };

  return s;
}

function time(filepath) {
  try {
    var stat = fs.statSync(filepath);
    return stat? stat.mtime.getTime() : null;

  } catch(e) {
    console.log('include-js: path not found', magenta(filepath));
    return null;
  }
}

function isDirty(filepath) {
  var cache = cacheModules[filepath];
  if (!cache || cache.time !== time(filepath)) return true;
  if (!cache.includes) return true;
  for (var incFile in cache.includes) {
    if (cacheIncludes[incFile].time !== time(incFile)) return true;
  }
  return false;
}

function include(options) {

  options = options || {};
  options.keyword = options.keyword || 'INCLUDE';
  options.cache = options.cache || false;
  options.showFiles = typeof options.showFiles === 'string'? options.showFiles :
    options.showFiles? 'include-js:' : false;
  options.ext = options.ext || 'js';
  if (options.ext[0] === '.') options.ext = options.ext.slice(1);

  return through.obj(function(file, enc, cb) {

    this.base = file.base || file.cwd;
    this.filepath = file.path;
    this.id = path.relative(this.base, this.filepath);
    this.options = options;
    this.includes = {};

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      error(this, new Error('Streaming not supported'));
      return cb();
    }

    // ignore _* files
    var filename = path.basename(file.path);
    if (filename[0] === '_') return cb();

    // check if file was cached
    if (options.cache && !isDirty(file.path)) {
      return cb();
    }

    var s = file.contents.toString();
    try {
      file.contents = new Buffer(exec.call(this, s));
    } catch (e) {
      e.filename = file.path;
      error(this, e);
      return cb();
    }

    // save to cache
    if (options.cache) cacheModules[file.path] = {
      time: time(file.path),
      includes: this.includes
    };

    if (options.showFiles) {
      console.log(options.showFiles, magenta(path.relative(file.cwd, file.path)));
    }

    this.push(file);
    cb();
  });
}

module.exports = include;
