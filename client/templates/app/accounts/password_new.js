Template.passwordNew.events({
	'submit form': function(e) {
		e.preventDefault();
		$('.js_submit').attr('disabled', 'disabled').text('Changing Password...');
		$('.js_form_overlay').show();
		$('.login_alert').slideUp('fast');

		var password = $(e.target).find('[name=new_account_password]').val();
		var password_check = $(e.target).find('[name=new_account_password_check]').val();

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
			if (isValidPassword(password)) {
				if (password === password_check) {
					Accounts.resetPassword(Session.get('resetToken'), password, function(error) {
						if (error) {
							alert(error.reason)
						}
					})
				} else {
					$('.js_submit').removeAttr('disabled').text('Change Password');
					$('.js_form_overlay').hide();
					$('#new_account_password, #new_account_password_check').val('').css('border-color', 'red');
					$('.login_alert').text('Passwords do not match.').slideDown();
				}
			} else {
				$('.js_submit').removeAttr('disabled').text('Change Password');
				$('.js_form_overlay').hide();
				$('#new_account_password, #new_account_password_check').css('border-color', 'red');
				$('.login_alert').text('A Password containing at least six letters or numbers is required.').slideDown();
			}
		} else {
			$('.js_submit').removeAttr('disabled').text('Change Password');
			$('.js_form_overlay').hide();
			$('.login_alert').text('Please fill out all required fields.').slideDown();
		}
	}
})
