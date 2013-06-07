define([
  'elvis',
  'ace/keyboard/vim',
  'tinker/utils',
  'tinker/editor',
  'tinker/views/button-list',
  'tinker/views/list-select-old',
  'tinker/js-runner',
  'tinker/controllers/log',
  'tinker/controllers/modal',
  'tinker/controllers/mode',
  'tinker/controllers/theme',
  'tinker/models/tinker',
  'tinker/views/output'
], function (
  el,
  VimKeybingings,
  utils,
  Editor,
  ButtonListView,
  ListSelectViewOld,
  JSRunner,
  LogController,
  ModalController,
  ModeController,
  ThemeController,
  TinkerModel,
  OutputView
) {

  var Tinker = function (options) {
    this.options = options || {};

    this.editor = new Editor({
      selector: 'editor-container',
      keyboardHandler: VimKeybingings.handler
    });

    this.model = new TinkerModel()
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

    this.themeController = new ThemeController({
      editor: this.editor,
      head: document.head,
      model: this.model
    });

    this.modeController = new ModeController(this.extensions, this.editor);
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
    this.model.setTheme(this.options.theme || 'default');
  };

  Tinker.prototype.render = function () {
    this.outputView = new OutputView(el('#output.panel'));

    var themeList = new ButtonListView({
      collection: this.model.get('themes')
    }).on('click', this.model.setTheme, this.model);

    el(document.body, [
      el('#editor.panel', el('#editor-container')),
      this.outputView.render().el,
      this.logOutputEl  = el('#log-output'),
      this.logSummaryEl = el('button#log-summary.btn-link'),

      el('#buttons', [
        this.helpBtnEl     = el('button#help-button.btn-link', el('i.icon-question-sign.icon-2x')),
        this.settingsBtnEl = el('button#settings-button.btn-link', el('i.icon-cogs.icon-2x')),
        this.modeLabel     = el('span', utils.capitalize(this.modeController.getActive()))
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
        new ListSelectViewOld(el('p'), this.modeController).render().element,

        el('h3', 'Theme settings'),
        themeList.render().el,

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
    this.output(value);
  });

  return Tinker;

});
