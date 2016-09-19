Template.userRoles.onRendered(function() {
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();

	$('.js_startup_loader').hide();
});

Template.userRoles.helpers({
	users: function() {
		return Meteor.users.find({}, {sort: {"profile.last": 1, "profile.first": 1}});
	},

	controls: function() {
		return Controls.findOne();
	},
});

Template.userRoles.events({
	'click .js_radiobutton_role': function(e) {
		e.preventDefault();
		if ($(e.target).hasClass('js_role_inactive')) {
			$(e.target).parent().find('.js_price_per_user').text('$0/month*')
		} else {
			$(e.target).parent().find('.js_price_per_user').text('$15/month*')
		}
		$(e.target).parent().find('.js_radiobutton_role').addClass('unselected').find('input').val('false');
		$(e.target).removeClass('unselected').find('input').val('true');
	},

	'submit form': function(e) {
		e.preventDefault();
		$('.js_submit').attr('disabled', 'disabled').text('Updating...');
		$('.js_saving_msg').text('Updating...');

		var userRoles = []
		$(e.target).find('.js_user_role').each(function() {
			var user_id = $(this).find('[name=user_id]').val();
			var administrator = $(this).find('[name=administrator_role]').val() == "true";
			var user = $(this).find('[name=user_role]').val() == "true";
			var inactive = $(this).find('[name=inactive_role]').val() == "true";
			var userProperties = {
				user_id: user_id,
				administrator: administrator,
				user: user,
				inactive: inactive,
			}
			userRoles.push(userProperties)
		});

		var hasAdmin = []
		for (var i = 0; i < userRoles.length; i++) {
			hasAdmin.push(userRoles[i].administrator)
		}

		if (hasAdmin.indexOf(true) >= 0) {
			$('.js_submit').attr('disabled', 'disabled').text('Updating...');
			$('.js_initial_loading_overlay').show();
			Meteor.call('updateRoles', userRoles, function(error, result) {
				if (error) {
					return alert(error.reason);
				} else {
					var group = Groups.findOne();
					var quantity = Meteor.users.find({'role.inactive': false, 'emails.0.verified': true}).count()

					Meteor.call('updateSubscriptionQuantity', quantity, function(error, result) {
						if (error) {
							alert(result.error.message)
						} else {
							Router.go('settings');
						}
					})
				}
			});
		} else {
			$('.js_user_role_update').animate({ scrollTop: 0 });
			$('.js_red_alert_msg').text('There must be at least one Administrator.').slideDown();
		}
	},
});
