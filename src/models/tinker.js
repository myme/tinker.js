define([
  'backbone'
], function (Backbone) {

  'use strict';

  var List = Backbone.Collection.extend({

    model: Backbone.Model

  });

  return Backbone.Model.extend({

    initialize: function () {
      this.set('buffer', '');
      this.set('modes', new List());
      this.set('themes', new List());
      this.on('change:mode', this.modeChanged, this);
      this.on('change:theme', this.themeChanged, this);
    },

    modeChanged: function () {
      var mode = this.get('mode');
      this.get('modes').each(function (m) {
        m.set('isActive', m === mode);
      });
    },

    themeChanged: function () {
      var theme = this.get('theme');
      this.get('themes').each(function (t) {
        t.set('isActive', t === theme);
      });
    }

  });

});
