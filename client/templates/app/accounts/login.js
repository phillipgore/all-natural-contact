Template.login.onRendered(function() {
	$('.js_startup_loader').hide();
});

Template.login.events({
	'click .js_checkbox_remember_me': function(e) {
		e.preventDefault();
		$(e.target).toggleClass('unchecked')
		if ($(e.target).find('input').val() === 'false') {
			$(e.target).find('input').val('true');
		} else {
			$(e.target).find('input').val('false');
		}
	},

	'submit form': function(e) {
		e.preventDefault();
		$('.js_submit').attr('disabled', 'disabled').text('Signing In...');
		$('.js_form_overlay').show();
		$('.login_alert').slideUp('fast');

		var email = $(e.target).find('[name=login_email]').val();
		var password = $(e.target).find('[name=login_password]').val();
		var remember_me = $(e.target).find('[name=remember_me]').val() == "true";
		var logout_time = moment().add(1, 'd').toISOString();

		var trimInput = function(val) {
			return val.replace(/^\s*|\s*$/g, "");
		}
		var email = trimInput(email);

		var isValidPassword = function(val) {
			return val.length >= 6 ? true : false;
		}

		var count = 0;
		$('.js_required').each(function(){
			if ($(this).val() === "") {
				count++;
			}
		});

		if (count > 0) {
			$('.js_submit').removeAttr('disabled').text('Sign In');
			$('.js_form_overlay').hide();
			isRequired = false;
		} else {
			isRequired = true;
		}

		$('.js_required').each(function() {
			if (!$(this).val()) {
				$(this).css('border-color', 'red');
				$('.login_alert').text('Please fill out all required fields.').slideDown();
			} else {
				$(this).removeAttr('style');
			}
		});

		if (isRequired) {
			if (isValidPassword(password)) {
				var self = this;
				Meteor.loginWithPassword(email, password, function(error) {
					if (error) {
						if (error.reason === 'Match failed') {
							$('.js_submit').removeAttr('disabled').text('Sign In');
							$('.js_form_overlay').hide();
							$('#login_email').css('border-color', 'red');
							$('.login_alert').text('A valid email is required for login.').slideDown();
						} else if (error.reason === 'Login forbidden') {
							$('.js_submit').removeAttr('disabled').text('Sign In');
							$('.js_form_overlay').hide();
							$('.login_alert').text('The email you provided has not been verified. Check your inbox for a verification email.').slideDown();
						} else if (error.reason === 'User not found') {
							$('.js_submit').removeAttr('disabled').text('Sign In');
							$('.js_form_overlay').hide();
							$('#login_email').css('border-color', 'red');
							$('.login_alert').text('The email you provided does not belong to an existing user.').slideDown();
						} else if (error.reason === 'Incorrect password') {
							$('.js_submit').removeAttr('disabled').text('Sign In');
							$('.js_form_overlay').hide();
							$('#login_email, #login_password').css('border-color', 'red');
							$('.login_alert').text('The password you provided does not belong to the email you provided.').slideDown();
						}
					} else {
							Session.set({
								remember_me: remember_me,
								logout_time: logout_time,
							})
						}
				});
			} else {
				$('.js_submit').removeAttr('disabled').text('Sign In');
				$('.js_form_overlay').hide();
				$('#login_password').css('border-color', 'red');
				$('.login_alert').text('Passwords must contain at least six letters or numbers.').slideDown();
			}
		}

		return false;
	},

});
