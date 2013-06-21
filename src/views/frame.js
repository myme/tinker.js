define([
  'jquery',
  'elvis',
  'backbone',
  'tinker/js-runner'
], function ($, el, Backbone, JSRunner) {

  var css = el.css;

  var mkasync = function (callback) {
    return function () {
      if (!this.isLoaded) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this);
        var fn = callback.bind.apply(callback, args);
        this.once('load', fn);
      } else {
        callback.apply(this, arguments);
      }
      return this;
    };
  };

  return Backbone.View.extend({

    tagName: 'iframe',

    initialize: function () {
      $(this.el).load(function () {
        this.isLoaded = true;
        this.trigger('load');
      }.bind(this));
    },

    body: mkasync(function (body) {
      el(this.el.contentDocument.body, body);
    }),

    loadCss: mkasync(function (css) {
      var head = this.el.contentDocument.head;
      head.appendChild(el('style', css));
    }),

    loadStylesheets: mkasync(function (src) {
      if (!(src instanceof Array)) {
        src = [ src ];
      }
      var head = this.el.contentDocument.head;
      for (var i = 0, l = src.length; i < l; i++) {
        head.appendChild(el('link(rel="stylesheet")', {
          href: src[i]
        }));
      }
    }),

    loadScript: mkasync(function (src) {
      var head = this.el.contentDocument.head;
      head.appendChild(el('script', { src: src }));
    }),

    render: function () {
      this.once('load', function () {
        el(this.el, {
          style: css({
            width: '100%',
            height: '100%',
            border: 'none'
          })
        });
        this.loadStylesheets([
          '/css/bootstrap.css',
          '/css/font-awesome.min.css'
        ]);
        this.loadCss(css({ 'body': { 'padding': '10px' }}));
      }, this);
      return this;
    },

    runJS: function (javascript) {
      return new JSRunner({
        window: this.el.contentWindow
      }).run(javascript);
    }

  });

});
