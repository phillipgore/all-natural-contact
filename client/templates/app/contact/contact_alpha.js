Template.contactAlpha.events({
	'click .js_tool_lettered': function(e) {
		e.preventDefault();
		$('.js_contact_list_item').addClass('js_existing_contact')

		//Retrive alpha find variables and take action accordingly.
		var findLetter = $(e.target).attr('id');
		var localCount = $('.js_contact_list_item[data-name-last^="' + findLetter + '"]').length;
		var serverCount = Counts.get(findLetter + 'Count');

		//Compare the local tag count to the server tag count
		if (localCount === serverCount) {
			//If the comparrison is equal simply scroll to the first tag that begins with the find letter.
			var scrollTo = $('.js_contact_list_item[data-name-last^="' + findLetter + '"]:first');
			$('.js_contact_list').scrollTo(scrollTo, 300);
		} else {
			//If the comparrison is unequal and the find letter is active retrieve new tags based on the find letter
			if (!$(e.target).hasClass('inactive')) {

				//Disable tag list scrolling and loading.
				$('.js_loading_top_button, .js_loading_bottom_button').removeClass('js_active');
				$('.js_contact_list').addClass('disable_scrolling');

				//Reveal loading overlays and move tag list offscreen.
				$('.js_loader, .js_initial_loading_overlay').show();
				$('.js_contact_list').css('left', "10000px");

				//Establish an alphabet object.
				var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ]

				//Determine the first letter of the first contact.
				var i = 0, count = 0;
				while (count === 0) {
					var firstLetter = alphabet[i];
					var count = Counts.get(alphabet[i] + 'Count');
					i++;
				}

				//Compare the find letter to the first letter.
				if (findLetter === firstLetter) {
					//If the find letter and first letter are the same.
					Session.set({contactScrollDir: 'start', contactPivotId: '', contactPivotNameLast: '', contactPivotId: '', contactPivotOffset: ''});
				} else {
					//If the find letter and first letter are different.

					Session.set({contactScrollDir: 'alpha', contactPivotId: '', contactPivotNameLast: findLetter, contactPivotId: '', contactPivotOffset: ''});
				}
			}
		};
	},

	'click .js_tool_current': function(e) {
		e.preventDefault();
		$('.js_contact_list_item').addClass('js_existing_contact')

		var findLetter = Session.get('currentNameLast').charAt(0);;

		var localCount = $('.js_contact_list_item[data-name-last^="' + findLetter + '"]').length;
		var serverCount = Counts.get(findLetter + 'Count');

		if (localCount === serverCount) {
			var scrollTo = $('.js_contact_list_item[data-name-last="' + Session.get('currentNameLast') + '"]:first');
			$('.js_contact_list').scrollTo(scrollTo, 300, {offset: {top: -50, left: 0}});
		} else {
			$('.js_loader, .js_initial_loading_overlay').show();
			$('.js_contact_list').css('left', "10000px");

			Session.set({contactScrollDir: 'middle', contactPivotNameLast: Session.get('currentNameLast'), contactPivotId: Session.get('currentContact')});
		}
	}
})
