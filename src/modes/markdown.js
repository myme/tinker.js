define([
  'elvis',
  'markdown',
  'tinker/views/frame'
], function (el, md, Frame) {

  'use strict';

  var first = true;
  var frame;

  return function (markdown) {
    var compiled;

    try {
      compiled = md.toHTML(markdown);
    } catch (e) {
      compiled = '';
    }

    var output = el('.markdown', { html: compiled });
    if (first) {
      frame = new Frame().render();
      first = false;
    }
    frame.body(output);
    return frame.el;
  };

});
