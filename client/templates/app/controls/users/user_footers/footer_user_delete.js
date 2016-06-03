Template.footerUserDelete.helpers({
	deleteUser: function() {
		return Meteor.users.findOne(Session.get('updateUser'));
	},
});

Template.footerUserDelete.events({
	'click .js_delete_user': function(e) {
		e.preventDefault();
		
		Meteor.call('removeUser', Session.get('updateUser'), function(error, result) {
			if (error) {
				return alert(error.reason);
			} else {
				Router.go('settings');  
			}
		});
	}
});