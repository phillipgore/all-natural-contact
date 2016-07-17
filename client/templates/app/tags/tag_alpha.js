Template.tagAlpha.helpers({

	tagRoute: function() {
		if (Session.get('currentRoute') === 'tagList') {
			return true;
		} else {
			return false;
		}
	},

});


Template.tagAlpha.events({
	'click .js_tool_lettered': function(e) {
		e.preventDefault();
		$('.js_tag_list_item').addClass('js_existing_tag')

		//Retrive alpha find variables and take action accordingly.
		var findLetter = $(e.target).attr('id');
		var localCount = $('.js_tag_list_item[data-tag-name^="' + findLetter + '"]').length;
		var serverCount = Counts.get(findLetter + 'TagCount');

		//Compare the local tag count to the server tag count
		if (localCount === serverCount) {
			//If the comparrison is equal simply scroll to the first tag that begins with the find letter.
			var scrollTo = $('.js_tag_list_item[data-tag-name^="' + findLetter + '"]:first');
			$('.js_tag_list').scrollTo(scrollTo, 300);
		} else {
			//If the comparrison is unequal and the find letter is active retrieve new tags based on the find letter
			if (!$(e.target).hasClass('inactive')) {

				//Disable tag list scrolling and loading.
				$('.js_loading_top_button, .js_loading_bottom_button').removeClass('js_active');
				$('.js_tag_list').addClass('disable_scrolling');

				//Reveal loading overlays and move tag list offscreen.
				$('.js_loader, .js_initial_loading_overlay').show();
				$('.js_tag_list').css('left', "10000px");

				//Establish an alphabet object.
				var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ]

				//Determine the first letter of the first tag.
				var i = 0, count = 0;
				while (count === 0) {
					var firstLetter = alphabet[i];
					var count = Counts.get(alphabet[i] + 'TagCount');
					i++;
				}

				//Compare the find letter to the first letter.
				if (findLetter === firstLetter) {
					//If the find letter and first letter are the same.
					Session.set({tagScrollDir: 'up', tagPivotId: '', tagPivotName: '', tagPivotOffset: ''});
				} else {
					//If the find letter and first letter are different.
					Session.set({tagScrollDir: 'alpha', tagPivotId: '', tagPivotName: findLetter, tagPivotOffset: ''});
				}
			}
		}
	},

	'click .js_tool_current': function(e) {
		e.preventDefault();
		$('.js_tag_list_item').addClass('js_existing_tag')

		//Retrive alpha find variable and take action accordingly.
		var findLetter = Session.get('currentTagName').charAt(0);;

		//Establish an alphabet object.
		var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ]

		//Determine the first letter of the first tag.
		var i = 0, count = 0;
		while (count === 0) {
			var firstLetter = alphabet[i];
			var count = Counts.get(alphabet[i] + 'TagCount');
			i++;
		}

		//Retrive variables based on the first letter and take action accordingly.
		var localCount = $('.js_tag_list_item[data-tag-name^="' + firstLetter + '"]').length;
		var serverCount = Counts.get(firstLetter + 'TagCount');
		var localFindCount = $('.js_tag_list_item[data-tag-name^="' + findLetter + '"]').length;
		var serverFindCount = Counts.get(findLetter + 'TagCount');

		if (Session.get('currentTag') === 'all_contacts_tag' && localCount === serverCount) {
			$('.js_tag_list').scrollTo({top: 0, left: 0}, 300, {offset: {top: -50, left: 0}});
		} else if (localFindCount === serverFindCount) {
			var scrollTo = $('.js_tag_list_item[data-tag-name="' + Session.get('currentTagName') + '"]:first');
			$('.js_tag_list').scrollTo(scrollTo, 300, {offset: {top: -50, left: 0}});
		} else {
			$('.js_loading_top_button, .js_loading_bottom_button').removeClass('js_active');
			$('.js_tag_list').addClass('disable_scrolling');

			$('.js_loader, .js_initial_loading_overlay').show();
			$('.js_tag_list').css('left', "10000px");

			Session.set({tagScrollDir: 'middle', tagPivotId: Session.get('currentTag'), tagPivotName: Session.get('currentTagName'), tagPivotOffset: ''});
		}
	},

	'click .js_tool_all_contacts': function(e) {
		e.preventDefault();
		$('.js_tag_list_item').addClass('js_existing_tag')

		var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ]

		var i = 0, count = 0;
		while (count === 0) {
			var firstLetter = alphabet[i];
			var count = Counts.get(alphabet[i] + 'TagCount');
			i++;
		}

		var localCount = $('.js_tag_list_item[data-tag-name^="' + firstLetter + '"]').length;
		var serverCount = Counts.get(firstLetter + 'TagCount');

		if (localCount === serverCount) {
			$('.js_tag_list').scrollTo({top: 0, left: 0}, 300, {offset: {top: -50, left: 0}});
		} else {
			$('.js_loading_top_button, .js_loading_bottom_button').removeClass('js_active');
			$('.js_tag_list').addClass('disable_scrolling');

			$('.js_loader, .js_initial_loading_overlay').show();
			$('.js_tag_list').css('left', "10000px");

			Session.set({tagScrollDir: 'up', tagPivotId: '', tagPivotName: '', tagPivotOffset: ''});
		}
	},
});
