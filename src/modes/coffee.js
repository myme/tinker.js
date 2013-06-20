define([
  'elvis',
  'coffee-script',
  'tinker/views/frame'
], function (el, cs, Frame) {

  'use strict';

  return Frame.extend({

    initialize: function () {
      this.listenTo(this.model, 'change:buffer', this.bufferChanged);
    },

    bufferChanged: function () {
      var coffee = this.model.get('buffer');
      var output = [];
      var compiled;

      try {
        compiled = cs.compile(coffee, { bare: true });
      } catch (e) {
        compiled = '';
      }

      var result = this.runJS(compiled);
      var value = result.value;
      var exec;

      if (!value || value.nodeType !== 1) {
        try {
          value = JSON.stringify(value, 0, 2);
        } catch (e) {}
        value = el('pre', el('code', value || ''));
      }

      this.body(el('.coffee', [
        el('h3', 'Result'),
        el('.coffee-exec', value),
        el('h4', 'Compiled'),
        el('.coffee-compiled', el('pre', el('code', compiled)))
      ]));

      // this.log(result.logs);
    }

  });

});
