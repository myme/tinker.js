window.Tinker = window.Tinker || {};
window.Tinker = (function (el, utils, JSRunner) {

  'use strict';

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
      this.summaryEl.onclick = utils.clickHandler(this.showLogs, this);
      this.outputEl.onclick  = utils.clickHandler(this.hideLogs, this);
      this.hideLogs();
      this.setLogs([]);
    };

    LogController.prototype.hideAll = function () {
      utils.hideEl(this.summaryEl);
      utils.hideEl(this.outputEl);
    };

    LogController.prototype.showLogs = function () {
      utils.hideEl(this.summaryEl);
      utils.showEl(this.outputEl);
      this.shouldShowLogs = true;
    };

    LogController.prototype.hideLogs = function () {
      utils.hideEl(this.outputEl);
      utils.showEl(this.summaryEl);
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


  // Modal controller

  var ModalController = (function () {
    var ModalController = function (modalEl) {
      this.modalEl = modalEl;
      modalEl.onclick = utils.clickHandler(function (e) {
        if (e.target === this.modalEl) {
          this.hide();
        }
      }, this);
    };

    ModalController.prototype.hide = function () {
      utils.addClass(this.modalEl, 'hide');
    };

    ModalController.prototype.show = function () {
      utils.removeClass(this.modalEl, 'hide');
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

    ThemeController.prototype.onchange = function (callback) {
      this.changeListener = callback;
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
      this.loadStyles('/src/themes/' + theme.css + '.less');
      this.editor.setTheme(theme.editor);
      this.activeTheme = name;
      if (this.changeListener instanceof Function) {
        this.changeListener();
      }
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


  // Theme selector view

  var ThemeSelectorView = (function () {
    var ThemeSelectorView = function (element, themeController) {
      this.element = element;
      this.themeController = themeController;
      element.onclick = utils.clickHandler(this.click, this);
      themeController.onchange(this.render.bind(this));
    };

    ThemeSelectorView.prototype.click = function (e) {
      if (e.target.tagName.toLowerCase() === 'button') {
        var name = e.target.textContent.toLowerCase();
        this.themeController.setTheme(name);
      }
    };

    ThemeSelectorView.prototype.render = function () {
      var active = this.themeController.activeTheme;
      var themes = utils.getOwnKeys(this.themeController.themes);
      el(this.element, el('.btn-group', themes.map(function (name) {
        var activeClass = name === active ? '.active' : '';
        return el('button.btn' + activeClass, utils.capitalize(name));
      })));
      return this;
    };

    return ThemeSelectorView;
  }());


  // Editor

  var Editor = (function () {
    var Editor = function (options) {
      this.options = options || {};
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

    Editor.prototype.start = function () {
      var options = this.options;
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

      return this;
    };

    Editor.prototype.onchange = function (callback) {
      this.editor.getSession().on('change', callback);
      return this;
    };

    return Editor;
  }());


  // Tinker

  return (function () {
    var Tinker = function (options) {
      this.options = options || {};

      this.editor = new Editor({
        selector: 'editor-container',
        keyboardHandler: require('ace/keyboard/vim').handler,
        mode: 'ace/mode/javascript'
      });

      this.themeController = new ThemeController(document.head, this.editor)
        .addTheme('default', {
          editor: null,
          css: 'default'
        })
        .addTheme('idle fingers', {
          editor: 'ace/theme/idle_fingers',
          css: 'idle-fingers'
        })
        .addTheme('twilight', {
          editor: 'ace/theme/twilight',
          css: 'twilight'
        });
    };

    Tinker.prototype.handlers = {
      'default': function (value) {
        this.outputController.setOutput(value);
      },

      'javascript': function (javascript) {
        var frame = document.createElement('iframe');
        var result = new JSRunner({
          'window': frame.contentWindow
        }).run(javascript);
        var value = result.value;

        if (javascript.trim()) {
          this.outputController.setOutput(JSON.stringify(value, 0, 2));
        } else {
          this.outputController.setOutput(null);
        }
        this.logController.setLogs(result.logs);
      }
    };

    Tinker.prototype.start = function () {
      this.render();

      this.outputController = new OutputController(this.outputEl);

      this.logController = new LogController({
        summaryEl: this.logSummaryEl,
        outputEl: this.logOutputEl
      });

      var help = new ModalController(this.helpEl);
      this.helpBtnEl.onclick = utils.clickHandler(help.show, help);

      var settings = new ModalController(this.settingsEl);
      this.settingsBtnEl.onclick = utils.clickHandler(settings.show, settings);

      var handlers = this.handlers;
      var editor = this.editor
        .start()
        .onchange(function (e) {
          var mode = editor.getMode();
          var handler = (mode && handlers[mode]) || handlers['default'];
          handler.call(this, editor.getValue());
        }.bind(this));

      this.themeController.setTheme(this.options.theme || 'default');
    };

    Tinker.prototype.render = function () {
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
          new ThemeSelectorView(el('p'), this.themeController).render().element,

          el('h3', 'Global settings'),
          el('p', 'This is the stuff in your ~/.tinker file.'),

          el('h3', 'Local settings'),
          el('p', 'This is the stuff in your $PWD/.tinker file.')
        ]))
      ]);
      return this;
    };

    return Tinker;
  }());

}(window.el, window.Tinker.utils, window.Tinker.JSRunner));
