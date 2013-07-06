define([
  'elvis',
  'ace/ace',
  'backbone'
], function (el, Ace, Backbone) {

  'use strict';

  return Backbone.View.extend({

    initialize: function () {
      this._mode = 'default';
    },

    getValue: function () {
      return this.editor.session.getValue();
    },

    setValue: function (value) {
      return this.editor.session.setValue(value);
    },

    getMode: function () {
      return this._mode;
    },

    setMode: function (mode) {
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
    },

    setTheme: function (theme) {
      this.editor.setTheme(theme);
    },

    render: function () {
      var container;

      el(this.el, [
        container = el('.editor-container')
      ]);

      var ctx = this;
      var options = this.options;
      var editor = this.editor = Ace.edit(container);
      this.hasStarted = true;

      editor.getSession().on('change', function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('change');
        ctx.trigger.apply(ctx, args);
      });

      ['keyboardHandler'].forEach(function (each) {
        var option = options[each];
        if (option) {
          var fn = 'set' + each.substr(0, 1).toUpperCase() + each.substr(1);
          editor[fn](option);
        }
      });

      this.setMode(this.options.mode);

      return this;
    },

  });

});
