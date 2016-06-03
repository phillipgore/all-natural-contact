Meteor.publish('groupData', function() {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).group.group_id;
		return Meteor.users.find({"group.group_id": groupId}, {fields: {emails: 1, profile: 1, group: 1, role: 1, fields: 1}});
	} else {
		return this.ready();
	}
});
