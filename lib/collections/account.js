Meteor.methods({
	updateRemember: function(remember_me, logout_time) {
		Meteor.users.update(Meteor.userId(), {$set: {
			"profile.remember_me": remember_me,
			"profile.logout_time": logout_time
		}});
	},

	updateRoles: function(userRoles) {
		if (Meteor.user().role.administrator) {
			for (var i = 0; i < userRoles.length; i++) {
				Meteor.users.update(userRoles[i].user_id, {$set: {
						"role.administrator": userRoles[i].administrator,
						"role.user": userRoles[i].user,
						"role.inactive": userRoles[i].inactive
					}
				});
			}
		}
	},

	removeUser: function(userId) {
		if (Meteor.user().role.administrator) {
			Meteor.users.remove({_id: userId})
		}
	},

	updateProfile: function(userId, first, last, email_updates) {
		if (Meteor.user().role.administrator || this.userId === userId) {
			Meteor.users.update(userId, {$set: {
					"profile.first": first,
					"profile.last": last,
					"profile.email_updates": email_updates,
				}
			});
		}
	},

	updateEmail: function(userId, email) {
		if (Meteor.user().role.administrator || this.userId === userId) {
			Meteor.users.update(userId, {$set: {
					"emails.0.address": email
				}
			});
		}
	},

	updateTimezone: function(userId, timezone) {
		if (Meteor.user().role.administrator || this.userId === userId) {
			Meteor.users.update(Meteor.userId(), {$set: {"profile.timezone": timezone}});
		}
	},

	updateFields: function(userId, fieldProperties) {
		if (Meteor.user().role.administrator || this.userId === userId) {
			Meteor.users.update(userId, {$set: fieldProperties});
		}
	}
});
