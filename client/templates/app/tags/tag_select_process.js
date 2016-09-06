Template.tagSelectProcess.onRendered(function() {
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit, .icn_delete, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag').hide();

	$('.js_tool').removeClass('js_tool_current active');
	$('.js_tool_tags').addClass('js_tool_current active');

	TagSelect.remove({});
	TagSelect.insert({tagId: Session.get('milestoneTag'), tagName: Session.get('milestoneTagName')});
	if (TagSelect.find({tagId: Session.get('currentTag')}).fetch().length === 0) {
		TagSelect.insert({tagId: Session.get('currentTag'), tagName: Session.get('currentTagName')});
	}

	$('#' + Session.get('milestoneTag')).addClass('js_current active');

	$('.js_initial_loading_overlay, .js_loader').hide();
	$('.js_startup_loader').fadeOut('fast');
});

Template.tagSelectProcess.helpers({
	processTag: function() {
		return Tags.findOne({_id: Session.get('currentTag')});
	},

	milestoneTags: function() {
		return Tags.find({belongs_to: Session.get('currentTag')}, {sort: {created_on: 1}});
	},
});

Template.tagSelectProcess.events({
	'click .js_tag_back': function(e) {
		e.preventDefault();

		Session.set({tagScrollDir: 'middle', tagPivotId: Session.get('currentTag'), tagPivotName: Session.get('currentTagName'), tagPivotOffset: ''});

		Router.go('/select/tag');
	},

	'click .js_tag_list_item': function(e) {
		e.preventDefault();
		if (!$(e.target).hasClass('js_multi_select_single') && !$(e.target).hasClass('js_multi_select')) {
			if ($(e.target).hasClass('js_tag_list_item')) {
				var tagId = $(e.target).attr('id');
				var tagName = $(e.target).attr('data-tag-name');
			} else {
				var tagId = $(e.target).parent().attr('id');
				var tagName = $(e.target).parent().attr('data-tag-name');
			}
			$('.active').removeClass('active');
			$('.js_current').removeClass('js_current active');
			$('#' + tagId).addClass('js_current active');
			TagSelect.remove({});
			TagSelect.insert({tagId: tagId, tagName: tagName});
			if (TagSelect.find({tagId: Session.get('currentTag')}).fetch().length === 0) {
				TagSelect.insert({tagId: Session.get('currentTag'), tagName: Session.get('currentTagName')});
			}
			Session.set('milestoneTag', tagId);
			Session.set('milestoneTagName', tagName);
		}
	},

	'click .js_multi_select_single': function(e) {
		e.preventDefault();
		if ($('.js_current').hasClass('js_process_tag_item')) {
			$(e.target).parent().find('.js_multi_select_current').click();
		} else {
			var tagId = $(e.target).parent().attr('id');
			var tagName = $(e.target).parent().attr('data-tag-name');
			if (!$(e.target).parent().hasClass('js_current')) {
				var multi = TagSelect.findOne({tagId: tagId});
				if (multi) {
					TagSelect.remove({tagId: tagId});
					if (TagSelect.find({tagId: Session.get('currentTag')}).fetch().length === 0) {
						TagSelect.insert({tagId: Session.get('currentTag'), tagName: Session.get('currentTagName')});
					}
					$('#' + tagId).removeClass('active');
				} else {
					TagSelect.insert({tagId: tagId, tagName: tagName});
					if (TagSelect.find({tagId: Session.get('currentTag')}).fetch().length === 0) {
						TagSelect.insert({tagId: Session.get('currentTag'), tagName: Session.get('currentTagName')});
					}
					$('#' + tagId).addClass('active');
				}
			}
		}
	},

	'click .js_multi_select': function(e) {
		e.preventDefault();
		if ($('.js_current').hasClass('js_process_tag_item')) {
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
					if (TagSelect.find({tagId: Session.get('currentTag')}).fetch().length === 0) {
						TagSelect.insert({tagId: Session.get('currentTag'), tagName: Session.get('currentTagName')});
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
					if (TagSelect.find({tagId: Session.get('currentTag')}).fetch().length === 0) {
						TagSelect.insert({tagId: Session.get('currentTag'), tagName: Session.get('currentTagName')});
					}
				})

				$(selectId).nextAll().removeClass('js_insert active').addClass('js_remove');
				$('.js_remove').each(function() {
					var tagId = $(this).attr('id');
					TagSelect.remove({tagId: tagId});
					if (TagSelect.find({tagId: Session.get('currentTag')}).fetch().length === 0) {
						TagSelect.insert({tagId: Session.get('currentTag'), tagName: Session.get('currentTagName')});
					}
				})
			}
			$('.js_insert').removeClass('js_insert');
			$('.js_remove').removeClass('js_remove');
		}
	}
});
