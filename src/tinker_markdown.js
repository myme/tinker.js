(function (Tinker, md) {

  'use strict';

  Tinker.addHandler('markdown', function (markdown) {
    var compiled;
    try {
      compiled = md.toHTML(markdown);
    } catch (e) {
      compiled = '';
    }
    this.outputController.setOutput(compiled);
  });

}(window.Tinker, window.markdown));
