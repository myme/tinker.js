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
      $(this.el).load(function () {
        el(this.contentDocument.body, body);
      });
      return this;
    },

    render: function () {
      $(this.el).load(function () {
        el(this.contentDocument.head, [
          el('link(rel="stylesheet",href="/css/bootstrap.css")'),
          el('link(rel="stylesheet",href="/css/font-awesome.min.css")'),
          el('style', css({ 'body': { 'padding': '10px' }}))
        ]);
      });
      return this;
    },

    runJS: function () {
    }

  });

});
