define([
  'tinker/utils'
], function (
  utils
) {

  'use strict';

  var ModalController = function (modalEl) {
    this.modalEl = modalEl;
    modalEl.onclick = utils.clickHandler(function (e) {
      if (e.target === this.modalEl) {
        this.hide();
      }
    }, this);
  };

  ModalController.prototype.hide = function () {
    utils.addClass(this.modalEl, 'hide');
  };

  ModalController.prototype.show = function () {
    utils.removeClass(this.modalEl, 'hide');
  };

  return ModalController;

});
