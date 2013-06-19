define([
  'elvis',
  'backbone',
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
  Backbone,
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

  return Backbone.View.extend({

    initialize: function () {
      this.editor = new Editor({
        selector: 'editor-container',
        keyboardHandler: VimKeybingings.handler
      });

      this.model = new TinkerModel();

      this.modeController = new ModeController({
        editor: this.editor,
        model: this.model
      });

      this.themeController = new ThemeController({
        editor: this.editor,
        head: document.head,
        model: this.model
      });

      this
        .addMode('default', function (value) {
          this.output(
            el('pre', el('code', value))
          );
        })
        .addTheme('default', {
          editor: null,
          css: 'default'
        });
    },

    addMode: function (name, handler) {
      this.model.get('modes').add({
        id: name,
        handler: handler
      });
      return this;
    },

    setMode: function (mode) {
      if (typeof mode === 'string') {
        mode = this.model.get('modes').get(mode);
      }
      this.model.set('mode', mode);
      return this;
    },

    addTheme: function (name, theme) {
      this.model.get('themes').add({
        id: name,
        css: theme.css,
        editor: theme.editor
      });
      return this;
    },

    setTheme: function (theme) {
      if (typeof theme === 'string') {
        theme = this.model.get('themes').get(theme);
      }
      this.model.set('theme', theme);
      return this;
    },

    log: function () {
      this.logController.setLogs.apply(this.logController, arguments);
    },

    start: function () {
      this.render();

      this.logController = new LogController({
        summaryEl: this.logSummaryEl,
        outputEl: this.logOutputEl
      });

      var help = new ModalController(this.helpEl);
      this.helpBtnEl.onclick = utils.clickHandler(help.show, help);

      var settings = new ModalController(this.settingsEl);
      this.settingsBtnEl.onclick = utils.clickHandler(settings.show, settings);

      var editor = this.editor
        .start()
        .onchange(function (e) {
          var handler = this.model.get('mode').get('handler');
          handler.call(this, editor.getValue());
        }.bind(this));

      this.setMode(this.options.mode || 'default');
      this.setTheme(this.options.theme || 'default');
    },

    render: function () {
      var modeLabel;
      this.outputView = new OutputView(el('#output.panel'));

      var modeList = new ButtonListView({
        collection: this.model.get('modes')
      }).on('click', this.setMode, this);

      var themeList = new ButtonListView({
        collection: this.model.get('themes')
      }).on('click', this.setTheme, this);

      el(this.el, [
        el('#editor.panel', el('#editor-container')),
        this.outputView.render().el,
        this.logOutputEl  = el('#log-output'),
        this.logSummaryEl = el('button#log-summary.btn-link'),

        el('#buttons', [
          this.helpBtnEl     = el('button#help-button.btn-link', el('i.icon-question-sign.icon-2x')),
          this.settingsBtnEl = el('button#settings-button.btn-link', el('i.icon-cogs.icon-2x')),
          modeLabel          = el('span')
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
          modeList.render().el,

          el('h3', 'Theme settings'),
          themeList.render().el,

          el('h3', 'Global settings'),
          el('p', 'This is the stuff in your ~/.tinker file.'),

          el('h3', 'Local settings'),
          el('p', 'This is the stuff in your $PWD/.tinker file.')
        ]))
      ]);

      this.listenTo(this.model, 'change:mode', function (model) {
        var mode = model.get('mode').id;
        var text = utils.capitalize(mode);
        el(modeLabel, text);
      });

      return this;
    },

    runJS: function (javascript) {
      var runner = new JSRunner({
        'window': this.outputView._frame.contentWindow
      });
      return runner.run(javascript);
    },

    output: function (output) {
      this.outputView.setOutput(output);
    }

  });

});
