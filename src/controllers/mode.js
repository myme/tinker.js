define([
  'tinker/utils'
], function (
  utils
) {

  var ModeController = function (options) {
    this.editor = options.editor;
    this.model = options.model;
    this.model.on('change:mode', this.set, this);
  };

  ModeController.prototype.set = function () {
    var mode = this.model.get('mode');
    this.editor.setMode(mode.id);
    return this;
  };

  return ModeController;

});
