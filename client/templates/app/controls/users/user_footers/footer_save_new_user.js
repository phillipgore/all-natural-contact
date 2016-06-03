Template.footerSaveNewUser.events({
	'click .js_new_user_submit': function(e) {
		e.preventDefault();
		
		$('.js_user_new_form').submit();
	},
});