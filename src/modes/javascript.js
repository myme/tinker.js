define([
  'elvis',
  'tinker/views/frame'
], function (el, Frame) {

  'use strict';

  return Frame.extend({

    initialize: function (options) {
      var libs = options.libs || [];
      Frame.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, 'change:buffer', this.bufferChanged);
      this.once('load', this.bufferChanged, this);
      libs.map(function (lib) {
        var path = [ '', this.model.id, lib ].join('/');
        this.loadScripts(path);
      }, this);
    },

    bufferChanged: function () {
      var javascript = this.model.get('buffer');
      var output = this.runJS(javascript);
      this.updateOutput(output);
    },

    updateOutput: function (output) {
      var value = output.value;

      if (value && value.nodeType === 1) {
        this.body(value);
      } else {
        try {
          value = JSON.stringify(value, 0, 2);
        } catch (e) {
          value = null;
        }
        this.body(el('pre', el('code', value || '')));
      }
    }

  });

});
