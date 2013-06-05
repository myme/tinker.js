define([
  'elvis'
], function (
  el
) {

  var css = el.css;

  var OutputView = function (outputEl) {
    this.el = outputEl;
  };

  OutputView.prototype.render = function () {
    var frame;
    el(this.el, frame = this._frame = el('iframe'));
    setTimeout(function () {
      el(frame.contentDocument.head, [
        el('link(rel="stylesheet",href="/css/bootstrap.css")'),
        el('link(rel="stylesheet",href="/css/font-awesome.min.css")'),
        el('style', css({ 'body': { 'padding': '10px' }}))
      ]);
    }, 0);
    return this;
  };

  OutputView.prototype.setOutput = function (output) {
    el(this._frame.contentDocument.body, output);
  };

  return OutputView;

});
