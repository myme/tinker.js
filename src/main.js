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

require([
  'jquery',
  'tinker/tinker',
  'tinker/extensions/coffee',
  'tinker/extensions/javascript',
  'tinker/extensions/markdown'
], function ($, Tinker) {

  'use strict';

  var config = {
    mode: 'markdown',
    theme: 'twilight'
  };

  $(function () {
    new Tinker(config).start();
  });

});
