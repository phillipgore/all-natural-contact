Template.cardInfo.onRendered(function() {
  Meteor.call('getCustomer', function(error, result) {
    if (error == null) {
      Session.set("cardInfo", result.cardInfo);
    }
  })
})

Template.cardInfo.helpers({
  card: function(){
    return Session.get('cardInfo');
  }
})
