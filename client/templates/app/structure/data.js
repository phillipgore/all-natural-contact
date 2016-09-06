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

	conScrollDir: function() {
		return Session.get('conScrollDir')
	},

	conPivotId: function() {
		return Session.get('conPivotId')
	},

	conPivotDate: function() {
		return Session.get('conPivotDate')
	},

	conPivotOffset: function() {
		return Session.get('conPivotOffset')
	},

	startUp: function() {
		return Session.get('startUp')
	},

	rememberMe: function() {
		return Meteor.user({_id: Meteor.userId()}).profile.remember_me
	},

	logoutTime: function() {
		return Meteor.user({_id: Meteor.userId()}).profile.logout_time
	},

	groupCreated: function() {
		return Groups.findOne().created_on
	},

	freeTrialExpires: function() {
		return moment(Groups.findOne().created_on).add(Controls.findOne().freeTrial, 'd')
	}
});
