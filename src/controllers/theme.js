define([
  'elvis'
], function (el) {

  'use strict';

  var ThemeController = function (options) {
    this.editor = options.editor;
    this.headEl = options.head;
    this.model = options.model;
    this.model.on('change:theme', this.set, this);
  };

  ThemeController.prototype = {

    set: function () {
      var theme = this.model.get('theme');
      var css = theme.get('css');
      this.loadStyles('/src/themes/' + css + '.less');
      this.editor.setTheme(theme.get('editor'));
      return this;
    },

    loadStyles: function (src) {
      var head = this.headEl;
      var oldStyle = this.styleEl;
      var styleEl = el('link', {
        rel: 'stylesheet',
        href: src
      });

      if (oldStyle) {
        head.insertBefore(styleEl, oldStyle);
        head.removeChild(oldStyle);
      } else {
        head.appendChild(styleEl);
      }

      this.styleEl = styleEl;
    }

  };

  return ThemeController;

});
