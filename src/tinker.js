/* jshint evil:true */

(function (exports, el) {

  'use strict';

  var hideEl = function (element) {
    element.style.display = 'none';
  };

  var showEl = function (element) {
    element.style.display = 'block';
  };

  var clickHandler = function (callback, context) {
    return function (e) {
      e.preventDefault();
      callback.call(context || null, e);
    };
  };

  var addClass = function (el, className) {
    var classes = el.className.split(/\s+/).filter(function (e) {
      return e !== className;
    });
    classes.push(className);
    el.className = classes.join(' ');
  };

  var removeClass = function (el, className) {
    var classes = el.className.split(/\s+/).filter(function (e) {
      return e !== className;
    });
    el.className = classes.join(' ');
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
      this.outputEl  = options.outputEl;
      this.summaryEl.onclick = clickHandler(this.showLogs, this);
      this.outputEl.onclick  = clickHandler(this.hideLogs, this);
      this.hideLogs();
      this.setLogs([]);
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


  // Modal controller

  var ModalController = (function () {
    var ModalController = function (modalEl) {
      this.modalEl = modalEl;
      modalEl.onclick = clickHandler(function (e) {
        if (e.target === this.modalEl) {
          this.hide();
        }
      }, this);
    };

    ModalController.prototype.hide = function () {
      addClass(this.modalEl, 'hide');
    };

    ModalController.prototype.show = function () {
      removeClass(this.modalEl, 'hide');
    };

    return ModalController;
  }());


  // Theme controller

  var ThemeController = (function () {
    var ThemeController = function (headEl, editor) {
      this.headEl = headEl;
      this.editor = editor;
      this.themes = {};
    };

    ThemeController.prototype.addTheme = function (name, theme) {
      this.themes[name] = theme;
      return this;
    };

    ThemeController.prototype.setTheme = function (name) {
      var theme = this.themes[name];
      if (!theme) {
        return this;
      }
      this.loadStyles('/src/' + theme.css + '.less');
      this.editor.setTheme(theme.editor);
      return this;
    };

    ThemeController.prototype.loadStyles = function (src) {
      var head = this.headEl;
      var oldStyle = this.styleEl;
      var styleEl = document.createElement('link');

      styleEl.rel = 'stylesheet';
      styleEl.href = src;

      if (oldStyle) {
        head.insertBefore(styleEl, oldStyle);
        head.removeChild(oldStyle);
      } else {
        head.appendChild(styleEl);
      }

      this.styleEl = styleEl;
    };

    return ThemeController;
  }());


  // Editor

  var Editor = (function () {
    var Editor = function (options) {
      var editor = this.editor = ace.edit(options.selector);

      ['keyboardHandler'].forEach(function (each) {
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

    Editor.prototype.setValue = function (value) {
      return this.editor.session.setValue(value);
    };

    Editor.prototype.setTheme = function (theme) {
      this.editor.setTheme(theme);
    };

    Editor.prototype.onchange = function (callback) {
      this.editor.getSession().on('change', callback);
    };

    return Editor;
  }());


  // Tinker

  exports.start = function (options) {
    options = options || {};

    this.render();

    var outputController = new OutputController(this.outputEl);

    var logController = new LogController({
      summaryEl: this.logSummaryEl,
      outputEl: this.logOutputEl
    });

    var help = new ModalController(this.helpEl);
    this.helpBtnEl.onclick = clickHandler(help.show, help);

    var settings = new ModalController(this.settingsEl);
    this.settingsBtnEl.onclick = clickHandler(settings.show, settings);

    var editor = new Editor({
      selector: 'editor-container',
      keyboardHandler: require('ace/keyboard/vim').handler,
      mode: 'ace/mode/javascript'
    });

    var theme = new ThemeController(document.head, editor)
      .addTheme('default', {
        editor: null,
        css: 'default-theme'
      })
      .addTheme('twilight', {
        editor: 'ace/theme/twilight',
        css: 'twilight-theme'
      })
      .setTheme(options.theme || 'default');

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

    editor.onchange(function (e) {
      var mode = editor.getMode();
      var handler = (mode && handlers[mode]) || handlers['default'];
      handler(editor.getValue());
    });
  };

  exports.render = function () {
    el(document.body, [
      el('#editor.panel', el('#editor-container')),
      this.outputEl     = el('#output.panel'),
      this.logOutputEl  = el('#log-output'),
      this.logSummaryEl = el('button#log-summary.btn-link'),

      el('#buttons', [
        this.helpBtnEl     = el('button#help-button.btn-link', el('i.icon-question-sign.icon-2x')),
        this.settingsBtnEl = el('button#settings-button.btn-link', el('i.icon-cogs.icon-2x'))
      ]),

      this.helpEl = el('#help.tinker-modal.hide', el('.well', [
        el('h1', 'Tinker Help'),
        el('p', "So, looking for some help, huh? Not much to see here yet I'm afraid."),
        el('p', "Close this modal by clicking outside of its bounds."),

        el('h3', 'About'),
        el('p', 'Not documented'),

        el('h3', 'Keyboard shortcuts'),
        el('p', 'Not documented'),

        el('h3', 'Settings'),
        el('p', 'Not documented')
      ])),

      this.settingsEl = el('#settings.tinker-modal.hide', el('.well', [
        el('h1', 'Tinker Settings'),
        el('p', "So, looking for some settings, huh? Not much to see here yet I'm afraid."),
        el('p', 'Close this modal by clicking outside of its bounds.'),

        el('h3', 'Theme settings'),
        el('p', el('.btn-group', [
          el('button.btn.active', 'Default'),
          el('button.btn', 'Twilight')
        ])),

        el('h3', 'Global settings'),
        el('p', 'This is the stuff in your ~/.tinker file.'),

        el('h3', 'Local settings'),
        el('p', 'This is the stuff in your $PWD/.tinker file.')
      ]))
    ]);
  };

}(window.Tinker = {}, window.el));
