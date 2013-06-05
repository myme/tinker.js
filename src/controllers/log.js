define([
  'tinker/utils'
], function (
  utils
) {

  var LogController = function (options) {
    this.summaryEl = options.summaryEl;
    this.outputEl  = options.outputEl;
    this.summaryEl.onclick = utils.clickHandler(this.showLogs, this);
    this.outputEl.onclick  = utils.clickHandler(this.hideLogs, this);
    this.hideLogs();
    this.setLogs([]);
  };

  LogController.prototype.hideAll = function () {
    utils.hideEl(this.summaryEl);
    utils.hideEl(this.outputEl);
  };

  LogController.prototype.showLogs = function () {
    utils.hideEl(this.summaryEl);
    utils.showEl(this.outputEl);
    this.shouldShowLogs = true;
  };

  LogController.prototype.hideLogs = function () {
    utils.hideEl(this.outputEl);
    utils.showEl(this.summaryEl);
    this.shouldShowLogs = false;
  };

  LogController.prototype.setLogs = function (logs) {
    var length = logs.length;

    if (length) {
      this.summaryEl.innerHTML = '<i class="icon-plus-sign"></i> ' +
        length +
        ' log ' +
        (length === 1 ? 'message' : 'messages');
      this.setOutput(logs);
      if (this.shouldShowLogs) {
        this.showLogs();
      } else {
        this.hideLogs();
      }
    } else {
      this.summaryEl.innerHTML = '';
      this.setOutput([]);
      this.hideAll();
    }
  };

  LogController.prototype.setOutput = function (logs) {
    var severityMap = {
      'log': 'info',
      'error': 'error'
    };

    var formatted = logs.map(function (each) {
      return '<div class="alert alert-' +
        severityMap[each.severity] +
        '">' +
        each.message +
        '</div>';
    });

    if (formatted.length) {
      this.outputEl.innerHTML = '<pre><code>' + formatted.join('') + '</code></pre>';
    } else {
      this.outputEl.innerHTML = '';
    }
  };

  return LogController;

});
