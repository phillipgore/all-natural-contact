Template.exportCSV.onRendered(function() {
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();
	
	$('.js_startup_loader').hide();
});



Template.exportCSV.helpers({
	allContactsCount: function() {
		return Counts.get('accountContactCount');
	},
	
	taggedContactsCount: function() {
		return Counts.get('taggedContactCount');
	},
	
	pluralTag: function() {
		if (TagSelect.find().count() === 1) {
			return ''
		} else {
			return 's'
		}
	},
	
	pluralTagged: function() {
		if (Counts.get('taggedContactCount') === 1) {
			return ''
		} else {
			return 's'
		}
	},
	
	selectedContactsCount: function() {
		return ContactSelect.find().count();
	},
	
	pluralContact: function() {
		if (ContactSelect.find().count() === 1) {
			return ''
		} else {
			return 's'
		}
	},
});



Template.exportCSV.events({
	'click .js_radiobutton_role': function(e) {
		e.preventDefault();
		if (!$(e.target).hasClass('js_inactive')) {
			$(e.target).parent().find('.js_radiobutton_role').addClass('unselected').find('input').val('false');
			$(e.target).removeClass('unselected').find('input').val('true');
		}
	},
});



