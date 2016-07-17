Template.importCSV.onRendered(function() {
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();

	$('.js_startup_loader').hide();
});

Template.importCSV.events({
	'click .js_support': function(e) {
		e.preventDefault();

		if ($(e.target).hasClass('js_ion_box')) {
			var href = $(e.target).parent().attr('href')
		} else {
			var href = $(e.target).attr('href')
		}
		window.open(href, '_blank');
	},
});
