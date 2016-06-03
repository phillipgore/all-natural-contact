Template.footerSavePassword.events({
	'click .js_password_submit': function(e) {
		e.preventDefault();
		$('.js_user_password_update_form').submit();
	}
});