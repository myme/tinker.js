/* jshint evil:true */

(function () {

  'use strict';

  var MockConsole = (function () {
    var MockConsole = function () {
      this.output = [];
    };

    MockConsole.prototype.log = function () {
      var args = Array.prototype.slice.call(arguments);
      this.output.push('<div class="alert alert-info">log: ' + args.join(' ') + '</div>');
    };

    MockConsole.prototype.error = function () {
      var args = Array.prototype.slice.call(arguments);
      this.output.push('<div class="alert alert-error">error: ' + args.join(' ') + '</div>');
    };

    return MockConsole;
  }());

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
    } finally {
      evaled = evaled || '';
    }
    window.console = _console;
    var cOut = mockConsole.output.map(function (output) {
      return output;
    });
    if (evaled) {
      cOut.push('<div class="well">&gt;&gt; ' + evaled + '</div>');
    }
    return cOut.join('');
  };

  var handlers = {
    'default': function (value) {
      output.innerHTML = "<pre><code>" + value + "<\/code><\/pre>";
    },
    
    'javascript': function (value) {
      var result = runJavaScript(value);
      if (result) {
        output.innerHTML = "<pre><code>" + result + "<\/code><\/pre>";
      } else {
        output.innerHTML = "";
      }
    }
  };

  var getHandler = function (editor) {
    var id = editor.getSession().getMode().$id;
    var mode = id.split('/').pop();
    return handlers[mode] || handlers['default'];
  };

  window.onload = function () {
    var output = document.getElementById('output');
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
