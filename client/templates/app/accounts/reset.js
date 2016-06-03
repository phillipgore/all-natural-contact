Template.reset.onRendered(function() {
	$('.js_startup_loader').hide();
});

Template.reset.events({
	'submit form': function(e) {
		e.preventDefault();
		$('.js_submit').attr('disabled', 'disabled').text('Sending Reset Link...');
		$('.js_form_overlay').show();
		$('.login_alert').slideUp('fast');
		
		var email = $(e.target).find('[name=login_email]').val();
		var trimInput = function(val) {
			return val.replace(/^\s*|\s*$/g, "");
		}
		
		var email = trimInput(email);
		
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
			$('.js_submit').removeAttr('disabled').text('Reset Password');
			$('.js_form_overlay').hide();
			isRequired = false;
		} else {
			isRequired = true;
		}
		
		$('.js_required').each(function() {
			if (!$(this).val()) {
				$(this).css('border-color', 'red');
				$('.login_alert').text('A valid email is required.').slideDown();
			} else {
				$(this).removeAttr('style');
			}
		});
		
		if (isRequired) {
			if (isValidEmail(email)) {
			 	Accounts.forgotPassword({email: email}, function(error){
			 		if (error) {
			 			$('.login_alert').text(error.reason).slideDown();
			 		} else {
			 			Router.go('passwordLinkSent')
			 		}
			 	
			 	})
			} else {
				$('.js_submit').removeAttr('disabled').text('Reset Password');
				$('.js_form_overlay').hide();
				$('#login_email').css('border-color', 'red');
				$('.login_alert').text('A valid email is required for registraton.').slideDown();
			}
		 	return false;
		}
		
		
	},
});