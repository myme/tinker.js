/* jshint evil:true */

(function () {

  'use strict';

  var hideEl = function (element) {
    element.style.display = 'none';
  };

  var showEl = function (element) {
    element.style.display = 'block';
  };

  var getId = function (id) {
    return document.getElementById(id);
  };


  // Output controller
  var OutputController = (function () {
    var OutputController = function (outputEl) {
      this.outputEl = outputEl;
    };

    OutputController.prototype.setOutput = function (output) {
      if (output !== null ) {
        this.outputEl.innerHTML = "<pre><code>" + output  + "<\/code><\/pre>";
      } else {
        this.outputEl.innerHTML = '';
      }
    };

    return OutputController;
  }());


  // Log controller

  var LogController = (function () {
    var LogController = function (options) {
      this.summaryEl = options.summaryEl;
      this.outputEl = options.outputEl;
      this.summaryEl.onclick = this.clickSummary.bind(this);
      this.outputEl.onclick = this.clickOutput.bind(this);
      this.hideLogs();
      this.setLogs([]);
    };

    LogController.prototype.clickSummary = function (e) {
      e.preventDefault();
      this.showLogs();
    };

    LogController.prototype.clickOutput = function (e) {
      e.preventDefault();
      this.hideLogs();
    };

    LogController.prototype.hideAll = function () {
      hideEl(this.summaryEl);
      hideEl(this.outputEl);
    };

    LogController.prototype.showLogs = function () {
      hideEl(this.summaryEl);
      showEl(this.outputEl);
      this.shouldShowLogs = true;
    };

    LogController.prototype.hideLogs = function () {
      hideEl(this.outputEl);
      showEl(this.summaryEl);
      this.shouldShowLogs = false;
    };

    LogController.prototype.setLogs = function (logs) {
      var length = logs.length;

      if (length) {
        this.summaryEl.innerHTML = '<i class="icon-plus-sign"></i> ' +
          length +
          ' log ' +
          (length === 1 ? 'message' : 'messages');
        this.setOutput(logs);
        if (this.shouldShowLogs) {
          this.showLogs();
        } else {
          this.hideLogs();
        }
      } else {
        this.summaryEl.innerHTML = '';
        this.setOutput([]);
        this.hideAll();
      }
    };

    LogController.prototype.setOutput = function (logs) {
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
        this.outputEl.innerHTML = '<pre><code>' + formatted.join('') + '</code></pre>';
      } else {
        this.outputEl.innerHTML = '';
      }
    };

    return LogController;
  }());


  // JavaScript runner

  var JSRunner = (function () {
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

    return JSRunner;
  }());


  // Editor

  var Editor = (function () {
    var Editor = function (options) {
      var editor = this.editor = ace.edit(options.selector);

      ['keyboardHandler', 'theme'].forEach(function (each) {
        var option = options[each];
        if (option) {
          var fn = 'set' + each.substr(0, 1).toUpperCase() + each.substr(1);
          editor[fn](option);
        }
      });

      if (options.mode) {
        editor.getSession().setMode(options.mode);
      }
    };

    Editor.prototype.getMode = function () {
      var id = this.editor.getSession().getMode().$id;
      return id ? id.split('/').pop() : null;
    };

    Editor.prototype.getValue = function () {
      return this.editor.session.getValue();
    };

    Editor.prototype.onchange = function (callback) {
      this.editor.getSession().on('change', callback);
    };

    return Editor;
  }());


  // DOM Ready

  window.onload = function () {
    var outputController = new OutputController(getId('output'));

    var logController = new LogController({
      summaryEl: getId('log-summary'),
      outputEl: getId('log-output')
    });

    var handlers = {
      'default': function (value) {
        outputController.setOutput(value);
      },

      'javascript': function (javascript) {
        var frame = document.createElement('iframe');
        var result = new JSRunner({
          'window': frame.contentWindow
        }).run(javascript);
        var value = result.value;

        if (javascript.trim()) {
          outputController.setOutput(JSON.stringify(value, 0, 2));
        } else {
          outputController.setOutput(null);
        }
        logController.setLogs(result.logs);
      }
    };

    var editor = new Editor({
      selector: 'editor',
      keyboardHandler: require('ace/keyboard/vim').handler,
      theme: 'ace/theme/twilight',
      mode: 'ace/mode/javascript'
    });

    editor.onchange(function (e) {
      var mode = editor.getMode();
      var handler = (mode && handlers[mode]) || handlers['default'];
      handler(editor.getValue());
    });
  };

}());
