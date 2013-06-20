define([
  'elvis',
  'backbone',
  'markdown',
  'tinker/views/frame'
], function (el, Backbone, md, Frame) {

  'use strict';

  var css = el.css;

  return Frame.extend({

    initialize: function () {
      this.listenTo(this.model, 'change:buffer', this.bufferChanged);
    },

    bufferChanged: function () {
      var markdown = this.model.get('buffer');
      var compiled;

      try {
        compiled = md.toHTML(markdown);
      } catch (e) {
        compiled = '';
      }

      var output = el('.markdown', { html: compiled });
      this.body(output);
    }

  });

});
