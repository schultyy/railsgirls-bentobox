$(function(){
  var Keyword = Backbone.Model.extend({});

  var KeywordCollection = Backbone.Collection.extend({
    model: Keyword
  });

  var KeywordView = Backbone.View.extend({
    tagName: 'div',
    render: function(){
      var el = $(this.el);
      el.append(this.model.get('name'));
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
        el.append(childView.el);
      });
      return this;
    }
  });

  var keywords = new KeywordCollection();
  var sidebar = new SidebarView({collection: keywords}).render();

});
