Template.searchInput.onRendered(function() {

});

Template.searchInput.events({
	'keyup .js_search_input': _.throttle(function(e) {
		e.preventDefault();

		var searchText = $(e.target).val();
		$('.js_tool_list').hide();
		$('.js_tool').removeClass('js_tool_current active');
		$('.js_tool_search').show().addClass('js_tool_current active');
		if (searchText.length > 0) {
			$('.js_search_clear').addClass('js_active');
			Router.go('/search/' + searchText);
		} else {
			if ($('.js_search_clear').hasClass('js_active')) {
				$('.js_search_clear').removeClass('js_active');

				$('.js_tool_search').hide();
				$('.js_tool').removeClass('js_tool_current active');
				$('.js_tool_list').addClass('js_tool_current active').show();

				$('.js_contact_list').addClass('disable_scrolling');
				$('.js_contact_list').css('left', "10000px");

				Session.set({
					contactScrollDir: 'up',
					contactPivotNameLast: '',
					contactPivotId: '',
					currentTag: 'all_contacts_tag',
					currentContact: '',
					currentNameLast: ''
				});
				Router.go('/info/tag/all_contacts_tag')
			}
		}

	}, 1000),

	'click .js_search_clear': function(e) {
		e.preventDefault();

		$('.js_search_input').val('');
		$('.js_search_icon, .js_search_clear').removeClass('focus');

		$('.js_tool_search').hide();
		$('.js_tool').removeClass('js_tool_current active');
		$('.js_tool_list').addClass('js_tool_current active').show();

		if ($(e.target).hasClass('js_active')) {
			$('.js_search_clear').removeClass('js_active');

			$('.js_contact_list').addClass('disable_scrolling');
			$('.js_contact_list').css('left', "10000px");

			Session.set({
				contactScrollDir: 'up',
				contactPivotNameLast: '',
				contactPivotId: '',
				currentTag: 'all_contacts_tag',
				currentContact: '',
				currentNameLast: ''
			});

			Router.go('/info/tag/all_contacts_tag')
		}
	},
});
