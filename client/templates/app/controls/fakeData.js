Template.fakeData.onRendered(function() {
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();
	
	$('.js_startup_loader').fadeOut('fast');
});

Template.fakeData.helpers({
	
	tagPercent: function() {
		return Math.round(Counts.get('accountTagCount') / Session.get('targetTotalTags') * 100);
	},
	
	contactPercent: function() {
		return Math.round(Counts.get('accountContactCount') / Session.get('targetTotalContacts') * 100);
	},
	
	conversationPercent: function() {
		return Math.round(Counts.get('accountConversationCount') / Session.get('targetTotalConversations') * 100);
	}
	
})

Template.fakeData.events({	
	'submit .js_fake_data_form': function(e) {
		e.preventDefault();
		$('.js_submit').attr('disabled', 'disabled');
		$('.js_fake_data_submit').text('Creating...').addClass('js_inactive');
		
		var createTags = parseInt($(e.target).find('[name=fake_tags]').val().trim());
		var createContacts = parseInt($(e.target).find('[name=fake_contacts]').val().trim());
		var createConversations = parseInt($(e.target).find('[name=fake_conversations]').val().trim());	
		
		if (!createTags) {
			var createTags = 0
		}
		if (!createContacts) {
			var createContacts = 0
		}
		if (!createConversations) {
			var createConversations = 0
		}
		
		Session.set({
			targetTotalTags: Counts.get('accountTagCount') + createTags,
			targetTotalContacts: Counts.get('accountContactCount') + createContacts,
			targetTotalConversations: Counts.get('accountConversationCount') + (createConversations * createContacts)
		})	
		
		$('.js_fake_data_creation').show();
		
		Meteor.appFunctions.fakerData(createTags, createContacts, createConversations);
	}
});