Template.footerExportContacts.onCreated(function() {
	Template.instance().subscribe( 'profile' );
});

Template.footerExportContacts.events({
	'click .js_cancel_export_btn': function(e) {
		e.preventDefault();
		if (!$(e.target).hasClass('js_inactive')) {
			Router.go('/info/tag/all_contacts_tag')
		}
	},
	
	'click .js_export_btn': function(e) {
		e.preventDefault();
		
		$('.js_export_btns').hide();
		$('.js_initial_loading_overlay, .js_complete_btns').show();
		
		if (!$(e.target).hasClass('js_inactive')) {
			if ($('.js_export_data_type').find('[name=all_contacts]').val() === "true") {
				Session.set('expectedContacts', Counts.get('accountContactCount'))
				Router.go('/export/all/ids')
				
			} else if ($('.js_export_data_type').find('[name=selected_contacts]').val() === "true") {
				Session.set('expectedContacts', ContactSelect.find().count())
				var contacts = ContactSelect.find()
				var contactIds = []
				contacts.forEach(function(contact) {
					contactIds.push(contact.contactId)
				})
				Router.go('/export/selected/' + contactIds)
				
			} else {
				Session.set('expectedContacts', Counts.get('taggedContactCount'))
				var tags = TagSelect.find()
				var tagIds = []
				tags.forEach(function(tag) {
					tagIds.push(tag.tagId)
				})
				Router.go('/export/tagged/' + tagIds)
				
			}
		}
	},
});









