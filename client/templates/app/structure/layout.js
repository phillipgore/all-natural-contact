Template.layout.onRendered(function() {
	if ($(window).width() > 639) {
		Session.set('currentTool', 'js_tool_conversation')
	} else {
		Session.set('currentTool', 'js_tool_profile')
	}

	$('.js_tool').removeClass('active js_tool_current');
	if (Session.get('currentTool')) {
		$('.' + Session.get('currentTool')).addClass('active js_tool_current');
	}

	if ($(window).width() > 639) {
		$('.js_contact_info, .content.two').show();
	}
	if ($(window).width() < 640) {
		$('.js_toolbox_three').hide();
		$('.js_contact_info, .content.two').hide();
	}
	if ($(window).width() > 962) {
		$('.js_toolbox_three').hide();
		$('.content.three').show();
	}
	if ($(window).width() < 962) {
		$('.js_toolbox_three').show();
		$('.content.three').hide();
	}

	$(window).resize(function() {
		if ($(window).width() > 639) {
			$('.js_profile_toolbar, .js_contact_info, .content.two, .js_toolbox_three, .js_contact_search').show();
			$('.js_tag_search, .js_conversation_search').hide();
		}

		if ($(window).width() < 640) {
			$('.js_tool').removeClass('js_tool_current active');
			$('.content.two, .content.three, .js_toolbox_three').hide();
			$('.js_profile_toolbar, .js_contact_info').show();
			$('.js_tool_profile').addClass('js_tool_current active');
		}

		if ($(window).width() >= 768) {
			$('.js_sheet_action').hide();
		}

		if ($(window).width() > 962) {
			$('.js_toolbox_three').hide();
			$('.content.three').show();
		}

		if ($(window).width() > 640 && $(window).width() < 962) {
			$('.js_tool').removeClass('js_tool_current active');

			if (Session.get('currentTool') === 'js_tool_profile') {
				$('.content.three').hide();
				$('.content.two, .js_toolbox_three').show();
				$('.js_tool_conversation').addClass('js_tool_current active');
			} else if (Session.get('currentTool') === 'js_tool_conversation') {
				$('.content.two, .js_toolbox_three').show();
				$('.content.three').hide();
				$('.js_tool_conversation').addClass('js_tool_current active');
			} else if (Session.get('currentTool') === 'js_tool_process') {
				$('.content.three, .js_toolbox_three').show();
				$('.content.two').hide();
				$('.js_tool_process').addClass('js_tool_current active');
			}
		}
	});

});

