Template.tagSelect.onRendered(function() {
	//Bottom toolbar tool hide/show
	$('.js_tool_profile, .js_tool_conversation, .js_tool_process').hide();
	$('.js_tool_profile_disabled, .js_tool_conversation_disabled, .js_tool_process_disabled').show();

	//Upper toolbar tool hide/show
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();

	//Reset and Reveal Infinite Scrolling Tag List.
	this.autorun(function() {
		Template.currentData()

		var checkTagCount = setInterval(function() {
			if (TagCount.find().count() > 0) {
				clearInterval(checkTagCount);
				var tagCount = TagCount.findOne().tag_count;
				Session.set('tagCount', tagCount)

				if (tagCount === 0) {
					$('.js_tag_list').css({left: 0, width: 'auto'}).removeClass('disable_scrolling');
					$('.js_loading_top_button, .js_loading_bottom_button').addClass('js_active');

					$('.js_loader, .js_initial_loading_overlay, .js_alpha_clone_top, .js_alpha_clone_bottom').hide();
					$('.js_startup_loader').fadeOut('fast');
				} else {
					if (tagCount > 0) {
						if (tagCount < 300) {
							var expectedTags = tagCount;
						} else {
							var expectedTags = 300;
						}
					}

					var checkTagRecieved = setInterval(function() {
						var receivedTags = Tags.find({created_on: { $exists: true }}).count();
						if (receivedTags === expectedTags) {
							clearInterval(checkTagRecieved);
							var checkTagCount = setInterval(function() {
								var visibleTagCount = $('.js_tag_list_item').length;

								if (visibleTagCount === receivedTags) {
									clearInterval(checkTagCount);

									//Determine if the first available tag is showing and take action accordingly.
									var topTag = Tags.find({}, {sort: {tagName: 1}, limit: 1}).fetch();
									var topListTag = Tags.find({created_on: { $exists: true }}, {sort: {tagName: 1}, limit: 1}).fetch();

									//All Contacts Tag and "load more" top blank hide/show.
									if (topTag[0]._id === topListTag[0]._id) {
										$('.js_all_tag_item').show();
										$('.js_loading_top').hide();
									} else {
										$('.js_all_tag_item').hide();
										$('.js_loading_top').show();
									}

									//Determine if the last available tag is showing and take action accordingly.
									var bottomTag = Tags.find({}, {sort: {tagName: -1}, limit: 1}).fetch();
									var bottomListTag = Tags.find({created_on: { $exists: true }}, {sort: {tagName: -1}, limit: 1}).fetch();

									//"Load more" bottom blank hide/show.
									if (bottomTag[0]._id === bottomListTag[0]._id) {
										$('.js_loading_bottom').hide();
									} else {
										$('.js_loading_bottom').show();
									}

									//Set current contact if not already set
									var tagSelect = Tags.findOne();
									Session.set('currentTag', tagSelect._id);

									var tagId = Session.get('currentTag');
									var tagName = Session.get('currentTagName');
									var reminderTag = $('#' + Session.get('currentTag')).attr('data-tag-reminder') == "true";

									Session.set({
										currentTag: tagSelect._id,
										currentTagName: tagSelect.tagName,
										reminderTag: tagSelect.reminderTagType,
									});

									TagSelect.remove({});
									TagSelect.insert({
										tagId: tagSelect._id,
										tag: tagSelect.tag,
										tagName: tagSelect.tagName,
										standardTagType: tagSelect.standardTagType,
										reminderTagType: tagSelect.reminderTagType,
										processTagType: tagSelect.processTagType,
										milestoneTagType: tagSelect.milestoneTagType,
									});

									//Retrieve scrolling variables and take action accordingly.
									var tagScrollDir = Session.get('tagScrollDir');
									var tagPivotId = Session.get('tagPivotId');
									var tagPivotOffset = Session.get('tagPivotOffset');

									//Find first tag starting with the letter of the pivotTag on an Alpha scroll.
									if (tagScrollDir === 'alpha') {
										var tagPivotId = $('.js_tag_list_item[data-tag-name^='+ Session.get('tagPivotName') +']:first').attr('id')
									}

									//Constrain the tag list width to it's future width prior to scroll.
									$('.js_tag_list').width($('.content.one').width()).scrollTop(0);

									//Deterine the scrollTop based on the provided scrolling variables.
									if (tagPivotId && tagPivotId != 'all_contacts_tag') {
										var tagPivotTop = $('.js_tag_list').find('#' + tagPivotId).offset().top
										if (tagScrollDir === 'up' || tagScrollDir === 'middle') {
											var listPos = tagPivotTop - 150
										} else if (tagScrollDir === 'alpha') {
											var listPos = tagPivotTop - 100
										} else {
											var adjust = tagPivotOffset - $('#' + tagPivotId).outerHeight();
											var listPos = tagPivotTop - adjust;
										}
									} else {
										var listPos = 0;
									}

									//Reset and reveal the tag list based on the provided scrolling variables.
									$('.js_tag_list').scrollTop(listPos);
									$('#' + Session.get('currentTag')).addClass('js_current active');

									$('.js_tag_list').css({left: 0, width: 'auto'}).removeClass('disable_scrolling');
									$('.js_loading_top_button, .js_loading_bottom_button').addClass('js_active');

									$('.js_loader, .js_initial_loading_overlay, .js_alpha_clone_top, .js_alpha_clone_bottom').hide();
									$('.js_startup_loader').fadeOut('fast');

								}
							}, 300)
						}
					}, 300)
				}
			}
		}, 300);
	});

	$('.js_tag_list').on('scroll', function() {
		var scrollHeight = $(this).outerHeight();
		var topPos = $('.js_loading_top').offset().top - 100;
		var bottomPos = $('.js_loading_bottom').offset().top - 50;

		if (topPos === 0 && $('.js_loading_top_button').hasClass('js_active')) {
			$('.js_loading_top_button').click();
		}

		if (scrollHeight === bottomPos && $('.js_loading_bottom_button').hasClass('js_active')) {
			$('.js_loading_bottom_button').click();
		}
	});
});

