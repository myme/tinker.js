define([
  'elvis',
  'tinker/views/frame'
], function (el, Frame) {

  'use strict';

  return Frame.extend({

    initialize: function (options) {
      Frame.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, 'change:buffer', this.bufferChanged);
      this.once('load', this.bufferChanged, this);
      options.libs.map(function (lib) {
        var path = [ '', this.model.id, lib ].join('/');
        this.loadScripts(path);
      }, this);
    },

    bufferChanged: function () {
      var javascript = this.model.get('buffer');
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
