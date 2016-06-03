Template.footerSaveFields.events({
	'click .js_fields_submit': function(e) {
		e.preventDefault();
		$('.js_user_fields_update_form').submit();
	}
});