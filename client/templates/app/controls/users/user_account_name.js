Template.userAccountName.onRendered(function() {
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();

	$('.js_startup_loader').hide();
});


Template.userAccountName.helpers({
	group: function() {
		return Groups.findOne();
	},
});

Template.userAccountName.events({
	'submit .js_account_name_update_form': function(e) {
		e.preventDefault();

		var group_name = $(e.target).find('[name=account_name_update]').val().trim();

		if (group_name.length > 0) {
			$('.js_submit').attr('disabled', 'disabled').text('Updating...');
			$('.js_saving_msg').text('Updating...');
			$('.js_initial_loading_overlay').show();

			var group_id = Groups.findOne()._id;
			var groupProperties = {
				name: group_name
			};

			Meteor.call('groupUpdate', group_id, groupProperties, function(error, result) {
				if (error) {
					return alert(error.reason);
				} else {
					Router.go('settings');
				}
			});
		} else {
			$('.js_red_alert_msg').text('There must be an account name.').slideDown();
		}
	},
});
