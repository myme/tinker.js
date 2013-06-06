define([
  'elvis',
  'tinker/utils'
], function (
  el,
  utils
) {

  'use strict';

  var ListSelectView = function (element, controller) {
    this.element = element;
    this.controller = controller;
    this.keyMap = [];
    element.onclick = utils.clickHandler(this.click, this);
    controller.onchange(this.render.bind(this));
  };

  ListSelectView.prototype.click = function (e) {
    var map = this.keyMap;
    var i, l;
    for (i = 0, l = map.length; i < l; i++) {
      if (e.target === map[i][1]) {
        this.controller.set(map[i][0]);
        break;
      }
    }
  };

  ListSelectView.prototype.render = function () {
    var keys = this.controller.getKeys();
    var active = this.controller.getActive();
    this.keyMap = keys.map(function (key) {
      var activeClass = key === active ? '.active' : '';
      return [
        key,
        el('button.btn' + activeClass, utils.capitalize(key))
      ];
    });
    el(this.element, el('.btn-group', this.keyMap.map(utils.at(1))));
    return this;
  };

  return ListSelectView;

});
