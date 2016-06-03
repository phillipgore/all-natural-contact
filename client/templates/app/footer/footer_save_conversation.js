Template.footerSaveConversation.events({	
	'click .js_conversation_new_submit, click .js_conversation_new_submit_plus': function(e) {
		e.preventDefault();
		if ($(e.target).hasClass('js_contact_new_submit_plus')) {
			$('.js_conversation_new_form').addClass('js_plus').submit();
		} else {
			$('.js_conversation_new_form').submit();
		}	
	}
});