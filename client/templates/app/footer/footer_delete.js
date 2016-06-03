Template.footerDelete.helpers({
	isContact: function() {
		if (Session.get('currentType') === 'contact' && Session.get('currentTag') != 'all_contacts_tag') {
			return true;
		}
	},
});