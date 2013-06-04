(function (Tinker, md) {

  'use strict';

  Tinker.addHandler('markdown', function (markdown) {
    var compiled;
    try {
      compiled = md.toHTML(markdown);
    } catch (e) {
      compiled = '';
    }
    this.outputView.setOutput(el('.markdown', { html: compiled }));
  });

}(window.Tinker, window.markdown));
