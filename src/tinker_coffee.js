(function (Tinker) {

  'use strict';

  Tinker.addHandler('coffee', function (coffee) {
    this.outputController.setOutput(coffee);
  });

}(window.Tinker));
