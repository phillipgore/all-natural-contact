Template.userBilling.onRendered(function() {
	if (Session.get('billingExpired')) {
		$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled, .icn_controls_disabled, .icn_action_disabled, .search_box_disabled').show();
		$('.icn_add_tag, .icn_add_contact, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag, .icn_controls, .icn_action, .search_box').hide();
	} else {
		$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
		$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();
	}

	$('.js_startup_loader').hide();
});


Template.userBilling.helpers({
	currentUser: function() {
		return Meteor.user();
	},

	activeUsers: function() {
		return Meteor.users.find({'role.inactive': false}).count();
	},

	controls: function() {
		return Controls.findOne();
	},

	freeTrialExpired: function() {
		var free_account_expires = moment(Groups.findOne().created_on).add(Controls.findOne().freeTrial, 'd').utc().valueOf();
		var current_date = moment().utc().valueOf();

		if (free_account_expires <= current_date && Meteor.user().role.app_administrator === false && Controls.findOne().publicBeta === false) {
			return true;
		} else {
			return false;
		}
	},
});
