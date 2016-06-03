Template.footerUpdateContact.events({	
	'click .js_contact_update': function(e) {
		e.preventDefault();
		
		if (!$(e.target).hasClass('js_inactive')) {
			$('.js_contact_update_form').submit();
		}
	}
});