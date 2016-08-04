Template.tagReminderInfo.onRendered(function () {
  //Bottom toolbar tool hide/show
  $('.js_tool').removeClass('js_tool_current active');
  $('.js_tool_list').addClass('js_tool_current active');

  $('.js_tool_profile, .js_tool_conversation, .js_tool_process').hide();
  $('.js_tool_profile_disabled, .js_tool_conversation_disabled, .js_tool_process_disabled').show();

  //Reset and Reveal Infinite Scrolling Contact List.
  this.autorun(function() {
    Template.currentData()

    var currentContacts = $('.js_existing_contact').length
    var checkCurrentContacts = setInterval(function() {
      var reducedContacts = $('.js_existing_contact').length
      if (currentContacts > reducedContacts || reducedContacts === 0) {
        clearInterval(checkCurrentContacts);

        var checkTaggedCount = setInterval(function() {
          if (TaggedCount.find().count() > 0) {
            clearInterval(checkTaggedCount);

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

            //Set currenttly selected tag
            TagSelect.remove({});
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
                var receivedContacts = ReminderContacts.find().count()

                if (receivedContacts === expectedContacts) {
                  clearInterval(checkRecieved);

                  var checkCount = setInterval(function() {
                    var visibleCount = $('.js_contact_item').length;

                    if (visibleCount === receivedContacts) {
                      clearInterval(checkCount);

                      //"Load more" top blank hide/show.
                      console.log('top: ' + ReminderContacts.findOne({}, {sort:{position: 1}}).position +" "+ 0)
                      if (ReminderContacts.findOne({}, {sort:{position: 1}}).position === 0) {
                        $('.js_loading_top').hide()
                      } else {
                        $('.js_loading_top').show()
                      }

                      //"Load more" bottom blank hide/show.
                      console.log('bottm: ' + ReminderContacts.findOne({}, {sort:{position: -1}}).position +" "+ (taggedCount - 1))
                      if (ReminderContacts.findOne({}, {sort:{position: -1}}).position === (taggedCount - 1)) {
                        $('.js_loading_bottom').hide();
                      } else {
                        $('.js_loading_bottom').show()
                      }

                      //Set current contact if not already set
                      if (!Session.get('currentContact')) {
                        var contactSelect = ReminderContacts.findOne();
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
      console.log('top clicked')
      $('.js_contact_list_item').addClass('js_existing_contact')
      $('.js_loading_top_button').click();
    }

    if (scrollHeight === bottomPos && $('.js_loading_bottom_button').hasClass('js_active')) {
      console.log('bottom clicked')
      $('.js_contact_list_item').addClass('js_existing_contact')
      $('.js_loading_bottom_button').click();
    }
  });

});

Template.tagReminderInfo.helpers({
  tag: function() {
		return Tags.findOne({_id: Session.get('currentTag')})
	},

	reminderTime: function() {
		var tag = Tags.findOne({_id: Session.get('currentTag')})
		var increment = tag.reminder_time[0].increment
		var period = tag.reminder_time[0].period
		if (increment === 1) {
			var period = period.slice(0, -1)
		}
		return increment +" "+ period;
	},

	reminderEntries: function() {
		var tag = Tags.findOne({_id: Session.get('currentTag')})
		return tag.reminder_time[0].entries.toString().replace(/,/g, ", ")
	},

  reminderContacts: function() {
    var tag = Tags.findOne({_id: Session.get('currentTag')});
    var currentDate = moment();
    var reminderDate = moment().subtract(tag.reminder_time[0].increment, tag.reminder_time[0].period)
    var reminderContacts = ReminderContacts.find().fetch()

    for (var i = 0; i < reminderContacts.length; i++) {
      var days_over = reminderDate.diff(reminderContacts[i].latest_conversation, 'days');
      if (days_over > 0) {
        var overdue = true;
      } else {
        var overdue = false;
      }
      var overdue_by = currentDate.diff(reminderContacts[i].latest_conversation, 'days');
      if (moment(reminderContacts[i].latest_conversation).isSame('1776-07-04', 'year')) {
        var overdue_by = 'never'
      } else {
        var overdue_by = moment.duration(overdue_by, "days").humanize();
      }

      reminderContacts[i].overdue = overdue;
      reminderContacts[i].overdue_by = overdue_by;
    }

    reminderContacts.sort(function (a, b) {
      if (a.position > b.position) {
        return 1;
      }
      if (a.position < b.position) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    return reminderContacts

    //return ReminderContacts.find()
  },

  reminderContactsScroll: function() {
		return InfiniteScroll.find();
	},

	taggedCount: function() {
		if (ReminderContacts.find({created_on: { $exists: true }}).count() > 0) {
			return true;
		} else {
			return false;
		}
	},
})

Template.tagReminderInfo.events({
  'click .js_loading_top_button': function(e) {

    //Disable contact list scrolling and loading.
    $('.js_loading_top_button, .js_loading_bottom_button').removeClass('js_active');

    //Store currently viewable contacts for loading clone.
    InfiniteScroll.remove({});
    var tag = Tags.findOne({_id: Session.get('currentTag')});

    var currentDate = moment();
    var reminderDate = moment().subtract(tag.reminder_time[0].increment, tag.reminder_time[0].period)
    var reminderContacts = ReminderContacts.find().fetch()

    for (var i = 0; i < reminderContacts.length; i++) {
      var days_over = reminderDate.diff(reminderContacts[i].latest_conversation, 'days');
      if (days_over > 0) {
        var overdue = true;
      } else {
        var overdue = false;
      }
      var overdue_by = currentDate.diff(reminderContacts[i].latest_conversation, 'days');
      if (moment(reminderContacts[i].latest_conversation).isSame('1776-07-04', 'year')) {
        var overdue_by = 'never'
      } else {
        var overdue_by = moment.duration(overdue_by, "days").humanize();
      }

      reminderContacts[i].overdue = overdue;
      reminderContacts[i].overdue_by = overdue_by;
    }

    reminderContacts.sort(function (a, b) {
      if (a.position > b.position) {
        return 1;
      }
      if (a.position < b.position) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    var start = 0
    var end = 50
    var reminderContacts = reminderContacts.slice(start, end)

    for (i = 0; i < reminderContacts.length; i++) {
      InfiniteScroll.insert({
        first: reminderContacts[i].first,
        last: reminderContacts[i].last,
        company: reminderContacts[i].company,
        is_company: reminderContacts[i].is_company,
        latest_conversation: reminderContacts[i].latest_conversation,
        overdue: reminderContacts[i].overdue,
        overdue_by: reminderContacts[i].overdue_by,
        position: reminderContacts[i].position,
      });
    };

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
    var tag = Tags.findOne({_id: Session.get('currentTag')});

    var currentDate = moment();
    var reminderDate = moment().subtract(tag.reminder_time[0].increment, tag.reminder_time[0].period)
    var reminderContacts = ReminderContacts.find().fetch()

    for (var i = 0; i < reminderContacts.length; i++) {
      var days_over = reminderDate.diff(reminderContacts[i].latest_conversation, 'days');
      if (days_over > 0) {
        var overdue = true;
      } else {
        var overdue = false;
      }
      var overdue_by = currentDate.diff(reminderContacts[i].latest_conversation, 'days');
      if (moment(reminderContacts[i].latest_conversation).isSame('1776-07-04', 'year')) {
        var overdue_by = 'never'
      } else {
        var overdue_by = moment.duration(overdue_by, "days").humanize();
      }

      reminderContacts[i].overdue = overdue;
      reminderContacts[i].overdue_by = overdue_by;
    }

    reminderContacts.sort(function (a, b) {
      if (a.position > b.position) {
        return 1;
      }
      if (a.position < b.position) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    var start = reminderContacts.length -50
    var end = reminderContacts.length
    var reminderContacts = reminderContacts.slice(start, end)

    for (i = 0; i < reminderContacts.length; i++) {
      InfiniteScroll.insert({
        first: reminderContacts[i].first,
        last: reminderContacts[i].last,
        company: reminderContacts[i].company,
        is_company: reminderContacts[i].is_company,
        latest_conversation: reminderContacts[i].latest_conversation,
        overdue: reminderContacts[i].overdue,
        overdue_by: reminderContacts[i].overdue_by,
        position: reminderContacts[i].position,
      });
    };

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
