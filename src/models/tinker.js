define([
  'backbone'
], function (Backbone) {

  'use strict';

  var List = Backbone.Collection.extend({

    model: Backbone.Model

  });

  return Backbone.Model.extend({

    initialize: function () {
      this.set('modes', new List());
      this.set('themes', new List());
    }

  });

});
