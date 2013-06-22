requirejs.config({
  baseUrl: 'lib',
  paths: {
    tinker: '../src'
  },
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'coffee-script': {
      exports: 'CoffeeScript'
    },
    'elvis': {
      exports: 'elvis'
    },
    'jquery': {
      exports: '$'
    },
    'markdown': {
      exports: 'markdown'
    },
    'underscore': {
      exports: '_'
    }
  }
});

(function () {

  'use strict';

  var modes = [];
  for (var i in TinkerConfig.modes) {
    if (TinkerConfig.modes.hasOwnProperty(i)) {
      modes.push(i);
    }
  }

  var deps = [
    'jquery',
    'tinker/tinker'
  ].concat(modes.map(function (each) {
    return 'tinker/modes/' + each;
  }));

  require(deps, function ($, Tinker) {
    var args = Array.prototype.slice.call(arguments);
    var offset = deps.length - modes.length;

    $(function () {
      var tinker = new Tinker({
        el: document.body,
        id: TinkerConfig.id,
        mode: TinkerConfig.mode,
        theme: TinkerConfig.theme
      });

      modes.reduce(function (tinker, mode, idx) {
        var handler = args[idx + offset];
        return tinker.addMode(mode, handler);
      }, tinker);

      TinkerConfig.themes.reduce(function (tinker, theme) {
        var name = theme.name;
        delete theme.name;
        return tinker.addTheme(name, theme);
      }, tinker);

      tinker.start();
    });
  });

}());
