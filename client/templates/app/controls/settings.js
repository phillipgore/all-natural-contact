Template.settings.onRendered(function() {
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();

	$('.js_tool_profile, .js_tool_conversation, .js_tool_process').hide();
	$('.js_tool_profile_disabled, .js_tool_conversation_disabled, .js_tool_process_disabled').show();

	$('.js_startup_loader').hide();
});

Template.settings.helpers({
	users: function() {
		return Meteor.users.find({}, {sort: {"profile.last": 1, "profile.first": 1}});
	},

	currentUser: function() {
		return Meteor.users.findOne(Meteor.userId());
	},

	group: function() {
		return Groups.findOne();
	},

	isAdmin: function() {
		if (Meteor.users.findOne(Meteor.userId()).role.administrator === true || Meteor.users.findOne(Meteor.userId()).role.app_administrator === true) {
			return true;
		} else {
			return false;
		}
	}
});
