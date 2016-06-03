Template.footerSaveEmail.events({
	'click .js_email_submit': function(e) {
		e.preventDefault();
		$('.js_user_email_update_form').submit();
	}
});