Template.tagSelect.helpers({
	tags: function() {
		return Tags.find({created_on: { $exists: true }}, {sort: {tagName: 1}});
	},

	tagsScroll: function() {
		return TagInfiniteScroll.find();
	},

	alphaToolTag: function() {
		if (Session.get('tagCount') >= 300) {
			return true;
		} else {
			return false;
		}
	}
});

Template.tagSelect.events({
	'click .js_loading_top_button': function(e) {

		$('.js_loading_top_button, .js_loading_bottom_button').removeClass('js_active');
		$('.js_tag_list').addClass('disable_scrolling');

		TagInfiniteScroll.remove({});
		var tags = Tags.find({created_on: { $exists: true }}, {sort: {tagName: 1}}).fetch()
		for (i = 0; i < tags.length; i++) {
			TagInfiniteScroll.insert({
				tagId: tags[i]._id,
				tag: tags[i].tag,
				tagName: tags[i].tagName,
				standardTagType: tags[i].standardTagType,
				reminderTagType: tags[i].reminderTagType,
				processTagType: tags[i].processTagType,
				milestoneTagType: tags[i].milestoneTagType,
			});
		};

		$('.js_tag_loader, .js_alpha_clone_top').show();
		$('.js_tag_list').css('left', "10000px").scrollTop(0);

		var tagPivotOffset = $('.js_tag_list').height();
		var tagPivotId = $('.js_tag_list').find('.js_tag_list_item:first').attr('id');
		var tagPivotName = $('.js_tag_list').find('.js_tag_list_item:first').attr('data-tag-name');

		Session.set({tagScrollDir: 'up', tagPivotId: tagPivotId, tagPivotName: tagPivotName, tagPivotOffset: tagPivotOffset});
	},

	'click .js_loading_bottom_button': function() {

		$('.js_loading_top_button, .js_loading_bottom_button').removeClass('js_active');
		$('.js_tag_list').addClass('disable_scrolling');

		TagInfiniteScroll.remove({});
		var tags = Tags.find({created_on: { $exists: true }}, {sort: {tagName: 1}}).fetch()
		for (i = 0; i < tags.length; i++) {
			TagInfiniteScroll.insert({
				tagId: tags[i]._id,
				tag: tags[i].tag,
				tagName: tags[i].tagName,
				standardTagType: tags[i].standardTagType,
				reminderTagType: tags[i].reminderTagType,
				processTagType: tags[i].processTagType,
				milestoneTagType: tags[i].milestoneTagType,
			});
		};

		$('.js_tag_loader, .js_alpha_clone_bottom').show();
		$('.js_tag_list').css('left', "10000px").scrollTop(0);

		var tagPivotOffset = $('.js_tag_list').height();
		var tagPivotId = $('.js_tag_list').find('.js_tag_list_item:last').attr('id');
		var tagPivotName = $('.js_tag_list').find('.js_tag_list_item:last').attr('data-tag-name');

		Session.set({tagScrollDir: 'down', tagPivotId: tagPivotId, tagPivotName: tagPivotName, tagPivotOffset: tagPivotOffset});
	},

	'click .js_tag_list_item': function(e) {
		e.preventDefault()
		var route = $(e.target).attr('href')
		if (route === '#') {
			if (!$(e.target).hasClass('js_multi_select_single') && !$(e.target).hasClass('js_multi_select')) {
				if ($(e.target).hasClass('js_tag_list_item')) {
					var tagId = $(e.target).attr('id');
					var tagName = $(e.target).attr('data-tag-name');
					var reminderTag = $(e.target).attr('data-tag-reminder') == "true";
				} else {
					var tagId = $(e.target).parent().attr('id');
					var tagName = $(e.target).parent().attr('data-tag-name');
					var reminderTag = $(e.target).parent().attr('data-tag-reminder') == "true";
				}

				$('.active').removeClass('active');
				$('.js_current').removeClass('js_current active');
				$('#' + tagId).addClass('js_current active');

				TagSelect.remove({});
				TagSelect.insert({tagId: tagId, tagName: tagName, reminderTag: reminderTag});

				Session.set({
					currentTag: tagId,
					currentTagName: tagName,
					reminderTag: reminderTag,
				});
			}
		} else {
			Router.go(route)
		}
	},

	'click .js_multi_select_single': function(e) {
		e.preventDefault()
		if ($('.js_current').attr('id') == 'all_contacts_tag') {
			$(e.target).parent().find('.js_multi_select_current').click();
		} else {
			var tagId = $(e.target).parent().attr('id');
			var tagName = $(e.target).parent().attr('data-tag-name');
			if (!$(e.target).parent().hasClass('js_current')) {
				var multi = TagSelect.findOne({tagId: tagId});
				if (multi) {
					TagSelect.remove({tagId: tagId});
					$('#' + tagId).removeClass('active');
				} else {
					TagSelect.insert({tagId: tagId, tagName: tagName});
					$('#' + tagId).addClass('active');
				}
			}
		}
	},

	'click .js_multi_select': function(e) {
		e.preventDefault()
		if ($('.js_current').attr('id') == 'all_contacts_tag') {
			$(e.target).parent().find('.js_multi_select_current').click();
		} else {
			var selectId = '#' + $(e.target).parent().attr('id');

			if ($(selectId).hasClass('js_current')) {
				$('.js_current .js_multi_select_current').click();
			}

			if ($('.js_current').prevAll(selectId).length != 0 ) {
				$(e.target).parent().addClass('js_insert active');
				$('.js_current').prevUntil(selectId).addClass('js_insert active');
				$('.js_insert').each(function() {
					var tagId = $(this).attr('id');
					var tagName = $(this).attr('data-tag-name');
					var multi = TagSelect.findOne({tagId: tagId});
					if (!multi) {
						TagSelect.insert({tagId: tagId, tagName: tagName});
					}
				})

				$(selectId).prevAll().removeClass('js_insert active').addClass('js_remove');
				$('.js_remove').each(function() {
					var tagId = $(this).attr('id');
					TagSelect.remove({tagId: tagId});
				})
			} else if ($('.js_current').nextAll(selectId).length != 0) {
				$(e.target).parent().addClass('js_insert active');
				$('.js_current').nextUntil(selectId).addClass('js_insert active');
				$('.js_insert').each(function() {
					var tagId = $(this).attr('id');
					var tagName = $(this).attr('data-tag-name');
					var multi = TagSelect.findOne({tagId: tagId});
					if (!multi) {
						TagSelect.insert({tagId: tagId, tagName: tagName});
					}
				})

				$(selectId).nextAll().removeClass('js_insert active').addClass('js_remove');
				$('.js_remove').each(function() {
					var tagId = $(this).attr('id');
					TagSelect.remove({tagId: tagId});
				})
			}
			$('.js_insert').removeClass('js_insert');
			$('.js_remove').removeClass('js_remove');
		}
	}

});
