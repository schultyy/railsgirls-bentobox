$(function(){
  var Keyword = Backbone.Model.extend({});
  

  var KeywordCollection = Backbone.Collection.extend({
    model: Keyword
  });

  var Category = Backbone.Model.extend({
    defaults: {
      keywords: new KeywordCollection()
    }
  });

  var CategoryCollection = Backbone.Collection.extend({
    model: Category
  });

  var KeywordView = Backbone.View.extend({
    tagName: 'div',
    initialize: function(){
      $(this.el).attr("draggable", "true");
      $(this.el).bind("dragstart", _.bind(this.dragStartEvent, this));
    },
    dragStartEvent: function (e) {
      var data;
      if (e.originalEvent) e = e.originalEvent;
      e.dataTransfer.effectAllowed = "copy"; // default to copy
      data = this.dragStart(e.dataTransfer, e);
   
      window._backboneDragDropObject = null;
      if (data !== undefined) {
        window._backboneDragDropObject = data; // we cant bind an object directly because it has to be a string, json just won't do
      }
    },
    dragStart: function (dataTransfer, e) { return this.model; },
    render: function(){
      var el = $(this.el);
      var text = $('<p>').text(this.model.get('name'))
                          .addClass('keyword');
      el.append(text);
      return this;
    }
  });

  var SidebarView = Backbone.View.extend({
    el: $('#sidebar'),
    render: function(){
      var self = this;
      var el = $(this.el);

      this.collection.forEach(function(elem){
        var childView = new KeywordView({model: elem});
        el.append(childView.render().el);
      });
      return this;
    }
  });

  var BentoBoxColumn = Backbone.View.extend({
    tagName: 'div',
    className: 'col-md-2',
    initialize: function(){
      $(this.el).bind("dragover", _.bind(this.dragOverEvent, this));
      $(this.el).bind("dragenter", _.bind(this.dragEnterEvent, this));
      $(this.el).bind("dragleave", _.bind(this.dragLeaveEvent, this));
      $(this.el).bind("drop", _.bind(this.dropEvent, this));
      this._draghoverClassAdded = false;
      _.bindAll(this, "render");
      this.model.get("keywords").bind("add", this.render);
    },
    dragOverEvent: function (e) {
      if (e.originalEvent) e = e.originalEvent;
      var data = this.getCurrentDragData(e);
      
      if (this.dragOver(data, e.dataTransfer, e) !== false) {
        if (e.preventDefault) e.preventDefault();
        e.dataTransfer.dropEffect = 'copy'; // default
      }
    },
    dragEnterEvent: function (e) {
      if (e.originalEvent) e = e.originalEvent;
      if (e.preventDefault) e.preventDefault();
    },
    dragLeaveEvent: function (e) {
      if (e.originalEvent) e = e.originalEvent;
      var data = this.getCurrentDragData(e);
      this.dragLeave(data, e.dataTransfer, e);
    },
    getCurrentDragData: function (e) {
      var data = null;
      if (window._backboneDragDropObject){
        data = window._backboneDragDropObject;
      }
      return data;
    },
    dropEvent: function (e) {
      if (e.originalEvent){
        e = e.originalEvent;
      }
      var data = this.getCurrentDragData(e);
      
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting
   
      if (this._draghoverClassAdded){
        $(this.el).removeClass("draghover");
      }
   
      this.drop(data, e.dataTransfer, e);
    },
    drop: function(data, dataTransfer, e){
      var keywords = this.model.get('keywords');
      keywords.add(data);
    },
    dragOver: function (data, dataTransfer, e) { // optionally override me and set dataTransfer.dropEffect, return false if the data is not droppable
      $(this.el).addClass("draghover");
      this._draghoverClassAdded = true;
    },
    dragLeave: function (data, dataTransfer, e) { // optionally override me
      if (this._draghoverClassAdded){
        $(this.el).removeClass("draghover");
      }
    },
    render: function(){
      $(this.el).empty();
      var heading = $('<p>').addClass('BentoHeader')
                            .text(this.model.get('name'));
      $(this.el).append(heading);
      var el = $(this.el);

      this.model.get('keywords').forEach(function(model){
        var keyword = new KeywordView({model: model});

        el.append(keyword.render().el);
      });
      return this;
    }
  });

  var BentoBoxView = Backbone.View.extend({
    el: $('#bentobox'),
    render: function(){
      var el = $(this.el);
      this.collection.forEach(function(model){
        var renderedColumn = new BentoBoxColumn({model: model}).render();
        el.append(renderedColumn.el);
      });
    }
  });

  var keywords = new KeywordCollection();
  var categories = new CategoryCollection();

  var k1 = new Keyword({name: "foo"});
  var cat1 = new Category({name: "Category 1"});
  var cat2 = new Category({name: "Category 2"});

  keywords.add(k1);
  categories.add(cat1);
  categories.add(cat2);

  var sidebar = new SidebarView({collection: keywords}).render();
  var bentobox = new BentoBoxView({collection: categories}).render();
});
