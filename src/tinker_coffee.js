(function (el, Tinker) {

  'use strict';

  Tinker.addHandler('coffee', function (coffee) {
    var compiled;
    try {
      compiled = el('pre', el('code', CoffeeScript.compile(coffee)));
    } catch (e) {
      compiled = '';
    }
    this.outputView.setOutput(compiled);
  });

}(window.el, window.Tinker));
