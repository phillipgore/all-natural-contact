Meteor.publish('allContacts', function() {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).group.group_id;
		return Contacts.find({groupId: groupId})
	} else {
		return this.ready();
	}
});

Meteor.publish('selectedContacts', function(contactIds) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).group.group_id;
		return Contacts.find({groupId: groupId, _id: {$in: contactIds}})
	} else {
		return this.ready();
	}
});

Meteor.publish('taggedContacts', function(tagIds) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).group.group_id;

		var tags = Tags.find({groupId: groupId, _id: {$in: tagIds}})
		var contactIds = []
		tags.forEach(function(tag) {
			var contacts = tag.has_contacts
			for (var i = 0; i < contacts.length; i++) {
				contactIds.push(contacts[i])
			}
		})

		return Contacts.find({groupId: groupId, _id: {$in: contactIds}})
	} else {
		return this.ready();
	}
});
