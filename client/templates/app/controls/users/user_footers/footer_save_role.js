Template.footerSaveRole.events({
	'click .js_role_submit': function(e) {
		e.preventDefault();
			
		$('.js_user_role_update').submit();
	}
});