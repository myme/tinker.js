define([
  'elvis',
  'tinker/tinker',
  'tinker/views/frame'
], function (el, Tinker, Frame) {

  'use strict';

  return Frame.extend({

    initialize: function () {
      this.listenTo(this.model, 'change:buffer', this.bufferChanged);
    },

    bufferChanged: function (model) {
      var javascript = model.get('buffer');
      var result = this.runJS(javascript);
      var value = result.value;

      if (value && value.nodeType === 1) {
        this.body(value);
      } else {
        var json;
        try {
          json = JSON.stringify(value, 0, 2);
        } catch (e) {}
        this.body(el('pre', el('code', json || '')));
      }

      // this.log(result.logs);
    }

  });

});
