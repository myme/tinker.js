define([
  'elvis',
  'tinker/tinker'
], function (el, Tinker) {

  'use strict';

  return function (javascript) {
    var result = this.runJS(javascript);
    var value = result.value;

    if (value && value.nodeType === 1) {
      this.output(value);
    } else {
      var json;
      try {
        json = JSON.stringify(value, 0, 2);
      } catch (e) {}
      this.output(el('pre', el('code', json || '')));
    }

    this.log(result.logs);
  };

});
