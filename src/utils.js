window.Tinker = window.Tinker || {};
window.Tinker.utils = (function () {

  'use strict';

  return {
    hideEl: function (element) {
      element.style.display = 'none';
    },

    showEl: function (element) {
      element.style.display = 'block';
    },

    clickHandler: function (callback, context) {
      return function (e) {
        e.preventDefault();
        callback.call(context || null, e);
      };
    },

    addClass: function (el, className) {
      var classes = el.className.split(/\s+/).filter(function (e) {
        return e !== className;
      });
      classes.push(className);
      el.className = classes.join(' ');
    },

    removeClass: function (el, className) {
      var classes = el.className.split(/\s+/).filter(function (e) {
        return e !== className;
      });
      el.className = classes.join(' ');
    },

    getOwnKeys: function (obj) {
      var keys = [];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
      return keys;
    },

    capitalize: function (string) {
      return string.substr(0, 1).toLocaleUpperCase() + string.substr(1);
    }
  };

}());
