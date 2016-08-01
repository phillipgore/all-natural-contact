Template.tagNew.onRendered(function() {
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();

	$('.js_toggle').removeClass('selected');
	$('.' + Session.get('tagType')).addClass('selected');

	$('.js_startup_loader').fadeOut('fast');
});

Template.tagNew.events({
	'click .js_toggle': function(e) {
		$('.js_toggle').removeClass('selected');
		$(e.target).addClass('selected');
	},

	'click .js_checkbox_personal_tag': function(e) {
		e.preventDefault();
		$(e.target).toggleClass('unchecked')
		if ($(e.target).find('input').val() === 'open' || $(e.target).find('input').val() === '' ) {
			$(e.target).find('input').val(Meteor.userId());
		} else {
			$(e.target).find('input').val('open');
		}
	},

	'click .js_radiobutton_reminder': function(e) {
		e.preventDefault();
		$('.js_increment').hide();
		$(e.target).parentsUntil('.js_reminder_option').parent().find('.js_increment').show();
		$(e.target).parentsUntil('fieldset').parent().find('.js_radiobutton_reminder').addClass('unselected').find('input').val('false');
		$(e.target).removeClass('unselected').find('input').val('true');
	},

	'submit form': function(e) {
		e.preventDefault();
		$('.js_submit').attr('disabled', 'disabled');
		$('.js_tag_new_submit').text('Saving...').addClass('js_inactive');
		$('.js_initial_loading_overlay').show();

		var date = new Date();
		var tag = $(e.target).find('[name=tag]').val().trim();
		var personalTag = $(e.target).find('[name=personal_tag]').val().trim();
		var standardTagType = $(e.target).find('[name=standard_tag_type]').val().trim() == "true";
		var reminderTagType = $(e.target).find('[name=reminder_tag_type]').val().trim() == "true";
		var processTagType = $(e.target).find('[name=process_tag_type]').val().trim() == "true";
		var milestoneTagType = $(e.target).find('[name=milestone_tag_type]').val().trim() == "true";
		var comboTagName = tag.toLowerCase().replace(/\s/g,'');

		if (tag.length === 0) {
			var comboTagName = "aaaaaaaa";
		}

		if (reminderTagType) {
			var selected = $('.js_toggle_reminder').find('.js_period[value="true"]');
			var entries = []
			$('.js_reminder_entries').find('.js_entries').each(function() {
				if ($(this).find('input').val().trim() == "true") {
					entries.push($(this).attr('data-label-name'))
				}
			})
			var reminderProperties = [{
				increment: parseInt($(selected).parentsUntil('.js_reminder_option').parent().find('.js_increment').val()),
				period: $(selected).attr('id'),
				entries: entries
			}]
		}

		if (processTagType) {
			var milestoneProperties = []
			$(e.target).find('#milestone').find('.js_input').each(function() {
				if ($(this).val().length) {
					var milestone = {
						tag: $(this).val(),
						tagName: $(this).val().toLowerCase().replace(/\s/g,'') + date.getTime().toString(),
						personal: personalTag,
						standardTagType: false,
						reminderTagType: false,
						processTagType: false,
						milestoneTagType: true
					}
					milestoneProperties.push(milestone)
				}
			});
		}

		var tagProperties = {
			tag: tag,
			tagName: comboTagName + date.getTime().toString(),
			personal: personalTag,
			standardTagType: standardTagType,
			reminderTagType: reminderTagType,
			processTagType: processTagType,
			milestoneTagType: milestoneTagType,
			reminder_time: reminderProperties
		};

		Meteor.call('tagInsert', tagProperties, milestoneProperties, function(error, result) {
			if (error) {
				return alert(error.reason);
			} else {
				if ($(e.target).hasClass('js_plus')) {
					$('.js_reset').click();
					$('#tag').focus();
					Session.set('currentTag', result._id);
					$('.js_plus').removeClass('js_plus');
				} else {
					Session.set({currentTag: result._id, tagScrollDir: 'middle', tagPivotId: result._id, tagPivotName: tag.tagName});
					Router.go('/list/tags');
				}
			}
   		});
   	},

});
