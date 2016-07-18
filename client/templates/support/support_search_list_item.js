Template.supportSearchListItem.onRendered(function() {
  $('.js_support_search').val(Session.get('supportSearchText')).css('border-color', '#6C89A6');
  $('.js_search_icn_gray').hide();
  $('.js_search_icn_blue').show();
});

Template.supportSearchListItem.helpers({
  sections: function() {
    return SupportSearch.find()
  }
});

Template.supportSearchListItem.events({
  'click .js_support_list_item': function(e) {
    $('.support_list_item').removeClass('active');
    $(e.target).addClass('active');
    $('.js_support_sidebar').toggleClass('slide_open');
    $('.js_btn_nav_slide').toggleClass('open');
    $('.js_support_search').val('').removeAttr('style');
    $('.js_search_icn_blue').hide();
    $('.js_search_icn_gray').show();
  }
});
