'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.include = {
  setUp: function (done) {
    // setup here if necessary
    done();
  },
  js: function (test) {
    test.expect(2);

    var actual = grunt.file.read('test/tmp/js/test.js');
    var expected = grunt.file.read('test/expected/expected.js');
    test.equal(actual, expected, 'should describe what the default behavior is.');

    actual = grunt.file.read('test/tmp/js/subfolder/sub.js');
    expected = grunt.file.read('test/expected/expected-subfolder.js');
    test.equal(actual, expected, 'should describe what the default behavior is.');

    test.done();
  },
  html: function (test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/html/index.html');
    var expected = grunt.file.read('test/expected/expected.html');
    test.equal(actual, expected, 'should describe what the default behavior is.');

    test.done();
  }
};
