(function (Tinker) {

  'use strict';

  Tinker.addHandler('coffee', function (coffee) {
    var compiled;
    try {
      compiled = CoffeeScript.compile(coffee);
    } catch (e) {
      compiled = '';
    }
    this.outputView.setOutput(compiled);
  });

}(window.Tinker));
