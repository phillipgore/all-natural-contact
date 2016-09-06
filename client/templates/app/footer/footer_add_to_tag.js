Template.footerAddToTag.events({

	'click .js_add_to_tag_submit': function(e) {
		e.preventDefault();
		$('.js_submit').attr('disabled', 'disabled');
		$('.js_add_to_tag_submit').text('Adding...').addClass('js_inactive');
		$('.js_saving_msg').text('Adding...');
		$('.js_blank_saving').show();

		var tags = TagSelect.find().fetch();

		var tag_ids = []
		for (var i = 0; i < tags.length; i++) {
			tag_ids.push(tags[i].tagId)
		}

		var contacts = ContactSelect.find().fetch();
		var contactPivotId = contacts[0].contactId
		var contactPivotNameLast = contacts[0].nameLast

		var contact_ids = []
		for (var i = 0; i < contacts.length; i++) {
			contact_ids.push(contacts[i].contactId)
		}

		Meteor.call('addToTag', tag_ids, contact_ids, function(error, result) {
			if (error) {
				return alert(error.reason);
			} else {
				$('.js_tool').removeClass('js_tool_current active');
				$('.js_tool_list').addClass('js_tool_current active');

				$('.js_loading_top_button, .js_loading_bottom_button').removeClass('js_active');
				$('.js_alpha_list').addClass('disable_scrolling');
				$('.js_alpha_list').css('left', "10000px");

				Session.set({contactScrollDir: 'middle', contactPivotId: contactPivotId, contactPivotNameLast: contactPivotNameLast});
				if (Session.get('reminderTag')) {
					Router.go('/reminder/info/tag/' + Session.get('currentTag'))
				} else if (Session.get('milestoneTag')) {
					Router.go('/info/tag/' + Session.get('milestoneTag'))
				} else {
					Router.go('/info/tag/' + Session.get('currentTag'))
				}
			}
		});
	},

});
