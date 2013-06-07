define([
  'elvis',
  'markdown',
  'tinker/tinker'
], function (el, md, Tinker) {

  'use strict';

  return function (markdown) {
    var compiled;
    try {
      compiled = md.toHTML(markdown);
    } catch (e) {
      compiled = '';
    }
    this.outputView.setOutput(el('.markdown', { html: compiled }));
  };

});
