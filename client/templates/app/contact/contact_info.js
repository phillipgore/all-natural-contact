Template.contactInfo.onRendered(function() {
	Session.set('contact_ready', '')

	if ($(window).width() > 639) {
		Session.set('currentTool', 'js_tool_conversation')
	} else {
		Session.set('currentTool', 'js_tool_profile')
	}

	$('.js_tool').removeClass('active js_tool_current');
	if (Session.get('currentTool')) {
		$('.' + Session.get('currentTool')).addClass('active js_tool_current');
	}

	var checkStatus = setInterval(function(){
		var contactId = Session.get('currentContact');
		if (Contacts.find().count() > 0) {
			clearInterval(checkStatus);
			var contactSelect = Contacts.findOne({_id: contactId});

			Session.set({
				contactPivotNameLast: contactSelect.nameLast,
				currentNameLast: contactSelect.nameLast,
			});


			ContactSelect.remove({});
			ContactSelect.insert({
				contactId: contactId,
				first: contactSelect.first,
				last: contactSelect.last,
				nameFirst: contactSelect.nameFirst,
				nameLast: contactSelect.nameLast
			});

			$('.js_notes_input').autogrow({onInitialize: true});
			$('.js_notes_input').blur().removeClass('js_inactive');
			$('.js_contact_info').scrollTop(0);

			var notesTop = $('.js_notes').offset().top
			if (notesTop < 300) {
				$('.js_contact_data').css('padding-bottom', 150);
				$('.js_notes').addClass('border_blue_top');
			}

			$('.js_contact_loader').hide();
			Session.set('contact_ready', true);

			if (TagCount.findOne().tag_count === 0) {
				$('.icn_add_tag, .icn_add_contact, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag_disabled').show();
				$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag').hide();
			} else {
				$('.icn_add_tag, .icn_add_contact, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').show();
				$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').hide();
			}

			$('.js_tool_profile_disabled, .js_tool_conversation_disabled, .js_tool_process_disabled').hide();
			$('.js_tool_profile, .js_tool_conversation, .js_tool_process').show();
		}
	}, 300);

	var checkReady = setInterval(function() {
		if (Session.get('contact_ready') && Session.get('conversation_ready') && Session.get('process_ready')) {
			clearInterval(checkReady);
			$('.js_startup_loader').fadeOut('fast');
		}
	}, 300);

});

Template.contactInfo.helpers({

	contact: function() {
		var contact = Contacts.findOne({_id: Session.get('currentContact')});
		return contact;
	},

	hasPersonal: function() {
		var contact = Contacts.findOne({_id: Session.get('currentContact')});
		if (contact.phonetic_first || contact.phonetic_middle || contact.phonetic_last || contact.nickname || contact.maiden || contact.is_company && contact.first || contact.is_company && contact.last || contact.is_company && contact.prefix || contact.is_company && contact.suffix) {
			return true;
		} else {
			return false;
		}
	},

	hasPhonetic: function() {
		var contact = Contacts.findOne({_id: Session.get('currentContact')});
		if (contact.phonetic_first || contact.phonetic_middle || contact.phonetic_last) {
			return true;
		} else {
			return false;
		}
	},

	hasProfessional: function() {
		var contact = Contacts.findOne({_id: Session.get('currentContact')});
		if (contact.job_title || contact.department || contact.company) {
			return true;
		} else {
			return false;
		}
	},

	hasPersonalOrProfessional: function() {
		var contact = Contacts.findOne({_id: Session.get('currentContact')});

		if (contact.job_title || contact.department || contact.phonetic_first || contact.phonetic_middle || contact.phonetic_last || contact.nickname || contact.maiden || !contact.is_company && contact.company || contact.is_company && contact.first || contact.is_company && contact.last || contact.is_company && contact.prefix || contact.is_company && contact.suffix) {
			return true;
		} else {
			return false;
		}
	},

});

Template.contactInfo.events({
	'click .js_contact_info': function(e) {
		e.preventDefault();
		if ($(e.target).hasClass('js_contact_info') || $(e.target).hasClass('js_notes_click')) {
			$('.js_contact_info, .js_notes, .js_notes_input').removeClass('bg_gray').addClass('bg_light_blue');
			$('.js_notes_input').focus();
		}
	},

	'click .js_related_search': function(e) {
		e.preventDefault();

		var family = ['mother', 'father', 'brother', 'sister', 'child', 'spouse'];
		var professional = ['partner', 'assistant', 'manager'];
		var label = $.trim($(e.target).attr('data-label')).toLowerCase();
		var related = $.trim($(e.target).attr('data-related'));
		var last = $.trim($(e.target).attr('data-last'));
		var company = $.trim($(e.target).attr('data-company'));

		if (family.indexOf(label) >= 0) {
			if (related.split(/\s+/).length > 1) {
				var searchText = related
			} else {
				var searchText = related +" "+ last
			}
		} else if (professional.indexOf(label) >= 0) {
			var searchText = related +" "+ company
		} else {
			var searchText = related
		}

		$('.js_search_input').val(searchText)
		Router.go('/search/' + encodeURI(searchText))
	},

	'blur .js_notes_input': function(e) {
		if (!$(e.target).hasClass('js_inactive')) {
			$('.js_contact_info, .js_notes, .js_notes_input').removeClass('bg_light_blue').addClass('bg_gray');
			var contact_id = Session.get('currentContact');
			var notesProperties = {
				notes: $('.js_notes_input').val(),
				nameFirst: $(this).parent().find('[name=nameFirst]').val(),
				nameLast: $(this).parent().find('[name=nameLast]').val(),
			}

			Meteor.call('contactUpdate', contact_id, notesProperties, function(error, result) {
				if (error) {
					return alert(error.reason);
				}
			});
		}
	},

	'click .js_profile_toolbar, click .js_contact_info': function(e) {
		e.preventDefault();
		$('#js_conversation .active').removeClass('active');
		$('.js_current').removeClass('js_current active');
		ConversationSelect.remove({});
		Session.set('currentType', 'contact');
		Session.set('updateRoute', '/update/contact/' + Session.get('currentContact'));
		Session.set('deleteRoute', '/delete/contacts');
		Session.set('deleteClass', 'js_delete_contact');
		if (TagCount.findOne().tag_count === 0) {
			$('.js_profile_inactive, .icn_add_to_tag_disabled').hide();
			$('.js_profile_active, .icn_add_to_tag_disabled').show();
		} else {
			$('.js_profile_inactive, .icn_add_to_tag_disabled').hide();
			$('.js_profile_active, .icn_add_to_tag').show();
		}
	},
});
