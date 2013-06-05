define([
  'tinker/utils'
], function (
  utils
) {

  var ThemeController = function (headEl, editor) {
    this.headEl = headEl;
    this.editor = editor;
    this.themes = {};
  };

  ThemeController.prototype.getActive = function () {
    return this.activeTheme;
  };

  ThemeController.prototype.getKeys = function () {
    return utils.getOwnKeys(this.themes);
  };

  ThemeController.prototype.onchange = function (callback) {
    this.changeListener = callback;
  };

  ThemeController.prototype.add = function (name, theme) {
    this.themes[name] = theme;
    return this;
  };

  ThemeController.prototype.set = function (name) {
    var theme = this.themes[name];
    if (!theme) {
      return this;
    }
    this.loadStyles('/src/themes/' + theme.css + '.less');
    this.editor.setTheme(theme.editor);
    this.activeTheme = name;
    if (this.changeListener instanceof Function) {
      this.changeListener();
    }
    return this;
  };

  ThemeController.prototype.loadStyles = function (src) {
    var head = this.headEl;
    var oldStyle = this.styleEl;
    var styleEl = document.createElement('link');

    styleEl.rel = 'stylesheet';
    styleEl.href = src;

    if (oldStyle) {
      head.insertBefore(styleEl, oldStyle);
      head.removeChild(oldStyle);
    } else {
      head.appendChild(styleEl);
    }

    this.styleEl = styleEl;
  };

  return ThemeController;

});
