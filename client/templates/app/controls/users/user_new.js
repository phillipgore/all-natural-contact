Template.userNew.onRendered(function() {
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();

	$('.js_startup_loader').hide();
});

Template.userNew.events({
	'click .js_checkbox_email_updates': function(e) {
		e.preventDefault();
		$(e.target).toggleClass('unchecked')
		if ($(e.target).find('input').val() === 'false') {
			$(e.target).find('input').val('true');
		} else {
			$(e.target).find('input').val('false');
		}
	},

	'submit .js_user_new_form': function(e) {
		e.preventDefault();
		$('.js_submit').attr('disabled', 'disabled').text('Saving...');
		$('.js_initial_loading_overlay').show();

		var first = $(e.target).find('[name=account_first]').val();
		var last = $(e.target).find('[name=account_last]').val();
		var email = $(e.target).find('[name=account_email]').val();
		var email_check = $(e.target).find('[name=account_email_check]').val();
		var password = $(e.target).find('[name=account_password]').val();
		var password_check = $(e.target).find('[name=account_password_check]').val();
		var email_updates = $(e.target).find('[name=email_updates]').val() == "true";
		var logout_time = moment().add(1, 'd').toISOString();
		var group_id = Meteor.users.findOne({_id: Meteor.userId()}).profile.belongs_to_group;

		var group = {
			group_id: group_id,
			group_name: Groups.findOne({_id: group_id}).name,
		}

		var profile = {
			first: first,
			last: last,
			email_updates: email_updates,
			remember_me: false,
			logout_time: logout_time,
			timezone: jstz.determine().name(),
			belongs_to_group: group_id,
		}

		var role = {
			app_administrator: false,
			administrator: false,
			user: true,
			inactive: false,
		}

		var fields = {
			prefix_field: false,
			middle_field: false,
			suffix_field: false,

			phonetic_field: false,
			nickname_field: false,
			maiden_field: false,

			job_title_field: true,
			department_field: true,
			company_field: true,

			phone_field: true,
			email_field: true,
			url_field: true,

			date_field: true,
			related_field: true,
			immp_field: true,
			address_field: true
		}

		var trimInput = function(val) {
			return val.replace(/^\s*|\s*$/g, "");
		}

		var email = trimInput(email);

		var isValidEmail = function(val) {
		    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		    return regex.test(val);
		}

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
			if (isValidEmail(email)) {
				if (isValidPassword(password)) {
					if (email === email_check) {
						if (password === password_check) {
							Accounts.createUser({
								group: group,
								email: email,
								password: password,
								profile: profile,
								role: role,
								fields: fields
							}, function(error) {
								if (error.reason === 'Email already exists.') {
									$('.js_submit').removeAttr('disabled').text('Create Account');
									$('.js_initial_loading_overlay').hide();
									$('#account_email').css('border-color', 'red');
									$('.red_alert_msg').text('This email has already been registered with an account.').slideDown();
								} else if (error.reason === 'Login forbidden') {
									Router.go('userCreated')
								} else {
									Router.go('userCreated')
								}
							});
						} else {
							$('.js_submit').removeAttr('disabled').text('Create Account');
							$('.js_initial_loading_overlay').hide();
							$('#account_email, #account_email_check').val('').css('border-color', 'red');
							$('.red_alert_msg').text('Emails do not match.').slideDown();
						}
					} else {
						$('.js_submit').removeAttr('disabled').text('Create Account');
						$('.js_initial_loading_overlay').hide();
						$('#account_password, #account_password_check').val('').css('border-color', 'red');
						$('.red_alert_msg').text('Passwords do not match.').slideDown();
					}
				} else {
					$('.js_submit').removeAttr('disabled').text('Create Account');
					$('.js_initial_loading_overlay').hide();
					$('#account_password').css('border-color', 'red');
					$('.red_alert_msg').text('A Password containing at least six letters or numbers is required.').slideDown();
				}
			} else {
				$('.js_submit').removeAttr('disabled').text('Create Account');
				$('.js_initial_loading_overlay').hide();
				$('#account_email').css('border-color', 'red');
				$('.red_alert_msg').text('A valid email is required for registraton.').slideDown();
			}
		} else {
			$('.js_submit').removeAttr('disabled').text('Create Account');
			$('.js_initial_loading_overlay').hide();
			$('.red_alert_msg').text('Please fill out all required fields.').slideDown();
		}

		return false;

	}});