Template.layout.events({

	'focus .js_search_input': function(e) {
		$(e.target).parent().find('.js_search_icon').addClass('focus')
		$(e.target).parent().find('.js_search_clear').addClass('focus')
	},

	'blur .js_search_input': function(e) {
		$(e.target).parent().find('.js_search_icon').removeClass('focus')
		$(e.target).parent().find('.js_search_clear').removeClass('focus')
	},

	'click .js_tool': function(e) {

		$('.js_tool').removeClass('js_tool_current active');
		$(e.target).addClass('js_tool_current active');

		if ($(window).width() < 640) {
			$('.content.two, .placeholder_overlay').addClass('hide');
		}
		$('.js_sheet_action').slideUp(100);
	},

	'click .js_img_upload': function(e) {
		$('.js_image_edit').slideToggle(200, function() {
			$('.js_image_box').fadeToggle(100);
		});
	},

	'click .js_label': function(e) {
		var parent = $(e.currentTarget).parent()
		var data_value = $(parent).find('.js_input_label').val();
		var option = $(parent).find('[data-value="' + data_value + '"]');

		$('.js_check').hide();
		$(option).find('.js_check').show();
		$('.js_select').fadeOut(100);
		$(parent).find('.js_select').fadeToggle(100);

		if (!$(e.target).hasClass('js_conversation_label')) {
			var parent_offset = $(parent).offset().top
			var option_position = $(option).position().top - 1;

			if ((parent_offset - option_position) < 100) {
				$(parent).find('.js_select').css('top', 0 - parent_offset + 106);
			} else {
				$(parent).find('.js_select').css('top', 0 - option_position);
			}
		}
	},

	'click .js_option': function(e) {
		var data_value = $(e.target).attr('data-value');
		$(e.target).parentsUntil('.js_input').find('.js_label_txt').html(data_value);
		$(e.target).parentsUntil('.js_input').find('.js_input_label').val(data_value);
	},

	'keydown .js_label_custom_input': function(e) {
		var code = e.keyCode || e.which;
		if (code == 9 || code == 13) {
			e.preventDefault();
			$(e.target).focus();
			return false;
		}
	},

	'keyup .js_label_custom_input': function(e) {
		var value = $(e.target).val();
		var label = $(e.target).parentsUntil('.js_input').parent().find('.js_label_custom');
		var code = e.keyCode || e.which;

		if (code == 13 && value) {
			e.preventDefault();
			$(label).find('a').click();
		}

		if (code == 9 || code == 13) {
			e.preventDefault();
			$(e.target).focus();
			return false;
		} else if (code == 8 && value.length == 0) {
			$(label).hide();
		} else {
			$(label).find('a').html(value + '<span class="js_check fl_right hide">&#10003;</span>').attr('data-value', value);
			$(label).show();
		}
	},

	'click': function(e) {
		if (!$(e.target).hasClass('js_time_select')) {
			if (!$(e.target).hasClass('js_time_drop_option')) {
				if (!$(e.target).hasClass('js_label')) {
					if (!$(e.target).hasClass('js_label_custom_input')) {
						$('.js_select').fadeOut(100);
					}
				}
				$('.time_active').removeClass('time_active');
			}
		}
		if (!$(e.target).hasClass('js_tool_controls')) {
			$('.js_sheet_controls').slideUp(100);
		}
		if (!$(e.target).hasClass('js_tool_action')) {
			$('.js_sheet_action').slideUp(100);
		}
		if (!$(e.target).hasClass('js_tool_alpha')) {
			$('.js_sheet_alpha').slideUp(100);
		}
		if (!$(e.target).hasClass('js_tool_tag_alpha')) {
			$('.js_sheet_alpha_tag').slideUp(100);
		}
		if (!$(e.target).hasClass('js_tool_fields')) {
			$('.js_sheet_fields_cover').fadeOut(100);
			$('.js_sheet_fields').slideUp(100);
		}
	},

	'keyup .js_multi_input': function(e) {
		var code = e.keyCode || e.which;
		if (code != 9) {
			var parent = '#' + $(e.target).parentsUntil('.js_paste_input').parent().attr('id');
			var clone = $(e.target).parentsUntil('.js_input').parent().html();
			$(parent).find('.js_input_clear').fadeIn(100);
			$(parent).find('.js_copy_input').removeClass('js_copy_input');
			$(parent).find('.js_multi_input').removeClass('js_multi_input');
			$(parent).append('<div class="js_copy_input js_delete_input js_input input_wrap"></div>');
			$(parent).find('.js_copy_input').append(clone);
		}
	},

	'click .js_input_clear': function(e) {
		e.preventDefault();
		$(e.target).parentsUntil('.js_input').parent().remove();
	},

	'keyup .js_date_input': function(e) {
		var value = $(e.target).val();
		var valid = moment(value).isValid();
		if (valid) {
			$(e.target).removeAttr('style');
		} else {
			$(e.target).css('border-color', '#fe2525');
		}
	},

	'click .js_tool_controls': function(e) {
		$('.js_sheet_action').slideUp(100);
		$('.js_sheet_alpha').slideUp(100);
		$('.js_sheet_alpha_tag').slideUp(100);
		$('.js_sheet_fields_cover').fadeOut(100);
		$('.js_sheet_fields').slideUp(100);
		$('.js_sheet_controls').slideToggle(100);
	},

	'click .js_tool_action': function(e) {
		$('.js_sheet_controls').slideUp(100);
		$('.js_sheet_alpha').slideUp(100);
		$('.js_sheet_alpha_tag').slideUp(100);
		$('.js_sheet_fields_cover').fadeOut(100);
		$('.js_sheet_fields').slideUp(100);
		$('.js_sheet_action').slideToggle(100);
	},

	'click .js_tool_alpha': function(e) {
		if (!$(e.target).hasClass('inactive')) {
			$('.js_sheet_action').slideUp(100);
			$('.js_sheet_controls').slideUp(100);
			$('.js_sheet_alpha_tag').slideUp(100);
			$('.js_sheet_fields_cover').fadeOut(100);
			$('.js_sheet_fields').slideUp(100);
			$('.js_sheet_alpha').slideToggle(100);
		}
	},

	'click .js_tool_tag_alpha': function(e) {
		if (!$(e.target).hasClass('inactive')) {
			$('.js_sheet_action').slideUp(100);
			$('.js_sheet_controls').slideUp(100);
			$('.js_sheet_alpha').slideUp(100);
			$('.js_sheet_fields_cover').fadeOut(100);
			$('.js_sheet_fields').slideUp(100);
			$('.js_sheet_alpha_tag').slideToggle(100);
		}
	},

	'click .js_tool_fields': function(e) {
		if (!$(e.target).hasClass('inactive')) {
			$('.js_sheet_action').slideUp(100);
			$('.js_sheet_controls').slideUp(100);
			$('.js_sheet_alpha').slideUp(100);
			$('.js_sheet_alpha_tag').slideUp(100);
			$('.js_sheet_fields_cover').fadeToggle(100);
			$('.js_sheet_fields').slideToggle(100);
		}
	},

	'click .js_remove_contact': function(e) {
		e.preventDefault();

		var tag = TagSelect.findOne()
		if (tag.milestoneTagType) {
			var tag_ids = [tag.tagId]
		} else if (tag.processTagType) {
			var tag_ids = tag.hasTags
			tag_ids.push(tag.tagId)
		} else {
			var tag_ids = [tag.tagId]
		}

		var contacts = ContactSelect.find().fetch();

		var contact_ids = []
		for (var i = 0; i < contacts.length; i++) {
			contact_ids.push(contacts[i].contactId)
		}

		Meteor.call('removeFromTag', tag_ids, contact_ids, function(error, result) {
			if (error) {
				return alert(error.reason);
			} else {
				Session.set({
					contactScrollDir: 'up',
					contactPivotNameLast: '',
					contactPivotId: '',
					currentTag: 'all_contacts_tag',
					currentContact: '',
					currentNameLast: ''
				});
				Router.go('/info/tag/' + Session.get('currentTag'))
			}
		});
	 },

	'click .js_delete_contact': function(e) {
		e.preventDefault();

		var contactSelect = ContactSelect.find();
		var contact_ids = []
		contactSelect.forEach(function(contactSelect) {
			contact_ids.push(contactSelect.contactId)
		});

		Meteor.call('contactRemove', contact_ids, function(error, result) {
			if (error) {
				return alert(error.reason);
			} else {
				Session.set({
					contactScrollDir: 'up',
					contactPivotNameLast: '',
					contactPivotId: '',
					currentTag: 'all_contacts_tag',
					currentContact: '',
					currentNameLast: ''
				});
				Router.go('/info/tag/' + Session.get('currentTag'));
			}
		});
	},

	'click .js_delete_conversation': function(e) {
		e.preventDefault();

		var conversationSelect = ConversationSelect.find();
		var conversation_ids = []
		conversationSelect.forEach(function(conversationSelect) {
			conversation_ids.push(conversationSelect.conversationId)
		});

		Meteor.call('conversationRemove', Session.get('currentContact'), conversation_ids, function(error, result) {
			if (error) {
				return alert(error.reason);
			} else {
				Session.set({conScrollDir: 'up', conPivotId: '', conPivotDate: ''});
				Router.go('/info/contact/' + Session.get('currentContact'));
			}
		});
	},

	'click .js_delete_tag': function(e) {
	 	e.preventDefault();

 		var tagSelect = TagSelect.find();
 		var tag_ids = []
 		tagSelect.forEach(function(tagSelect) {
 			tag_ids.push(tagSelect.tagId)
 		});

 		Meteor.call('tagRemove', tag_ids, function(error, result) {
 			if (error) {
 				return alert(error.reason);
 			} else {
 				Session.set({currentTag: 'all_contacts_tag', tagScrollDir: 'up', tagPivotId: '', tagPivotName: ''});
 				Router.go('/list/tags');
 			}
 		});
	  }

})
