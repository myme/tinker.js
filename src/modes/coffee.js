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
      var output = this.runJS(compiled);
      this.updateOutput(output, compiled);
    },

    compileCoffee: function (coffee) {
      try {
        return cs.compile(coffee, { bare: true });
      } catch (e) {
        return '';
      }
    },

    updateOutput: function (output, compiled) {
      var value = output.value;
      var exec;

      if (!value || value.nodeType !== 1) {
        try {
          value = JSON.stringify(value, 0, 2);
        } catch (e) {
          value = null;
        }
        value = el('pre', el('code', value || ''));
      }

      this.body(el('.coffee', [
        el('h3', 'Result'),
        el('.coffee-exec', value),
        el('h4', 'Compiled'),
        el('.coffee-compiled', el('pre', el('code', compiled)))
      ]));
    }

  });

});
