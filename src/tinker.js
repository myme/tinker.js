window.Tinker = window.Tinker || {};
window.Tinker = (function (el, css, utils) {

  'use strict';

  // Output view

  var OutputView = (function () {
    var OutputView = function (outputEl) {
      this.el = outputEl;
    };

    OutputView.prototype.render = function () {
      var frame;
      el(this.el, frame = this._frame = el('iframe'));
      setTimeout(function () {
        el(frame.contentDocument.head, [
          el('link(rel="stylesheet",href="/css/bootstrap.css")'),
          el('link(rel="stylesheet",href="/css/font-awesome.min.css")'),
          el('style', css({ 'body': { 'padding': '10px' }}))
        ]);
      }, 0);
      return this;
    };

    OutputView.prototype.setOutput = function (output) {
      el(this._frame.contentDocument.body, output);
    };

    return OutputView;
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

    ThemeController.prototype.getActive = function () {
      return this.activeTheme;
    };

    ThemeController.prototype.getKeys = function () {
      return utils.getOwnKeys(this.themes);
    };

    ThemeController.prototype.onchange = function (callback) {
      this.changeListener = callback;
    };

    ThemeController.prototype.add = function (name, theme) {
      this.themes[name] = theme;
      return this;
    };

    ThemeController.prototype.set = function (name) {
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


  // Mode controller

  var ModeController = (function () {
    var ModeController = function (extensions, editor) {
      this.extensions = extensions;
      this.editor = editor;
    };

    ModeController.prototype.getActive = function () {
      return this.editor.getMode();
    };

    ModeController.prototype.getKeys = function () {
      return utils.getOwnKeys(this.extensions);
    };

    ModeController.prototype.onchange = function (callback) {
      this.changeListener = callback;
    };

    ModeController.prototype.set = function (mode) {
      this.editor.setMode(mode);
      if (this.changeListener instanceof Function) {
        this.changeListener();
      }
      return this;
    };

    return ModeController;
  }());


  // List select view

  var ListSelectView = (function () {
    var ListSelectView = function (element, controller) {
      this.element = element;
      this.controller = controller;
      this.keyMap = [];
      element.onclick = utils.clickHandler(this.click, this);
      controller.onchange(this.render.bind(this));
    };

    ListSelectView.prototype.click = function (e) {
      var map = this.keyMap;
      var i, l;
      for (i = 0, l = map.length; i < l; i++) {
        if (e.target === map[i][1]) {
          this.controller.set(map[i][0]);
          break;
        }
      }
    };

    ListSelectView.prototype.render = function () {
      var keys = this.controller.getKeys();
      var active = this.controller.getActive();
      this.keyMap = keys.map(function (key) {
        var activeClass = key === active ? '.active' : '';
        return [
          key,
          el('button.btn' + activeClass, utils.capitalize(key))
        ];
      });
      el(this.element, el('.btn-group', this.keyMap.map(utils.at(1))));
      return this;
    };

    return ListSelectView;
  }());


  // Editor

  var Editor = (function () {
    var Editor = function (options) {
      this.options = options || {};
      this._mode = 'default';
    };

    Editor.prototype.getValue = function () {
      return this.editor.session.getValue();
    };

    Editor.prototype.setValue = function (value) {
      return this.editor.session.setValue(value);
    };

    Editor.prototype.getMode = function () {
      return this._mode;
    };

    Editor.prototype.setMode = function (mode) {
      this._mode = !mode ? 'default' : mode;
      if (!mode || mode === 'default') {
        mode = null;
      } else {
        mode = 'ace/mode/' + mode;
      }
      if (this.hasStarted) {
        this.editor.getSession().setMode(mode);
      } else {
        this.options.mode = mode;
      }
      if (this._callback instanceof Function) {
        this._callback();
      }
    };

    Editor.prototype.setTheme = function (theme) {
      this.editor.setTheme(theme);
    };

    Editor.prototype.start = function () {
      var options = this.options;
      var editor = this.editor = ace.edit(options.selector);
      this.hasStarted = true;

      ['keyboardHandler'].forEach(function (each) {
        var option = options[each];
        if (option) {
          var fn = 'set' + each.substr(0, 1).toUpperCase() + each.substr(1);
          editor[fn](option);
        }
      });

      this.setMode(this.options.mode);

      return this;
    };

    Editor.prototype.onchange = function (callback) {
      this._callback = callback;
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
        keyboardHandler: require('ace/keyboard/vim').handler
      });

      this.modeController = new ModeController(this.extensions, this.editor);

      this.themeController = new ThemeController(document.head, this.editor)
        .add('default', {
          editor: null,
          css: 'default'
        })
        .add('idle fingers', {
          editor: 'ace/theme/idle_fingers',
          css: 'idle-fingers'
        })
        .add('twilight', {
          editor: 'ace/theme/twilight',
          css: 'twilight'
        });
    };

    Tinker.prototype.extensions = {};

    Tinker.prototype.log = function () {
      this.logController.setLogs.apply(this.logController, arguments);
    };

    Tinker.prototype.start = function () {
      this.render();

      this.logController = new LogController({
        summaryEl: this.logSummaryEl,
        outputEl: this.logOutputEl
      });

      var help = new ModalController(this.helpEl);
      this.helpBtnEl.onclick = utils.clickHandler(help.show, help);

      var settings = new ModalController(this.settingsEl);
      this.settingsBtnEl.onclick = utils.clickHandler(settings.show, settings);

      var extensions = this.extensions;
      var editor = this.editor
        .start()
        .onchange(function (e) {
          var mode = editor.getMode();
          var extension = (mode && extensions[mode]) || extensions['default'];
          extension.call(this, editor.getValue());
        }.bind(this));

      this.modeController.set(this.options.mode || 'default');
      this.themeController.set(this.options.theme || 'default');
    };

    Tinker.prototype.render = function () {
      this.outputView = new OutputView(el('#output.panel'));

      el(document.body, [
        el('#editor.panel', el('#editor-container')),
        this.outputView.render().el,
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

          el('h3', 'Editor mode'),
          new ListSelectView(el('p'), this.modeController).render().element,

          el('h3', 'Theme settings'),
          new ListSelectView(el('p'), this.themeController).render().element,

          el('h3', 'Global settings'),
          el('p', 'This is the stuff in your ~/.tinker file.'),

          el('h3', 'Local settings'),
          el('p', 'This is the stuff in your $PWD/.tinker file.')
        ]))
      ]);
      return this;
    };

    Tinker.prototype.runJS = function (javascript) {
      var runner = new Tinker.JSRunner({
        'window': this.outputView._frame.contentWindow
      });
      return runner.run(javascript);
    };

    Tinker.prototype.output = function (output) {
      this.outputView.setOutput(output);
    };

    Tinker.addExtension = function (name, extension) {
      Tinker.prototype.extensions[name] = extension;
    };

    Tinker.addExtension('default', {
      handler: function (value) {
        this.outputView.setOutput(value);
      }
    });

    return Tinker;
  }());

}(window.el, window.el.css, window.Tinker.utils));
