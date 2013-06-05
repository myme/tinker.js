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

  var extensions = TinkerConfig.extensions.map(function (each) {
    return 'tinker/extensions/' + each;
  });

  require([
    'jquery',
    'tinker/tinker'
  ].concat(extensions), function ($, Tinker) {
    $(function () { new Tinker(TinkerConfig).start(); });
  });

}());
