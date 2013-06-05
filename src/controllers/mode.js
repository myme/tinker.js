define([
  'tinker/utils'
], function (
  utils
) {

  var ModeController = function (extensions, editor) {
    this.extensions = extensions;
    this.editor = editor;
  };

  ModeController.prototype.getActive = function () {
    return this.editor.getMode();
  };

  ModeController.prototype.getKeys = function () {
    return utils.getOwnKeys(this.extensions);
  };

  ModeController.prototype.onchange = function (callback) {
    this.changeListener = callback;
  };

  ModeController.prototype.set = function (mode) {
    this.editor.setMode(mode);
    if (this.changeListener instanceof Function) {
      this.changeListener();
    }
    return this;
  };

  return ModeController;

});
