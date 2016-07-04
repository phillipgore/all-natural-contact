Template.data.helpers({
	tagSelect: function() {
		return TagSelect.find();
	},

	contactSelect: function() {
		return ContactSelect.find();
	},

	currentContact: function() {
		return Session.get('currentContact')
	},

	currentNameLast: function() {
		return Session.get('currentNameLast')
	},

	currentTag: function() {
		return Session.get('currentTag')
	},

	currentTagName: function() {
		return Session.get('currentTagName')
	},

	milestoneTag: function() {
		return Session.get('milestoneTag')
	},

	milestoneTagName: function() {
		return Session.get('milestoneTagName')
	},

	tagCount: function() {
		return Tags.find({created_on: { $exists: true }}).count();
	},

	contactCount: function() {
		return Contacts.find({created_on: { $exists: true }}).count();
	},

	conversationCount: function() {
		return Conversations.find({created_on: { $exists: true }}).count();
	},

	contactScrollDir: function() {
		return Session.get('contactScrollDir')
	},

	contactPivotId: function() {
		return Session.get('contactPivotId')
	},

	contactPivotNameLast: function() {
		return Session.get('contactPivotNameLast')
	},

	contactPivotOffset: function() {
		return Session.get('contactPivotOffset')
	},

	startUp: function() {
		return Session.get('startUp')
	},
});
