Template.footerSaveProfile.events({
	'click .js_profile_submit': function(e) {
		e.preventDefault();
		$('.js_user_profile_update_form').submit();
	}
});