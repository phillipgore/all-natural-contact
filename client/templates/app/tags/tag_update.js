Template.tagUpdate.onRendered(function() {
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();

	$('#tag').focus();
	$('.js_startup_loader').fadeOut('fast');
});

Template.tagUpdate.events({
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
 });
