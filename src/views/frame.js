define([
  'jquery',
  'elvis',
  'backbone',
  'tinker/js-runner'
], function ($, el, Backbone, JSRunner) {

  var css = el.css;

  return Backbone.View.extend({

    tagName: 'iframe',

    initialize: function () {
      $(this.el).load(function () {
        this.isLoaded = true;
        this.trigger('load');
      }.bind(this));
    },

    body: function (body) {
      if (!this.isLoaded) {
        this._body = body;
      } else {
        el(this.el.contentDocument.body, body);
      }
      return this;
    },

    render: function () {
      this.once('load', function () {
        el(this.el, {
          style: css({
            width: '100%',
            height: '100%',
            border: 'none'
          })
        });
        el(this.el.contentDocument.head, [
          el('link(rel="stylesheet",href="/css/bootstrap.css")'),
          el('link(rel="stylesheet",href="/css/font-awesome.min.css")'),
          el('style', css({ 'body': { 'padding': '10px' }}))
        ]);
        this.body(this._body);
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
