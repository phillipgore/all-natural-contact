Template.tagInfo.onRendered(function() {
	//Bottom toolbar tool hide/show
	$('.js_tool').removeClass('js_tool_current active');
	$('.js_tool_list').addClass('js_tool_current active');

	$('.js_tool_profile, .js_tool_conversation, .js_tool_process').hide();
	$('.js_tool_profile_disabled, .js_tool_conversation_disabled, .js_tool_process_disabled').show();

	//Set currently selected contact if not already set
	if (Session.get('currentContact')) {
		var contactId = Session.get('currentContact');
		var contactSelect = Contacts.findOne({_id: contactId});
		ContactSelect.remove({});
		ContactSelect.insert({
			contactId: contactId,
			first: contactSelect.first,
			last: contactSelect.last,
			nameFirst: contactSelect.nameFirst,
			nameLast: contactSelect.nameLast
		});
		Session.set('currentNameLast', contactSelect.nameLast)
	}

	//Reset and Reveal Infinite Scrolling Contact List.
	this.autorun(function() {
		Template.currentData()

		var currentContacts = $('.js_existing_contact').length
		var checkCurrentContacts = setInterval(function() {
			var reducedContacts = $('.js_existing_contact').length
			if (reducedContacts === 0 || currentContacts > reducedContacts) {
				clearInterval(checkCurrentContacts);

				var checkTaggedCount = setInterval(function() {
					if (TaggedCount.find().count() > 0) {
						clearInterval(checkTaggedCount);

						if (Session.get('currentTag') != 'all_contacts_tag') {
							var currentTag = Tags.findOne(Session.get('currentTag'))
							if (currentTag.milestoneTagType) {
								Session.set('milestoneTag', currentTag._id)
							}

							//Get current tag and tag name
							var tagId = currentTag._id;
							var tagName = currentTag.tagName
							var hasTags = currentTag.has_tags
							var belongsTo = currentTag.belongs_to
							var standardTagType = currentTag.standardTagType
							var processTagType = currentTag.processTagType
							var reminderTagType = currentTag.reminderTagType
							var milestoneTagType = currentTag.milestoneTagType
						}

						//Set currenttly selected tag
						TagSelect.remove({});
						if (Session.get('currentTag') != 'all_contacts_tag') {
							TagSelect.insert({
								tagId: tagId,
								tagName: tagName,
								hasTags: hasTags,
								belongsTo: belongsTo,
								standardTagType: standardTagType,
								processTagType: processTagType,
								reminderTagType: reminderTagType,
								milestoneTagType: milestoneTagType,
							});
						};

						var taggedCount = TaggedCount.findOne().tagged_count
						Session.set('taggedCount', taggedCount)

						if (taggedCount === 0) {
							$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
							$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();

							$('.js_contact_list').css({left: 0, width: 'auto'}).removeClass('disable_scrolling');
							$('.js_loading_top_button, .js_loading_bottom_button').addClass('js_active');

							$('.js_loader, .js_initial_loading_overlay, .js_alpha_clone_top, .js_alpha_clone_bottom').hide();
							$('.js_startup_loader').fadeOut('fast');
						} else {
							//Upper toolbar tool hide/show
							$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit, .icn_delete, .icn_add_to_tag').show();
							$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').hide();

							//Establish if total contact count on the server is above or below 300 and set the expected count.
							if (taggedCount < 300) {
								var expectedContacts = taggedCount;
							} else {
								var expectedContacts = 300;
							}

							//Establish the number of contacts actually recieved
							var checkRecieved = setInterval(function() {
								var receivedContacts = Contacts.find({created_on: { $exists: true }}).count()
								if (receivedContacts === expectedContacts) {
									clearInterval(checkRecieved);

									var checkCount = setInterval(function() {
										var visibleCount = $('.js_contact_item').length;

										if (visibleCount === receivedContacts) {
											clearInterval(checkCount);

											//Determine if the first available contact is showing and take action accordingly.
											if (reminderTagType) {
												var topContact = Contacts.find({}, {sort: {latest_conversation_date: 1, nameLast: 1, nameFirst: 1, company: 1}, limit: 1}).fetch();
												var topListContact = Contacts.find({created_on: { $exists: true }}, {sort: {latest_conversation_date: 1, nameLast: 1, nameFirst: 1, company: 1}}).fetch();
											} else {
												var topContact = Contacts.find({}, {sort: {nameLast: 1, nameFirst: 1, company: 1}, limit: 1}).fetch();
												var topListContact = Contacts.find({created_on: { $exists: true }}, {sort: {nameLast: 1, nameFirst: 1, company: 1}}).fetch();
											}

											//"Load more" top blank hide/show.
											if (topContact[0]._id === topListContact[0]._id) {
												$('.js_loading_top').hide()
											} else {
												$('.js_loading_top').show()
											}

											//Determine if the last available contact is showing and take action accordingly.
											if (reminderTagType) {
												var bottomContact = Contacts.find({}, {sort: {latest_conversation_date: -1, nameLast: -1, nameFirst: -1, company: -1}, limit: 1}).fetch();
												var bottomListContact = Contacts.find({created_on: { $exists: true }}, {sort: {latest_conversation_date: -1, nameLast: -1, nameFirst: -1, company: -1}, limit: 1}).fetch();
											} else {
												var bottomContact = Contacts.find({}, {sort: {nameLast: -1, nameFirst: -1, company: -1}, limit: 1}).fetch();
												var bottomListContact = Contacts.find({created_on: { $exists: true }}, {sort: {nameLast: -1, nameFirst: -1, company: -1}, limit: 1}).fetch();
											}

											//"Load more" bottom blank hide/show.
											if (bottomContact[0]._id === bottomListContact[0]._id) {
												$('.js_loading_bottom').hide();
											} else {
												$('.js_loading_bottom').show()
											}

											//Set current contact if not already set
											if (!Session.get('currentContact')) {
												var contactSelect = Contacts.findOne();
												Session.set('currentContact', contactSelect._id);

												ContactSelect.remove({});
												ContactSelect.insert({
													contactId: contactSelect._id,
													first: contactSelect.first,
													last: contactSelect.last,
													nameFirst: contactSelect.nameFirst,
													nameLast: contactSelect.nameLast
												});
												Session.set('currentNameLast', contactSelect.nameLast)
											}

											//Retrieve scrolling variables and take action accordingly.
											var contactScrollDir = Session.get('contactScrollDir');
											var contactPivotId = Session.get('contactPivotId');
											var contactPivotOffset = Session.get('contactPivotOffset');

											if (contactPivotId) {
												var pivotExists = $('.js_contact_list').find('#' + contactPivotId).length
												if (pivotExists < 1) {
													var contactPivotId = ''
												}
											}

											//Find first contact starting with the letter of the pivotContact on an Alpha scroll.
											if (contactScrollDir === 'alpha') {
												var contactPivotId = $('.js_contact_list_item[data-name-last^='+ Session.get('contactPivotNameLast') +']:first').attr('id')
											}

											//Constrain the contact list width to it's future width prior to scroll.
											$('.js_contact_list').width($('.content.one').width()).scrollTop(0);

											//Determine the scrollTop based on the provided scrolling variables.
											if (contactPivotId) {
												var contactPivotTop = $('.js_contact_list').find('#' + contactPivotId).offset().top
												if (contactScrollDir === 'up' || contactScrollDir === 'middle') {
													var listPos = contactPivotTop - 150
												} else if (contactScrollDir === 'alpha') {
													var listPos = contactPivotTop - 100
												} else {
													var adjust = contactPivotOffset - $('#' + contactPivotId).outerHeight();
													var listPos = contactPivotTop - adjust;
												}
											} else {
												var listPos = 0;
											}

											//Reset and reveal the contact list based on the provided scrolling variables.
											$('.js_contact_list').scrollTop(listPos);
											$('#' + Session.get('currentContact')).addClass('js_current active');
											Session.set('updateRoute', '/update/contact/' + Session.get('currentContact'));

											$('.js_contact_list').css({left: 0, width: 'auto'}).removeClass('disable_scrolling');
											$('.js_tool_alpha').removeClass('js_active');
											$('.js_loading_top_button, .js_loading_bottom_button').addClass('js_active');

											$('.js_loader, .js_initial_loading_overlay, .js_alpha_clone_top, .js_alpha_clone_bottom').hide();
											$('.js_startup_loader').fadeOut('fast');

										}
									}, 300)
								}
							}, 300)
						}
					}
				}, 300)
			}
		}, 300)
	});

	$('.js_contact_list').on('scroll', function() {
		var scrollHeight = $(this).outerHeight();
		var topPos = $('.js_loading_top').offset().top - 100;
		var bottomPos = $('.js_loading_bottom').offset().top -50;

		if (topPos === 0 && $('.js_loading_top_button').hasClass('js_active')) {
			$('.js_contact_list_item').addClass('js_existing_contact')
			$('.js_loading_top_button').click();
		}

		if (scrollHeight === bottomPos && $('.js_loading_bottom_button').hasClass('js_active')) {
			$('.js_contact_list_item').addClass('js_existing_contact')
			$('.js_loading_bottom_button').click();
		}
	});
}),



