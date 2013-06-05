define([
  'elvis',
  'ace/keyboard/vim',
  'tinker/utils',
  'tinker/editor',
  'tinker/views/list-select',
  'tinker/js-runner',
  'tinker/controllers/log',
  'tinker/controllers/modal',
  'tinker/controllers/mode',
  'tinker/controllers/theme',
  'tinker/views/output'
], function (
  el,
  VimKeybingings,
  utils,
  Editor,
  ListSelectView,
  JSRunner,
  LogController,
  ModalController,
  ModeController,
  ThemeController,
  OutputView
) {

  var Tinker = function (options) {
    this.options = options || {};

    this.editor = new Editor({
      selector: 'editor-container',
      keyboardHandler: VimKeybingings.handler
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
    var runner = new JSRunner({
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

  Tinker.addExtension('default', function (value) {
    this.setOutput(value);
  });

  return Tinker;

});
