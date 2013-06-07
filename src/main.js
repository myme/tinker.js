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

  var modes = TinkerConfig.modes;

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
      TinkerConfig.el = document.body;

      var tinker = new Tinker(TinkerConfig)
        .addTheme('idle fingers', {
          editor: 'ace/theme/idle_fingers',
          css: 'idle-fingers'
        })
        .addTheme('twilight', {
          editor: 'ace/theme/twilight',
          css: 'twilight'
        });

      modes.reduce(function (tinker, mode, idx) {
        var handler = args[idx + offset];
        return tinker.addMode(mode, handler);
      }, tinker);

      tinker.start();
    });
  });

}());
