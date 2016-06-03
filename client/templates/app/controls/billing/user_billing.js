Template.userBilling.onRendered(function() {
	if (Session.get('billingExpired')) {
		$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled, .icn_controls_disabled, .icn_action_disabled, .search_box_disabled, .js_billing_save_head').show();
		$('.icn_add_tag, .icn_add_contact, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag, .icn_controls, .icn_action, .search_box, .js_billing_update_head, .js_cancel_billing').hide();
		$('.js_billing_submit').addClass('block').text('Charge Credit Card').parent().removeClass('fl_right');
	} else {
		$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled, .js_billing_update_head, .js_cancel_billing').show();
		$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag, .js_billing_save_head').hide();
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
	}
});
