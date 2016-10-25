Template.pauseAccount.onRendered(function() {
	$('.js_startup_loader').hide();
});

Template.pauseAccount.onRendered(function() {
  Meteor.call('getSubscription', function(error, result) {
    if (error == null) {
      Session.set("subInfo", result.subInfo);
    }
  })
});

Template.pauseAccount.helpers({
  subscription: function(){
    return Session.get('subInfo');
  },
});
