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
      this.runJS(javascript, this.updateOutput.bind(this));
    },

    updateOutput: function (err, output, logs) {
      if (output && output.nodeType === 1) {
        this.body(output);
      } else {
        try {
          output = JSON.stringify(output, 0, 2);
        } catch (e) {
          output = null;
        }
        this.body(el('pre', el('code', output || '')));
      }
    }

  });

});
