Template.userFields.onRendered(function() {
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();
	
	$('.js_startup_loader').hide();
});

Template.userFields.helpers({
	fieldsUser: function() {
		return Meteor.users.findOne(Session.get('updateUser'));
	},
});

Template.userFields.events({
	'click .js_checkbox_fields': function(e) {
		e.preventDefault();
		$(e.target).toggleClass('unchecked')
		if ($(e.target).find('input').val() === 'false' || $(e.target).find('input').val() === '' ) {
			$(e.target).find('input').val('true');
		} else {
			$(e.target).find('input').val('false');
		}
	},
	
	'submit .js_user_fields_update_form': function(e) {
		e.preventDefault();
		$('.js_submit').attr('disabled', 'disabled').text('Updating...');
		$('.js_saving_msg').text('Updating...');
		$('.js_initial_loading_overlay').show();
			
		var fieldProperties = {
			"fields.prefix_field": $(e.target).find('[name=prefix_field]').val() == "true",
			"fields.middle_field": $(e.target).find('[name=middle_field]').val() == "true",
			"fields.suffix_field": $(e.target).find('[name=suffix_field]').val() == "true",
			
			"fields.phonetic_field": $(e.target).find('[name=phonetic_field]').val() == "true",
			"fields.nickname_field": $(e.target).find('[name=nickname_field]').val() == "true",
			"fields.maiden_field": $(e.target).find('[name=maiden_field]').val() == "true",
			
			"fields.job_title_field": $(e.target).find('[name=job_title_field]').val() == "true",
			"fields.department_field": $(e.target).find('[name=department_field]').val() == "true",
			"fields.company_field": $(e.target).find('[name=company_field]').val() == "true",
			
			"fields.phone_field": $(e.target).find('[name=phone_field]').val() == "true",
			"fields.email_field": $(e.target).find('[name=email_field]').val() == "true",
			"fields.url_field": $(e.target).find('[name=url_field]').val() == "true",
			
			"fields.date_field": $(e.target).find('[name=date_field]').val() == "true",
			"fields.related_field": $(e.target).find('[name=related_field]').val() == "true",
			"fields.immp_field": $(e.target).find('[name=immp_field]').val() == "true",
			"fields.address_field": $(e.target).find('[name=address_field]').val() == "true"
		}
		
		Meteor.call('updateFields', Session.get('updateUser'), fieldProperties, function(error, result) {
			if (error) {
				return alert(error.reason);
			} else {
				Router.go('userReturn');  
			}
		});
	}
})