(function (el, Tinker) {

  'use strict';

  Tinker.addExtension('coffee',  function (coffee) {
    var output = [];
    var compiled;

    try {
      compiled = CoffeeScript.compile(coffee, { bare: true });
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

    this.output(el('.coffee', [
      el('h3', 'Result'),
      el('.coffee-exec', value),
      el('h4', 'Compiled'),
      el('.coffee-compiled', el('pre', el('code', compiled)))
    ]));

    this.log(result.logs);
  });

}(window.el, window.Tinker));
