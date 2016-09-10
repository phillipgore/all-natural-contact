Template.userTable.helpers({
	activeUsers: function() {
		return Meteor.users.find({}, {sort: {'profile.last': 1, 'profile.first': 1}});
	},

	totalCharge: function() {
		return Meteor.users.find({'role.inactive': false, 'emails.0.verified': true}).count() * 15;
	},
});
