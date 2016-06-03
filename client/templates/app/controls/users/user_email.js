Template.userEmail.onRendered(function() {
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();
	
	$('.js_startup_loader').hide();
});

Template.userEmail.helpers({
	emailUser: function() {
		return Meteor.users.findOne(Session.get('updateUser'));
	},
});

Template.userEmail.events({
	'submit .js_user_email_update_form': function(e) {
		e.preventDefault();
		$('.js_submit').attr('disabled', 'disabled').text('Updating...');
		$('.js_saving_msg').text('Updating...');
		$('.js_initial_loading_overlay').show();
		
		var email = $(e.target).find('[name=account_email_update]').val().trim();
		var email_check = $(e.target).find('[name=account_email_update_check]').val().trim();
		
		var isValidEmail = function(val) {
		    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		    return regex.test(val);
		}
		
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
			if (isValidEmail(email)) {
				if (email === email_check) {
					Meteor.call('updateEmail', Session.get('updateUser'), email, function(error, result) {
						if (error) {
							return alert(error.reason);
						} else {
							Router.go('userReturn');  
						}
					});
				} else {
					$('.js_submit').removeAttr('disabled').text('Update');
					$('.js_initial_loading_overlay').hide();
					$('#account_email, #account_email_check').val('').css('border-color', 'red');
					$('.red_alert_msg').text('Emails do not match.').slideDown();
				}
			} else {
				$('.js_submit').removeAttr('disabled').text('Update');
				$('.js_initial_loading_overlay').hide();
				$('#account_email').css('border-color', 'red');
				$('.red_alert_msg').text('A valid email is required for registraton.').slideDown();
			}
		} else {
			$('.js_submit').removeAttr('disabled').text('Update');
			$('.js_initial_loading_overlay').hide();
			$('.red_alert_msg').text('Please fill out all required fields.').slideDown();
		}
	}
})