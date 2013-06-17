define([
  'elvis',
  'backbone',
  'tinker/utils'
], function (el, Backbone, utils) {

  'use strict';

  var ButtonView = Backbone.View.extend({

    tagName: 'button',

    className: 'btn',

    events: {
      'click': function () { this.trigger('click', this.model); }
    },

    initialize: function () {
      this.listenTo(this.model, 'change:isActive', this.activeChanged);
    },

    activeChanged: function () {
      var method = this.model.get('isActive') ? 'add' : 'remove';
      this.$el[ method + 'Class' ]('active');
    },

    render: function () {
      el(this.el, utils.capitalize(this.model.id));
      this.activeChanged();
      return this;
    }

  });

  return Backbone.View.extend({

    click: function (model) {
      this.trigger('click', model);
    },

    each: function (model) {
      var view = new ButtonView({
        model: model
      });
      this.listenTo(view, 'click', this.click);
      return view.render().el;
    },

    render: function () {
      el(this.el, el('.btn-group',
        this.collection.map(this.each, this)
      ));
      return this;
    }

  });

});
