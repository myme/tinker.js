define([
  'elvis',
  'coffee-script',
  'tinker/views/frame'
], function (el, cs, Frame) {

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
      var coffee = this.model.get('buffer');
      var compiled = this.compileCoffee(coffee);
      var ctx = this;
      this.runJS(compiled, function (err, output, logs) {
        ctx.updateOutput(output, compiled);
      });
    },

    compileCoffee: function (coffee) {
      try {
        return cs.compile(coffee, { bare: true });
      } catch (e) {
        return '';
      }
    },

    updateOutput: function (output, compiled) {
      if (!output || output.nodeType !== 1) {
        try {
          output = JSON.stringify(output, 0, 2);
        } catch (e) {
          output = null;
        }
        output = el('pre', el('code', output || ''));
      }

      this.body(el('.coffee', [
        el('h3', 'Result'),
        el('.coffee-exec', output),
        el('h4', 'Compiled'),
        el('.coffee-compiled', el('pre', el('code', compiled)))
      ]));
    }

  });

});
