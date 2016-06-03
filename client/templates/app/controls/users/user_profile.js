Template.userProfile.onRendered(function() {
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();
	
	$('.js_startup_loader').hide();
});

Template.userProfile.helpers({
	profileUser: function() {
		return Meteor.users.findOne(Session.get('updateUser'));
	},
});

Template.userProfile.events({
	'click .js_checkbox_email_updates': function(e) {
		e.preventDefault();
		$(e.target).toggleClass('unchecked')
		if ($(e.target).find('input').val() === 'false') {
			$(e.target).find('input').val('true');
		} else {
			$(e.target).find('input').val('false');
		}
	},

	'submit .js_user_profile_update_form': function(e) {
		e.preventDefault();
		$('.js_submit').attr('disabled', 'disabled').text('Updating...');
		$('.js_saving_msg').text('Updating...');
		$('.js_initial_loading_overlay').show();
		
		var first = $(e.target).find('[name=account_first_update]').val();
		var last = $(e.target).find('[name=account_last_update]').val();
		var email_updates = $(e.target).find('[name=email_updates_update]').val() == "true";
				
		var count = 0;
		$('.js_required').each(function(){
			if ($(this).val() === "") {
				count++;
			} 
		});
		
		if (count > 0) {
			isRequired = false;
		} else {
			isRequired = true;
		}
		
		$('.js_required').each(function() {
			if (!$(this).val()) {
				$(this).css('border-color', 'red');
			} else {
				$(this).removeAttr('style');
			}
		});
		
		if (isRequired) {
			Meteor.call('updateProfile', Session.get('updateUser'), first, last, email_updates, function(error, result) {
				if (error) {
					return alert(error.reason);
				} else {
					Router.go('userReturn');  
				}
			});
		} else {
			$('.js_submit').removeAttr('disabled').text('Update');
			$('.js_initial_loading_overlay').hide();
			$('.red_alert_msg').text('Please fill out all required fields.').slideDown();
		}
	}
})