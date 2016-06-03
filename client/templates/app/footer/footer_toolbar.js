Template.footerToolbar.onRendered(function() {

});

Template.footerToolbar.events({
	'click .js_tool_tags': function(e) {
		e.preventDefault();

		if (!Session.get('currentContact')) {
			Session.set('currentContact', $('.js_contact_list').find('.js_contact_list_item:first').attr('id'))
			Session.set('currentNameLast', $('.js_contact_list').find('.js_contact_list_item:first').attr('data-name-last'))
		}

		if (Session.get('currentTag') === 'all_contacts_tag') {
			var tag = 'all_contacts_tag'
		} else {
			var tag = Tags.findOne(Session.get('currentTag'))
		}

		if (!tag || tag === 'all_contacts_tag' || tag.standardTagType || tag.reminderTagType || tag.processTagType && Router.current().route.getName() === 'tagListProcess') {
			Session.set({tagScrollDir: 'middle', tagPivotId: Session.get('currentTag'), tagPivotName: Session.get('currentTagName'), tagPivotOffset: ''});
			Router.go('/list/tags');
		} else if (tag.milestoneTagType) {
			Router.go('/list/process/tags/' + tag.belongs_to);
		} else if (tag.processTagType && Router.current().route.getName() === 'tagInfo') {
			Router.go('/list/process/tags/' + tag._id);
		}
	},

	'click .js_tool_list': function(e) {
		e.preventDefault();

		if (!$(e.target).hasClass('js_tool_current')) {
			$('.js_contact_list').addClass('disable_scrolling');
			$('.js_contact_list').css('left', "10000px");

			var contactPivotNameLast = Session.get('currentNameLast');
			var contactPivotId = Session.get('currentContact');

			Session.set({contactScrollDir: 'middle', contactPivotNameLast: contactPivotNameLast, contactPivotId: contactPivotId});

			if (Session.get('milestoneTag')) {
				Router.go('/info/tag/' + Session.get('milestoneTag'))
			} else {
				Router.go('/info/tag/' + Session.get('currentTag'))
			}
		}
	},

	'click .js_tool_search': function(e) {
		e.preventDefault()
		if (!$(e.target).hasClass('js_tool_current')) {
			$('.js_tool_list').hide();
			$('.js_tool').removeClass('js_tool_current active');
			$('.js_tool_search').addClass('js_tool_current active').show();

			var searchText = $('.js_search_input').val()
			Router.go('/search/' + encodeURI(searchText))
		}
	},

	'click .js_tool_profile': function(e) {
		e.preventDefault();
		$('.content.two, .content.three, .js_conversation_search, .js_tag_search').hide();
		$('.js_profile_toolbar, .js_contact_info, .js_contact_search').show();
		Session.set('currentTool', 'js_tool_profile');
	},

	'click .js_tool_conversation': function(e) {
		e.preventDefault();
		$('.js_profile_toolbar, .js_contact_info, .content.three, .js_contact_search, .js_tag_search').hide();
		$('.content.two, .js_conversation_search').show();
		Session.set('currentTool', 'js_tool_conversation');
	},

	'click .js_tool_process': function(e) {
		e.preventDefault();
		$('.js_profile_toolbar, .js_contact_info, .content.two, .js_conversation_search, .js_tag_search').hide();
		$('.content.three, .js_contact_search').show();
		Session.set('currentTool', 'js_tool_process');
	},


});
