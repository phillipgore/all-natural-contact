Template.notFound.onRendered(function() {
	$('.icn_add_to_tag_disabled, .icn_delete_disabled, .icn_edit_disabled, .icn_add_conversation_disabled').show();
	$('.icn_add_to_tag, .icn_delete, .icn_edit, .icn_add_conversation').hide();
	
	$('.js_startup_loader').fadeOut('fast');
});


Template.notFound.events({
	'click .js_back_home': function(e) {
		e.preventDefault();
		Router.go('/info/tag/all_contacts_tag')
	}
})