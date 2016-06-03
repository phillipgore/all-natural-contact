Template.tagListProcess.onRendered(function() {
	var tagId = Session.get('currentTag')
	var milestoneTagId = Session.get('milestoneTag')
	
	Session.set({
		currentTagName: Tags.findOne({_id: tagId}).tagName,
		currentHasTags: Tags.findOne({_id: tagId}).has_tags,
		milestoneTagName: Tags.findOne({_id: milestoneTagId}).tagName,
	});
	
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit, .icn_delete, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag').hide();
	
	$('.js_tool').removeClass('js_tool_current active');
	$('.js_tool_tags').addClass('js_tool_current active');
	
	TagSelect.remove({});
	TagSelect.insert({tagId: Session.get('currentTag'), tagName: Session.get('currentTagName'), hasTags: Session.get('currentHasTags')});
	
	
	$('#' + Session.get('milestoneTag')).addClass('js_current active');
		
	$('.js_initial_loading_overlay, .js_loader').hide();
	$('.js_startup_loader').fadeOut('fast');
});

Template.tagListProcess.helpers({
	processTag: function() {
		var recievedTag = Tags.findOne({_id: Session.get('currentTag')});
		if (recievedTag.personal === 'open') {
			var personal = false;
		} else {
			var personal = true;
		}
		var processTag ={
			_id: recievedTag._id,
			tag: recievedTag.tag,
			tagName: recievedTag.tagName,
			personal: personal
		}
		
		return processTag
	},
	
	milestoneTags: function() {
		var recievedTags = Tags.find({belongs_to: Session.get('currentTag')}, {sort: {created_on: 1}});
		var milestoneTags =[]
		recievedTags.forEach(function(recievedTags) {
			if (recievedTags.personal === 'open') {
				var personal = false;
			} else {
				var personal = true;
			}
			var tagUpdate = {
				_id: recievedTags._id,
				tag: recievedTags.tag,
				tagName: recievedTags.tagName,
				personalTag: personal
			}
			milestoneTags.push(tagUpdate)
		});
		
		return milestoneTags
	},
});

Template.tagListProcess.events({
	'click .js_tag_back': function(e) {
		e.preventDefault();
		
		Session.set({tagScrollDir: 'middle', tagPivotId: Session.get('currentTag'), tagPivotName: Session.get('currentTagName'), tagPivotOffset: ''});
		
		Router.go('/list/tags');
	},
		
	'click .js_process_tag_item, click .js_tag_item': function(e) {
		e.preventDefault();
		
		$('.js_tool').removeClass('js_tool_current active');
		$('.js_tool_list').addClass('js_tool_current active');
		
		var tagId = $(e.target).attr('id');
		var tagName = $(e.target).attr('data-tag-name');
		Session.set({
			milestoneTag: tagId,
			milestoneTagName: tagName,
		});
		
		$('.js_loading_top_button, .js_loading_bottom_button').removeClass('js_active');
		$('.js_alpha_list').addClass('disable_scrolling');
		$('.js_alpha_list').css('left', "10000px");

		var contactPivotId = Session.get('currentContact');
		var contactPivotName = Session.get('currentNameLast');
		
		Session.set({scrollDir: 'up', contactPivotId: contactPivotId, contactPivotName: contactPivotName, contactPivotOffset: ''});
		Router.go('/info/tag/' + Session.get('milestoneTag'))
	},
	
	'click .js_multi_select_current': function(e) {
		e.preventDefault();
		e.stopPropagation();
		var tagId = $(e.target).parent().attr('id');
		var tagName = $(e.target).parent().attr('data-tag-name');
		Session.set({
			milestoneTag: tagId,
			milestoneTagName: tagName,
		});
		$('.active').removeClass('active');
		$('.js_current').removeClass('js_current active');
		$('#' + tagId).addClass('js_current active');
		$('.js_tool_tags').addClass('js_tool_current active');
		$('.icn_delete, .icn_edit').show();
		$('.icn_delete_disabled, .icn_edit_disabled').hide();
		TagSelect.remove({});
		TagSelect.insert({tagId: tagId, tagName: tagName});
	},
	
	'click .js_multi_select_single': function(e) {
		e.preventDefault();
		e.stopPropagation();
		if ($('.js_current').hasClass('js_process_tag_item')) {
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
		$('.icn_delete, .icn_edit').show();
		$('.icn_delete_disabled, .icn_edit_disabled').hide();
	},
	
	'click .js_multi_select': function(e) {
		e.preventDefault();
		e.stopPropagation();
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
		$('.icn_delete, .icn_edit').show();
		$('.icn_delete_disabled, .icn_edit_disabled').hide();
	}
});








