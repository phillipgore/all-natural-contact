Meteor.publish('groupData', function() {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		var app_admin = Meteor.users.findOne({_id: this.userId}).role.app_administrator;
		var admin = Meteor.users.findOne({_id: this.userId}).role.administrator;
		if (app_admin || admin) {
			return [
				Meteor.users.find({"profile.belongs_to_group": groupId}, {fields: {emails: 1, profile: 1, role: 1, fields: 1}}),
				Groups.find({_id: groupId})
			]
		} else {
			return [
				Meteor.users.find({_id: this.userId}, {fields: {emails: 1, profile: 1, role: 1, fields: 1}}),
				Groups.find({_id: groupId})
			]
		}
	} else {
		return this.ready();
	}
});
