define([
  'backbone'
], function (Backbone) {

  'use strict';

  var List = Backbone.Collection.extend({

    model: Backbone.Model

  });

  return Backbone.Model.extend({

    initialize: function () {
      this.set('modes', new List());
      this.set('themes', new List());
    },

    addMode: function (name, handler) {
      this.get('modes').add({
        id: name,
        handler: handler
      });
      return this;
    },

    setMode: function (mode) {
      if (typeof mode === 'string') {
        mode = this.get('modes').get(mode);
      }
      this.set('mode', mode);
      return this;
    },

    addTheme: function (name, theme) {
      this.get('themes').add({
        id: name,
        css: theme.css,
        editor: theme.editor
      });
      return this;
    },

    setTheme: function (theme) {
      if (typeof theme === 'string') {
        theme = this.get('themes').get(theme);
      }
      this.set('theme', theme);
      return this;
    }

  });

});
