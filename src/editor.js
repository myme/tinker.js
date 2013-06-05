define([
  'ace/ace'
], function (Ace) {

  'use strict';

  var Editor = function (options) {
    this.options = options || {};
    this._mode = 'default';
  };

  Editor.prototype.getValue = function () {
    return this.editor.session.getValue();
  };

  Editor.prototype.setValue = function (value) {
    return this.editor.session.setValue(value);
  };

  Editor.prototype.getMode = function () {
    return this._mode;
  };

  Editor.prototype.setMode = function (mode) {
    this._mode = !mode ? 'default' : mode;
    if (!mode || mode === 'default') {
      mode = null;
    } else {
      mode = 'ace/mode/' + mode;
    }
    if (this.hasStarted) {
      this.editor.getSession().setMode(mode);
    } else {
      this.options.mode = mode;
    }
    if (this._callback instanceof Function) {
      this._callback();
    }
  };

  Editor.prototype.setTheme = function (theme) {
    this.editor.setTheme(theme);
  };

  Editor.prototype.start = function () {
    var options = this.options;
    var editor = this.editor = Ace.edit(options.selector);
    this.hasStarted = true;

    ['keyboardHandler'].forEach(function (each) {
      var option = options[each];
      if (option) {
        var fn = 'set' + each.substr(0, 1).toUpperCase() + each.substr(1);
        editor[fn](option);
      }
    });

    this.setMode(this.options.mode);

    return this;
  };

  Editor.prototype.onchange = function (callback) {
    this._callback = callback;
    this.editor.getSession().on('change', callback);
    return this;
  };

  return Editor;

});
