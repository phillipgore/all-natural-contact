Template.search.onRendered(function() {
  $('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit, .icn_delete, .icn_add_to_tag').show();
  $('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').hide();

	$('.js_tool_profile, .js_tool_conversation, .js_tool_process').hide();
	$('.js_tool_profile_disabled, .js_tool_conversation_disabled, .js_tool_process_disabled').show();

  $('.js_tool_list').hide();
	$('.js_tool').removeClass('js_tool_current active');
	$('.js_tool_search').show().addClass('js_tool_current active');

  $('.js_loader, .js_initial_loading_overlay').hide();
  $('.js_startup_loader').fadeOut('fast');

  $('.js_search_input').val(Session.get('searchText'));
  $('.js_search_icon').addClass('focus')
  $('.js_search_clear').addClass('focus js_active')

  ContactSelect.remove({});
});

Template.search.helpers({
	contacts: function() {
    return ContactsSearch.find({created_on: { $exists: true }})
	},
});

Template.search.events({

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

})
