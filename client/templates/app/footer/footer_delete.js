Template.footerDelete.onRendered(function() {
	$('body').keypress(function(e) {
		if (e.which == 13) {
			if ($('.js_delete_remove').find('.js_remove_contact')) {
				$('.js_remove_contact').click();
			} else {
				$('.js_delete').click();
			}
		}
	});
});

Template.footerDelete.helpers({
	isContact: function() {
		if (Session.get('currentType') === 'contact' && Session.get('currentTag') != 'all_contacts_tag') {
			return true;
		}
	},
});
