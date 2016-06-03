Template.footerSaveContact.events({	
	'click .js_contact_new_submit, click .js_contact_new_submit_plus': function(e) {
		e.preventDefault();
		
		if (!$(e.target).hasClass('js_inactive')) {
			$('.js_contact_new_form').submit();
		}
	}
});