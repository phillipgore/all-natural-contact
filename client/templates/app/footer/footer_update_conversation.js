Template.footerUpdateConversation.events({	
	'click .js_conversation_update': function(e) {
		e.preventDefault();
		$('.js_conversation_update_form').submit();
	}
});