Template.tagInfo.helpers({
	tag: function() {
		return Tags.findOne({_id: Session.get('currentTag')})
	},

	contacts: function() {
		return Contacts.find({created_on: { $exists: true }}, {sort: {nameLast: 1, nameFirst: 1, company: 1}})
	},

	allContacts: function() {
		if (Session.get('currentTag') === 'all_contacts_tag') {
			return true;
		} else {
			return false;
		}
	},

	contactsScroll: function() {
		return InfiniteScroll.find({}, {sort: {nameLast: 1, nameFirst: 1, company: 1}});
	},

	taggedCount: function() {
		if (Contacts.find({created_on: { $exists: true }}).count() > 0) {
			return true;
		} else {
			return false;
		}
	},

	alphaTool: function() {
		if (Session.get('taggedCount') >= 300) {
			return true;
		} else {
			return false;
		}
	}

});



Template.tagInfo.events({
	'click .js_loading_top_button': function(e) {

		//Disable contact list scrolling and loading.
		$('.js_loading_top_button, .js_loading_bottom_button').removeClass('js_active');

		//Store currently viewable contacts for loading clone.
		InfiniteScroll.remove({});
		if (Session.get('currentTag') != 'all_contacts_tag') {
			var tag = Tags.findOne({_id: Session.get('currentTag')});
			if (tag.reminderTagType) {
					var currentDate = moment();
					var reminderDate = moment().subtract(tag.reminder_time[0].increment, tag.reminder_time[0].period)
					var reminderContacts = Contacts.find({created_on: { $exists: true }}, {sort: {latest_conversation_date: 1, nameLast: 1, nameFirst: 1, company: 1}, limit: 50}).fetch()

					var contacts = []
					for (var i = 0; i < reminderContacts.length; i++) {
						var days_over = reminderDate.diff(reminderContacts[i].latest_conversation_date, 'days');
						if (days_over > 0) {
							var overdue = true;
						} else {
							var overdue = false;
						}
						var overdue_by = currentDate.diff(reminderContacts[i].latest_conversation_date, 'days');
						if (moment(reminderContacts[i].latest_conversation_date).isSame('1776-07-04', 'year')) {
							var overdue_by = 'never'
						} else {
							var overdue_by = moment.duration(overdue_by, "days").humanize();
						}

						reminderContacts[i].overdue = overdue;
						reminderContacts[i].overdue_by = overdue_by;
					};

					for (i = 0; i < reminderContacts.length; i++) {
						InfiniteScroll.insert({
							first: reminderContacts[i].first,
							last: reminderContacts[i].last,
							nameFirst: reminderContacts[i].nameFirst,
							nameLast: reminderContacts[i].nameLast,
							company: reminderContacts[i].company,
							is_company: reminderContacts[i].is_company,
							latest_conversation_date: reminderContacts[i].latest_conversation_date,
							overdue: reminderContacts[i].overdue,
							overdue_by: reminderContacts[i].overdue_by,
						});
					};
			} else {
				var contacts = Contacts.find({created_on: { $exists: true }}, {sort: {nameLast: 1, nameFirst: 1, company: 1}, limit: 50}).fetch()
				for (i = 0; i < contacts.length; i++) {
					InfiniteScroll.insert({
						first: contacts[i].first,
						last: contacts[i].last,
						nameFirst: contacts[i].nameFirst,
						nameLast: contacts[i].nameLast,
						company: contacts[i].company,
						is_company: contacts[i].is_company,
					});
				};
			}
		} else {
			var contacts = Contacts.find({created_on: { $exists: true }}, {sort: {nameLast: 1, nameFirst: 1, company: 1}, limit: 50}).fetch()
			for (i = 0; i < contacts.length; i++) {
				InfiniteScroll.insert({
					first: contacts[i].first,
					last: contacts[i].last,
					nameFirst: contacts[i].nameFirst,
					nameLast: contacts[i].nameLast,
					company: contacts[i].company,
					is_company: contacts[i].is_company,
				});
			};
		}

		//Reveal loading overlays and move contact list offscreen.
		$('.js_loader, .js_alpha_clone_top').show();
		$('.js_contact_list').addClass('disable_scrolling').css('left', "10000px").scrollTop(0);

		//Set contact scrolling variables
		var contactPivotOffset = $('.js_contact_list').height();
		var contactPivotId = $('.js_contact_list_item:first').attr('id');
		var contactPivotNameLast = $('.js_contact_list_item:first').attr('data-name-last');

		Session.set({contactScrollDir: 'up', contactPivotId: contactPivotId, contactPivotNameLast: contactPivotNameLast, contactPivotOffset: contactPivotOffset});
	},

	'click .js_loading_bottom_button': function() {

		//Disable contact list scrolling and loading.
		$('.js_loading_top_button, .js_loading_bottom_button').removeClass('js_active');

		//Store currently viewable contacts for loading clone.
		InfiniteScroll.remove({});
		if (Session.get('currentTag') != 'all_contacts_tag') {
			var tag = Tags.findOne({_id: Session.get('currentTag')});
			if (tag.reminderTagType) {
					var currentDate = moment();
					var reminderDate = moment().subtract(tag.reminder_time[0].increment, tag.reminder_time[0].period)
					var reminderContacts = Contacts.find({created_on: { $exists: true }}, {sort: {latest_conversation_date: 1, nameLast: 1, nameFirst: 1, company: 1}}).fetch().slice(-50)

					var contacts = []
					for (var i = 0; i < reminderContacts.length; i++) {
						var days_over = reminderDate.diff(reminderContacts[i].latest_conversation_date, 'days');
						if (days_over > 0) {
							var overdue = true;
						} else {
							var overdue = false;
						}
						var overdue_by = currentDate.diff(reminderContacts[i].latest_conversation_date, 'days');
						if (moment(reminderContacts[i].latest_conversation_date).isSame('1776-07-04', 'year')) {
							var overdue_by = 'never'
						} else {
							var overdue_by = moment.duration(overdue_by, "days").humanize();
						}

						reminderContacts[i].overdue = overdue;
						reminderContacts[i].overdue_by = overdue_by;
					};

					for (i = 0; i < reminderContacts.length; i++) {
						InfiniteScroll.insert({
							first: reminderContacts[i].first,
							last: reminderContacts[i].last,
							nameFirst: reminderContacts[i].nameFirst,
							nameLast: reminderContacts[i].nameLast,
							company: reminderContacts[i].company,
							is_company: reminderContacts[i].is_company,
							latest_conversation_date: reminderContacts[i].latest_conversation_date,
							overdue: reminderContacts[i].overdue,
							overdue_by: reminderContacts[i].overdue_by,
						});
					};
			} else {
				var contacts = Contacts.find({created_on: { $exists: true }}, {sort: {nameLast: 1, nameFirst: 1, company: 1}}).fetch().slice(-50)
				for (i = 0; i < contacts.length; i++) {
					InfiniteScroll.insert({
						first: contacts[i].first,
						last: contacts[i].last,
						nameFirst: contacts[i].nameFirst,
						nameLast: contacts[i].nameLast,
						company: contacts[i].company,
						is_company: contacts[i].is_company,
					});
				};
			}
		} else {
			var contacts = Contacts.find({created_on: { $exists: true }}, {sort: {nameLast: 1, nameFirst: 1, company: 1}}).fetch().slice(-50)
			for (i = 0; i < contacts.length; i++) {
				InfiniteScroll.insert({
					first: contacts[i].first,
					last: contacts[i].last,
					nameFirst: contacts[i].nameFirst,
					nameLast: contacts[i].nameLast,
					company: contacts[i].company,
					is_company: contacts[i].is_company,
				});
			};
		}

		//Reveal loading overlays and move tag list offscreen.
		$('.js_loader, .js_alpha_clone_bottom').show();
		$('.js_contact_list').addClass('disable_scrolling').css('left', "10000px").scrollTop(0);

		if (!Session.get('currentContact')) {
			Session.set('currentContact', $('.js_contact_list').find('.js_contact_list_item:first').attr('id'))
			Session.set('currentNameLast', $('.js_contact_list').find('.js_contact_list_item:first').attr('data-name-last'))
		}

		//Set contact scrolling variables
		var contactPivotOffset = $('.js_contact_list').height();
		var contactPivotId = $('.js_contact_list_item:last').attr('id');
		var contactPivotNameLast = $('.js_contact_list_item:last').attr('data-name-last');

		Session.set({contactScrollDir: 'down', contactPivotId: contactPivotId, contactPivotNameLast: contactPivotNameLast, contactPivotOffset: contactPivotOffset});
	},

	'click .js_multi_select_current': function(e) {
		e.preventDefault();
		e.stopPropagation();
		var contactId = $(e.target).parent().attr('id');
		var first = $(e.target).parent().attr('data-first');
		var last = $(e.target).parent().attr('data-last');
		var nameFirst = $(e.target).parent().attr('data-name-first');
		var nameLast = $(e.target).parent().attr('data-name-last');
		$('.active').removeClass('active');
		$('.js_current').removeClass('js_current active');
		$('#' + contactId).addClass('js_current active');
		$('.js_tool_list').addClass('js_tool_current active');
		ContactSelect.remove({});
		ContactSelect.insert({contactId: contactId, first: first, last: last, nameFirst: nameFirst, nameLast: nameLast});
		Session.set({
			currentContact: contactId,
			currentNameLast: nameLast,
		});
		Session.set('updateRoute', '/update/contact/' + contactId);
	},

	'click .js_multi_select_single': function(e) {
		e.preventDefault();
		e.stopPropagation();
		var contactId = $(e.target).parent().attr('id');
		var first = $(e.target).parent().attr('data-first');
		var last = $(e.target).parent().attr('data-last');
		var nameFirst = $(e.target).parent().attr('data-name-first');
		var nameLast = $(e.target).parent().attr('data-name-last');
		if (!$(e.target).parent().hasClass('js_current')) {
			var multi = ContactSelect.findOne({contactId: contactId});
			if (multi) {
				ContactSelect.remove({contactId: contactId});
				$('#' + contactId).removeClass('active');
			} else {
				ContactSelect.insert({contactId: contactId, first: first, last: last, nameFirst: nameFirst, nameLast: nameLast});
				$('#' + contactId).addClass('active');
			}
		}
	},

	'click .js_multi_select': function(e) {
		e.preventDefault();
		e.stopPropagation();
		var selectId = '#' + $(e.target).parent().attr('id');

		if ($(selectId).hasClass('js_current')) {
			$('.js_current .js_multi_select_current').click();
		}

		if ($('.js_current').prevAll(selectId).length != 0 ) {
			$(e.target).parent().addClass('js_insert active');
			$('.js_current').prevUntil(selectId).addClass('js_insert active');
			$('.js_insert').each(function() {
				var contactId = $(this).attr('id');
				var first = $(this).attr('data-first');
				var last = $(this).attr('data-last');
				var nameFirst = $(this).attr('data-name-first');
				var nameLast = $(this).attr('data-name-last');

				var multi = ContactSelect.findOne({contactId: contactId});
				if (!multi) {
					ContactSelect.insert({contactId: contactId, first: first, last: last, nameFirst: nameFirst, nameLast: nameLast});
				}
			})

			$(selectId).prevAll().removeClass('js_insert active').addClass('js_remove');
			$('.js_remove').each(function() {
				var contactId = $(this).attr('id');
				ContactSelect.remove({contactId: contactId});
			})
		} else if ($('.js_current').nextAll(selectId).length != 0) {
			$(e.target).parent().addClass('js_insert active');
			$('.js_current').nextUntil(selectId).addClass('js_insert active');
			$('.js_insert').each(function() {
				var contactId = $(this).attr('id');
				var first = $(this).attr('data-first');
				var last = $(this).attr('data-last');
				var nameFirst = $(this).attr('data-name-first');
				var nameLast = $(this).attr('data-name-last');

				var multi = ContactSelect.findOne({contactId: contactId});
				if (!multi) {
					ContactSelect.insert({contactId: contactId, first: first, last: last, nameFirst: nameFirst, nameLast: nameLast});
				}
			})

			$(selectId).nextAll().removeClass('js_insert active').addClass('js_remove');
			$('.js_remove').each(function() {
				var contactId = $(this).attr('id');
				ContactSelect.remove({contactId: contactId});
			})
		}
		$('.js_insert').removeClass('js_insert');
		$('.js_remove').removeClass('js_remove');
	},
});
