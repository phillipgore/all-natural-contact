Template.footerSaveTimezone.events({
	'click .js_timezone_submit': function(e) {
		e.preventDefault();
		
		$('.js_user_timezone_update_form').submit();
	}
});