define([
  'backbone'
], function (Backbone) {

  'use strict';

  var List = Backbone.Collection.extend({

    model: Backbone.Model

  });

  return Backbone.Model.extend({

    initialize: function () {
      this.set('themes', new List());
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
