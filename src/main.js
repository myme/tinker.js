/* jshint evil:true */

(function () {

  'use strict';

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

  var evaluate = function (javascript) {
    return eval(javascript);
  };

  var runJavaScript = function (javascript) {
    var mockConsole = new MockConsole();
    var _console = window.console;
    var evaled;

    window.console = mockConsole;
    try {
      evaled = evaluate(javascript);
    } catch (e) {
    }
    window.console = _console;

    return {
      result: evaled,
      logs: mockConsole.output
    };
  };

  var dumpOutput = function (output) {
    var outputElement = document.getElementById('output');
    outputElement.innerHTML = "<pre><code>" + output  + "<\/code><\/pre>";
  };

  var dumpLogs = function (logs) {
    var logElement = document.getElementById('log-output');

    var severityMap = {
      'log': 'info',
      'error': 'error'
    };

    var formatted = logs.map(function (each) {
      return '<div class="alert alert-' +
        severityMap[each.severity] +
        '">' +
        each.message +
        '</div>';
    });

    if (formatted.length) {
      logElement.innerHTML = '<pre><code>' + formatted.join('') + '</code></pre>';
    } else {
      logElement.innerHTML = '';
    }
  };

  var handlers = {
    'default': function (value) {
      output.innerHTML = "<pre><code>" + value + "<\/code><\/pre>";
    },

    'javascript': function (value) {
      var result = runJavaScript(value);
      dumpOutput(JSON.stringify(result.result, 0, 2));
      dumpLogs(result.logs);
    }
  };

  var getHandler = function (editor) {
    var id = editor.getSession().getMode().$id;
    var mode = id.split('/').pop();
    return handlers[mode] || handlers['default'];
  };

  window.onload = function () {
    var editor = ace.edit('editor');

    editor.setKeyboardHandler(require('ace/keyboard/vim').handler);
    editor.setTheme('ace/theme/twilight');
    editor.getSession().setMode('ace/mode/javascript');
    editor.getSession().on('change', function (e) {
      var value = editor.session.getValue();
      getHandler(editor)(value);
    });
  };

}());
