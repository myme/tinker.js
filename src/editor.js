define([
  'elvis',
  'ace/ace',
  'backbone'
], function (el, Ace, Backbone) {

  'use strict';

  var Tab = Backbone.View.extend({

    tagName: 'li',

    events: {
      'click a': function (e) {
        e.preventDefault();
        this.trigger('click', this);
      }
    },

    render: function () {
      var name = this.model.get('name');
      el(this.el, el('a(href="#")', name));
      return this;
    }

  });

  var TabBar = Backbone.View.extend({

    tagName: 'ul',

    className: 'nav nav-tabs',

    initialize: function () {
      var events = 'change:activeBuffer change:buffers';
      this.listenTo(this.model, events, this.render);
    },

    render: function () {
      console.log('render');
      var active = this.model.get('activeBuffer');
      var buffers = this.model.get('buffers');
      el(this.el, buffers.map(function (each) {
        var view = new Tab({
          className: active === each ? 'active' : '',
          model: each
        }).on('click', this.tabClicked, this);
        return view.render().el;
      }, this));
      return this;
    },

    tabClicked: function (tab) {
      this.model.set({ activeBuffer: tab.model });
    }

  });

  return Backbone.View.extend({

    initialize: function () {
      this._mode = 'default';
    },

    getValue: function () {
      return this.editor.session.getValue();
    },

    setValue: function (value) {
      return this.editor.session.setValue(value);
    },

    getMode: function () {
      return this._mode;
    },

    setMode: function (mode) {
      this._mode = !mode ? 'default' : mode;
      if (!mode || mode === 'default') {
        mode = null;
      } else {
        mode = 'ace/mode/' + mode;
      }
      if (this.hasStarted) {
        this.editor.getSession().setMode(mode);
      } else {
        this.options.mode = mode;
      }
      if (this._callback instanceof Function) {
        this._callback();
      }
    },

    setTheme: function (theme) {
      this.editor.setTheme(theme);
    },

    render: function () {
      var container;

      el(this.el, [
        new TabBar({ model: this.model }).render().el,
        container = el('.editor-container')
      ]);

      var ctx = this;
      var options = this.options;
      var editor = this.editor = Ace.edit(container);
      this.hasStarted = true;

      editor.getSession().on('change', function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('change');
        ctx.trigger.apply(ctx, args);
      });

      ['keyboardHandler'].forEach(function (each) {
        var option = options[each];
        if (option) {
          var fn = 'set' + each.substr(0, 1).toUpperCase() + each.substr(1);
          editor[fn](option);
        }
      });

      this.setMode(this.options.mode);

      return this;
    },

  });

});
