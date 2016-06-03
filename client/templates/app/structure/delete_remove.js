Template.deleteRemove.onRendered(function() {
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();
});

Template.deleteRemove.helpers({
	isContact: function() {
		if (Session.get('currentType') === 'contact' && Session.get('currentTag') != 'all_contacts_tag') {
			return true;
		}
	},
	
	isConversation: function() {
		if (Session.get('currentType') === 'conversation') {
			return true;
		}
	},
	
	plural: function() {
		if (Session.get('currentType') === 'contact') {
			if (ContactSelect.find().count() > 1) {
				return true;
			}
		} else if (Session.get('currentType') === 'conversation') {
			if (ConversationSelect.find().count() > 1) {
				return true;
			}
		} else {
			if (TagSelect.find().count() > 1) {
				return true;
			}
		}
	},
});