# grunt-include [![Build Status](https://secure.travis-ci.org/hung-phan/grunt-include.png?branch=master)](https://travis-ci.org/hung-phan/grunt-include)

> Grunt task for template injection

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-include --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-include');
```

## The "include" task
This task is inspired by [gulp/include](https://github.com/ng-vu/gulp-include-js). Its main purpose is to
injecting template into another.

### Structure
```
application/
  |- src/
  |  |- number/
  |  |  |- _another-code.js
  |  |- _code.js
  |  |- test.js
  |- Gruntfile.js
  |- package.json
```

### Usage
In your project's Gruntfile, add a section named `include` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  include: {
    // Target-specific file lists and/or options go here.
    your_target: {
      options: {
        ext:'js', // extension file to be read from
        cache:true, // cache for template file
        showFiles:'Building' // message to be displayed when building file
      },
      files: [{
        expand: true,
        cwd: 'src',
        src  : ['**/*.js'],
        dest : 'build',
      }]
    },
  },
})
```

#### test.js
```js
function plus() {
  return INCLUDE('code');
}

module.exports = plus;
```

#### Template
`_code.js`
```js
function(a) { return a + INCLUDE('number/another-code'); }
```

`number/_another-code.js`
```js
10
```

#### Result
```js
function plus() {
  return function(a) { return a + 10; };
}

module.exports = plus;
```

### Options

#### options.keyword
Type: `String`
Default value: `'keyword'`

Keyword to be replaced in main template.

#### options.ext
Type: `String`
Default value: `'js'`

Extension of file to be read from.

#### options.cache
Type: `Boolean`
Default value: `false`

Cache module for remembering template path.

#### options.showFiles
Type: `String`
Default value: `undefined`

File name to be display.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 Hung Quang Phan. Licensed under the MIT license.
