/* jshint evil:true */

define(function () {

  'use strict';

  var MockConsole = (function () {
    var genLogger = function (severity) {
      return function () {
        var args = Array.prototype.slice.call(arguments);
        this.output.push({
          severity: severity,
          message: args.join(' ')
        });
      };
    };

    var MockConsole = function () {
      this.output = [];
    };

    MockConsole.prototype.log   = genLogger('log');
    MockConsole.prototype.error = genLogger('error');

    return MockConsole;
  }());

  var JSRunner = function (options) {
    options = options || {};
    this.win = options.window || window;
    this.debug = options.debug;
  };

  JSRunner.prototype.evaluate = function (javascript) {
    return this.win['eval'](javascript);
  };

  JSRunner.prototype.run = function (javascript) {
    var mockConsole = new MockConsole();
    var _console = this.win.console;
    var evaled, error;

    this.win.console = mockConsole;
    try {
      evaled = this.evaluate(javascript);
    } catch (e) {
      error = e;
      if (this.debug) {
        _console.error('EVAL ERROR:', e);
      }
    }
    this.win.console = _console;

    return {
      error: error,
      value: evaled,
      logs: mockConsole.output
    };
  };

  return JSRunner;

});
