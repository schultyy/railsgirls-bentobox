$(function(){
  var Keyword = Backbone.Model.extend({});
  var Category = Backbone.Model.extend({});

  var KeywordCollection = Backbone.Collection.extend({
    model: Keyword
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
    dragStart: function (dataTransfer, e) {},
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
    render: function(){
      var heading = $('<p>').addClass('BentoHeader')
                            .text(this.model.get('name'));
      $(this.el).append(heading);
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
