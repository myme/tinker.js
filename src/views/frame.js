define([
  'jquery',
  'elvis',
  'backbone'
], function (
  $,
  el,
  Backbone
) {

  var css = el.css;

  return Backbone.View.extend({

    tagName: 'iframe',

    body: function (body) {
      if (!this.isLoaded) {
        this._body = body;
      } else {
        el(this.el.contentDocument.body, body);
      }
      return this;
    },

    render: function () {
      $(this.el).load(function () {
        this.isLoaded = true;
        el(this.el.contentDocument.head, [
          el('link(rel="stylesheet",href="/css/bootstrap.css")'),
          el('link(rel="stylesheet",href="/css/font-awesome.min.css")'),
          el('style', css({ 'body': { 'padding': '10px' }}))
        ]);
        this.body(this._body);
      }.bind(this));
      return this;
    },

    runJS: function () {
    }

  });

});
