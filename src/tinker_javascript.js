/* jshint evil:true */

(function (Tinker) {

  'use strict';

  // JavaScript runner

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
    this.win = options.window || window,
    this.debug = options.debug;
  };

  JSRunner.prototype.evaluate = function (javascript) {
    return this.win['eval'](javascript);
  };

  JSRunner.prototype.run = function (javascript) {
    var mockConsole = new MockConsole();
    var _console = this.win.console;
    var evaled;

    this.win.console = mockConsole;
    try {
      evaled = this.evaluate(javascript);
    } catch (e) {
      if (this.debug) {
        _console.error('EVAL ERROR:', e);
      }
    }
    this.win.console = _console;

    return {
      value: evaled,
      logs: mockConsole.output
    };
  };

  Tinker.addHandler('javascript', function (javascript) {
    var frame = document.createElement('iframe');
    var result = new JSRunner({
      'window': frame.contentWindow
    }).run(javascript);
    var value = result.value;

    if (javascript.trim()) {
      this.outputView.setOutput(JSON.stringify(value, 0, 2));
    } else {
      this.outputView.setOutput(null);
    }
    this.logController.setLogs(result.logs);
  });

}(window.Tinker));
