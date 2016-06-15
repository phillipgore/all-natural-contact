Template.footerSaveAccountName.events({
	'click .js_account_name_submit': function(e) {
		e.preventDefault();
		$('.js_account_name_update_form').submit();
	}
});
