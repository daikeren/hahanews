Links = new Meteor.Collection("links");

if (Meteor.isClient) {

  Template.link_list.links = function () {
    return Links.find({}, {sort : {score: -1} });
  };

  Template.link_detail.events = {
    'click i.icon-arrow-up' : function () {
      Meteor.call('vote', this.title, 'thumbs_up');
    },
    'click i.icon-arrow-down' : function () {
      Meteor.call('vote', this.title, 'thumbs_down');
    }
  };

  Template.add_new_link.events = {
    'click input#add_url' : function () {
      var new_url = $('#url').val();
      var new_title = $('#title').val();
      var url_row = Links.findOne( {url:new_url} );
      Links.insert(
      {
        url : new_url,
        title: new_title,
        score: 0,
        thumbs_up: 0,
        thumbs_down: 0,
        date: Date()
      });
      Meteor.call('vote', url, 'thumbs_up');
    }
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.methods({
      vote: function (title, field){
        new_obj = { $inc: {} };
        if(field =='thumbs_up'){
          new_obj.$inc['thumbs_up'] = 1;
          new_obj.$inc['score'] = 1;
        }
        else {
          new_obj.$inc['thumbs_down'] = 1;
          new_obj.$inc['score'] = -1;
        }
        Links.update( { title : title }, new_obj );
      }
    });
  });
}
