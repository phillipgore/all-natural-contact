Template.contactFields.helpers({	
	contactFields: function() {
		return Meteor.users.findOne(Meteor.userId());
	}
});


Template.contactFields.events({
	'click .js_tool_fields': function(e) {
		e.preventDefault();
		
		if (!$(e.target).hasClass('inactive')) {
			var id = $(e.target).attr('id');
			if (id === 'js_job_title_field' || id === 'js_department_field' || id === 'js_company_field') {
				$('.js_has_profession').show();
			}
			$('.' + id).show();
			$('.js_contact_new_form').scrollTo('.' + id, 300);
			$('.' + id).find('input:visible:first').focus();
			$(e.target).addClass('inactive');
		}
		
		$('.js_sheet_fields_cover').fadeToggle(100);
		$('.js_sheet_fields').slideToggle(100);
	}
});	
	