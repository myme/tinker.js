define([
  'backbone'
], function (Backbone) {

  'use strict';

  var List = Backbone.Collection.extend({

    model: Backbone.Model

  });

  return Backbone.Model.extend({

    initialize: function () {
      var buffers = new List([
        { name: 'foo.js' },
        { name: 'bar.html' },
        { name: 'baz.md' }
      ]);
      this.set({
        buffer: '',
        activeBuffer: buffers.at(1),
        buffers: buffers,
        modes: new List(),
        themes: new List()
      });
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
