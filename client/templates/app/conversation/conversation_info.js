Template.conversationInfo.onRendered(function() {
	Session.set('conversation_ready', '')

	//Reset and Reveal Infinite Scrolling Conversation List.
	this.autorun(function() {
		Template.currentData();

		var currentConversations = $('.js_existing_conversation').length
		var checkCurrentConversations = setInterval(function() {
			var reducedConversations = $('.js_existing_conversation').length
			if (currentConversations > reducedConversations || reducedConversations === 0) {
				clearInterval(checkCurrentConversations);

				var checkConversationCount = setInterval(function() {
					if (ConversationCount.find().count() > 0) {
						clearInterval(checkConversationCount);

						//Establish if total conversation entry count on the server is above or below 300 and set the expected count.
						var conversationCount = ConversationCount.findOne().conversation_count
						Session.set('conversationCount', conversationCount)

						if (conversationCount > 0) {
							if (conversationCount < 300) {
								var expectedConversations = conversationCount;
							} else {
								var expectedConversations = 300;
							}
						}

						//Take action when the number of recieved entries equals the number of expected entries.
						if (conversationCount === 0) {
							$('.js_conversation_list').css({left: 0, width: 'auto'}).removeClass('disable_scrolling');
							$('.js_loading_top_button, .js_loading_bottom_button').addClass('js_active');

							$('.js_conversation_loader, .js_conversation_initial_loading_overlay, .js_alpha_clone_top, .js_alpha_clone_bottom').hide();
							Session.set('conversation_ready', true)
						} else {
							//Establish the number of entries actually recieved
							var checkRecieved = setInterval(function() {
								var receivedConverations = Conversations.find({created_on: { $exists: true }}).count();
								if (receivedConverations === expectedConversations) {
									clearInterval(checkRecieved);

									var checkVisible = setInterval(function() {
										var visibleCount = $('.js_conversation_list_item').length;
										if (visibleCount === receivedConverations) {
											clearInterval(checkVisible);

											//Determine if the first available conversation is showing and take action accordingly.
											var topConversation = Conversations.find({conversation_date: { $exists: true }}, {sort: {conversation_date: -1}, limit: 1}).fetch();
											var topListConversation = Conversations.find({created_on: { $exists: true }}, {sort: {conversation_date: -1}}).fetch();

											//"Load more" top blank hide/show.
											if (topConversation[0]._id === topListConversation[0]._id) {
												$('.js_loading_top').hide()
											} else {
												$('.js_loading_top').show()
											}

											//Determine if the last available conversation is showing and take action accordingly.
											var bottomConversation = Conversations.find({conversation_date: { $exists: true }}, {sort: {conversation_date: 1}, limit: 1}).fetch();
											var bottomListConversation = Conversations.find({created_on: { $exists: true }}, {sort: {conversation_date: 1}}).fetch();

											//"Load more" bottom blank hide/show.
											if (bottomConversation[0]._id === bottomListConversation[0]._id) {
												$('.js_loading_bottom').hide();
											} else {
												$('.js_loading_bottom').show()
											}

											//Retrieve scrolling variables and take action accordingly.
											var conScrollDir = Session.get('conScrollDir');
											var conPivotId = Session.get('conPivotId');
											var conPivotOffset = Session.get('conPivotOffset');
											var conPivotDate = Session.get('conPivotDate');

											//Constrain the conversation list width to it's future width prior to scroll.
											$('.js_conversation_list').width($('.content.two').width());

											//Determine the scrollTop based on the provided scrolling variables.
											if (conScrollDir === 'alpha') {
												count = $('.js_conversation_list').find('.js_conversation_list_item[data-conversation-local-date*="' + conPivotDate + '"]').length;
												while (count === 0) {
													var conPivotDate = moment(conPivotDate).subtract(1, 'd').format('YYYY-MM-DD');
													var count = $('.js_conversation_list').find('.js_conversation_list_item[data-conversation-local-date*="' + conPivotDate + '"]').length;
												}

												var conPivotId = $('.js_conversation_list').find('.js_conversation_list_item[data-conversation-local-date*="' + conPivotDate + '"]:first').attr('id')
											}

											if (conPivotId) {
												if (conScrollDir === 'up') {
													var listPos = $('.js_conversation_list').find('#' + conPivotId).offset().top - 150;
												} else if (conScrollDir === 'middle' || conScrollDir === 'alpha') {
													var listPos = $('.js_conversation_list').find('#' + conPivotId).offset().top - 100;
												} else {
													var adjust = conPivotOffset - $('#' + conPivotId).outerHeight();
													var listPos = $('.js_conversation_list').find('#' + conPivotId).offset().top - adjust;
												}

												$('.js_conversation_list').scrollTop(listPos);
											}

											//Reset and reveal the conversation list based on the provided scrolling variables.
											$('.js_conversation_list').css({left: 0, width: 'auto'}).removeClass('disable_scrolling');
											$('.js_loading_top_button, .js_loading_bottom_button').addClass('js_active');

											$('.js_conversation_loader, .js_conversation_initial_loading_overlay, .js_alpha_clone_top, .js_alpha_clone_bottom').hide();
											Session.set('conversation_ready', true)
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

	$('.js_datepicker').pickadate({
		//DatePicker Settings
		format: 'yyyy-mm-dd',
		today: 'Today\'s Date',
		container: '.date_container',

		// DatePicker On Open
		onOpen: function() {
			if (ConversationSelect.find().count() === 0) {
				$('.js_tool_current_entry').addClass('inactive');
			} else {
				$('.js_tool_current_entry').removeClass('inactive');
			}
			$('.js_list_date').show();
			$('.js_select').fadeOut(100);
		},

		onClose: function(context) {
			$('.js_tool_date').addClass('js_inactive');
			var reload = false;
			var firstDate = moment(Conversations.findOne({}, {sort: {conversation_date: -1}}).conversation_date).format('YYYY-MM-DD');
			var firstVisibleDate = moment($('.js_conversation_list').find('.js_conversation_list_item').attr('data-conversation-date')).format('YYYY-MM-DD');
			var date = $('.js_datepicker').val();

			var topConversation = Conversations.find({}, {sort: {conversation_date: -1}, limit: 1}).fetch();
			var bottomConversation = Conversations.find({}, {sort: {conversation_date: 1}}).fetch();
			var topConversationDate = moment(topConversation[0].conversation_date).utc().valueOf();
			var bottomConversationDate = moment(bottomConversation[0].conversation_date).utc().valueOf();
			var topVisibleDate = moment($('.js_conversation_list').find('.js_conversation_list_item:first').attr('data-conversation-date')).utc().valueOf();
			var bottomVisibleDate = moment($('.js_conversation_list').find('.js_conversation_list_item:last').attr('data-conversation-date')).utc().valueOf();
			var selectedDate = moment(date).utc().valueOf();

			if (selectedDate <= topVisibleDate && selectedDate >= bottomVisibleDate) {
				count = $('.js_conversation_list').find('.js_conversation_list_item[data-conversation-local-date*="' + date + '"]').length;
				while (count === 0) {
					var date = moment(date).subtract(1, 'd').format('YYYY-MM-DD');
					var count = $('.js_conversation_list').find('.js_conversation_list_item[data-conversation-local-date*="' + date + '"]').length;
				}
			}

			var visiblePivotId = $('.js_conversation_list').find('.js_conversation_list_item[data-conversation-local-date*="' + date + '"]:first').attr('id')

			if (date && date != Session.get('conPivotDate')) {
				if (visiblePivotId) {
					var visiblePivotIndex = $('#' + visiblePivotId).index() - 2;
					if (visiblePivotIndex > 150) {
						var conPivotDate = date;
						var reload = true;
					} else {
						$('.js_conversation_list').scrollTo('#' + visiblePivotId, 300);
						var reload = false;
					}
				} else if (selectedDate >= topConversationDate) {
					if (topConversationDate !=  topVisibleDate) {
						var conPivotDate = moment(topConversation[0].conversation_date).format('YYYY-MM-DD');
						var reload = true;
					} else {
						var reload = false;
						$('.js_conversation_list').scrollTo('0%', 300);
					}
				} else if (selectedDate <= bottomConversationDate) {
					if (bottomConversationDate != bottomVisibleDate) {
						var conPivotDate = moment(bottomConversation[0].conversation_date).format('YYYY-MM-DD');
						var reload = true;
					} else {
						var reload = false;
						$('.js_conversation_list').scrollTo('100%', 300);
					}
				} else {
					var conPivotDate = date;
					var reload = true;
				}
			}


			if (reload) {
				$('.js_conversation_list_item').addClass('js_existing_conversation')
				$('.js_loading_top_button, .js_loading_bottom_button').removeClass('js_active');
				$('.js_conversation_list').addClass('disable_scrolling');
				$('.js_conversation_loader, .js_conversation_initial_loading_overlay').show();
				$('.js_conversation_list').css('left', "10000px").scrollTop(0);

				Session.set({conScrollDir: 'alpha', conPivotId: '', conPivotDate: conPivotDate, conPivotOffset: ''});
			}

			$('.js_list_date').hide();
		}
	})

	$('.js_conversation_list').on('scroll', function() {
		var scrollHeight = $(this).outerHeight();
		var topPos = $('.js_loading_top').offset().top - 100;
		var bottomPos = $('.js_loading_bottom').offset().top - 50;

		if (topPos === 0 && $('.js_loading_top_button').hasClass('js_active')) {
			$('.js_conversation_list_item').addClass('js_existing_conversation')
			$('.js_loading_top_button').click();
		}

		if (scrollHeight === bottomPos && $('.js_loading_bottom_button').hasClass('js_active')) {
			$('.js_conversation_list_item').addClass('js_existing_conversation')
			$('.js_loading_bottom_button').click();
		}
	});

});

Template.conversationInfo.helpers({

	contact: function() {
		return Contacts.findOne(Session.get('currentContact'));
	},

	noConversations: function() {
		if (Conversations.find({belongs_to_contact: Session.get('currentContact')}).count() === 0) {
			return true;
		} else {
			return false;
		}
	},

	noContacts: function() {
		if (Session.get('currentContact') === 'no-contacts') {
			return true;
		} else {
			return false;
		}
	},

	conversations: function() {
		return Conversations.find({belongs_to_contact: Session.get('currentContact'), conversation_label: { $exists: true }}, {sort: {conversation_date: -1}});
	},

	conversationsScroll: function() {
		return ConversationInfiniteScroll.find();
	},

	dateTool: function() {
		if (Conversations.find({belongs_to_contact: Session.get('currentContact')}).count() >= 300) {
			return true;
		} else {
			return false;
		}
	},

});

Template.conversationInfo.events({
	'click .js_loading_top_button': function(e) {

		$('.js_loading_top_button, .js_loading_bottom_button').removeClass('js_active');
		$('.js_conversation_list').addClass('disable_scrolling');

		ConversationInfiniteScroll.remove({});
		var conversations = Conversations.find({belongs_to_contact: Session.get('currentContact'), conversation_label: { $exists: true }}, {sort: {conversation_date: -1}}).fetch()
		for (i = 0; i < conversations.length; i++) {
			ConversationInfiniteScroll.insert({
				conversationId: conversations[i]._id,
				conversation_label: conversations[i].conversation_label,
				created_by: conversations[i].created_by,
				conversation_date: conversations[i].conversation_date,
				conversation: conversations[i].conversation,
				userId: conversations[i].userId,
			});
		};

		$('.js_conversation_loader, .js_alpha_clone_top').show();
		$('.js_conversation_list').css('left', "10000px").scrollTop(0);

		var conPivotOffset = $('.js_conversation_list').height();
		var conPivotDate = $('.js_conversation_list').find('.js_conversation_list_item:first').attr('data-conversation-date');
		var conPivotId = $('.js_conversation_list').find('.js_conversation_list_item:first').attr('id');

		Session.set({conScrollDir: 'up', conPivotId: conPivotId, conPivotDate: conPivotDate, conPivotOffset: conPivotOffset});

	},

	'click .js_loading_bottom_button': function() {

		$('.js_loading_top_button, .js_loading_bottom_button').removeClass('js_active');
		$('.js_conversation_list').addClass('disable_scrolling');

		ConversationInfiniteScroll.remove({});
		var conversations = Conversations.find({belongs_to_contact: Session.get('currentContact'), conversation_label: { $exists: true }}, {sort: {conversation_date: -1}}).fetch()
		for (i = 0; i < conversations.length; i++) {
			ConversationInfiniteScroll.insert({
				conversationId: conversations[i]._id,
				conversation_label: conversations[i].conversation_label,
				created_by: conversations[i].created_by,
				conversation_date: conversations[i].conversation_date,
				conversation: conversations[i].conversation,
				userId: conversations[i].userId,
			});
		};

		$('.js_conversation_loader, .js_alpha_clone_bottom').show();
		$('.js_conversation_list').css('left', "10000px").scrollTop(0);

		var conPivotOffset = $('.js_conversation_list').height();
		var conPivotDate = $('.js_conversation_list').find('.js_conversation_list_item:last').attr('data-conversation-date');
		var conPivotId = $('.js_conversation_list').find('.js_conversation_list_item:last').attr('id');

		Session.set({conScrollDir: 'down', conPivotId: conPivotId, conPivotDate: conPivotDate, conPivotOffset: conPivotOffset});

	},

	'click .js_tool_date': function(e) {
		if (!$(e.target).hasClass('inactive')) {
			if ($(e.target).hasClass('js_inactive')) {
				e.stopPropagation();
				e.preventDefault();
				$(e.target).removeClass('js_inactive');
				var input = $('.js_datepicker').pickadate();
				var picker = input.pickadate('picker');
				picker.open();
			} else {
				$(e.target).addClass('js_inactive');
			}
		}
	},

	'click .js_tool_newest_entry': function(e) {
		e.preventDefault();
		var firstDate = moment(Conversations.findOne({}, {sort: {conversation_date: -1}}).conversation_date).format('YYYY-MM-DD');
		$('.js_datepicker').val(firstDate);
	},

	'click .js_tool_oldest_entry': function(e) {
		e.preventDefault();
		var lastDate = moment(Conversations.findOne({}, {sort: {conversation_date: 1}}).conversation_date).format('YYYY-MM-DD');
		$('.js_datepicker').val(lastDate);
	},

	'click .js_conversation_list_item': function(e) {
		if (!$(e.target).hasClass('js_multi_select_single') && !$(e.target).hasClass('js_multi_select')) {
			if ($(e.target).hasClass('js_conversation_list_item')) {
				var conversationId = $(e.target).attr('id');
			} else {
				var conversationId = $(e.target).parent().attr('id');
			}
			$('#js_conversation .active').removeClass('active');
			$('.js_current').removeClass('js_current active');
			$('#' + conversationId).addClass('js_current active');
			ConversationSelect.remove({});
			ConversationSelect.insert({conversationId: conversationId});
			Session.set('currentConversation', conversationId);
			Session.set('currentType', 'conversation');
			Session.set('updateRoute', '/update/conversation/' + conversationId);
			Session.set('deleteRoute', '/delete/conversations');
			$('.js_profile_inactive, .icn_add_tag, .icn_add_contact, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag_disabled').show();
			$('.js_profile_active, .icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag').hide();
		}
	},

	'click .js_multi_select_single': function(e) {
		var conversationId = $(e.target).parent().attr('id');
		if ($('.js_conversation_list_item').hasClass('js_current') && !$(e.target).parent().hasClass('js_current')) {
			var multi = ConversationSelect.findOne({conversationId: conversationId});
			if (multi) {
				ConversationSelect.remove({conversationId: conversationId});
				$('#' + conversationId).removeClass('active');
			} else {
				ConversationSelect.insert({conversationId: conversationId});
				$('#' + conversationId).addClass('active');
			}
		}
	},

	'click .js_multi_select': function(e) {
		var selectId = '#' + $(e.target).parent().attr('id');

		if ($(selectId).hasClass('js_current')) {
			$('.js_current .js_multi_select_current').click();
		}

		if ($('.js_current').prevAll(selectId).length != 0 ) {
			$(e.target).parent().addClass('js_insert active');
			$('.js_current').prevUntil(selectId).addClass('js_insert active');
			$('.js_insert').each(function() {
				var conversationId = $(this).attr('id');
				var multi = ConversationSelect.findOne({conversationId: conversationId});
				if (!multi) {
					ConversationSelect.insert({conversationId: conversationId});
				}
			})

			$(selectId).prevAll().removeClass('js_insert active').addClass('js_remove');
			$('.js_remove').each(function() {
				var conversationId = $(this).attr('id');
				ConversationSelect.remove({conversationId: conversationId});
			})
		} else if ($('.js_current').nextAll(selectId).length != 0) {
			$(e.target).parent().addClass('js_insert active');
			$('.js_current').nextUntil(selectId).addClass('js_insert active');
			$('.js_insert').each(function() {
				var conversationId = $(this).attr('id');
				var multi = ConversationSelect.findOne({conversationId: conversationId});
				if (!multi) {
					ConversationSelect.insert({conversationId: conversationId});
				}
			})

			$(selectId).nextAll().removeClass('js_insert active').addClass('js_remove');
			$('.js_remove').each(function() {
				var conversationId = $(this).attr('id');
				ConversationSelect.remove({conversationId: conversationId});
			})
		}
		$('.js_insert').removeClass('js_insert');
		$('.js_remove').removeClass('js_remove');
	}

});
