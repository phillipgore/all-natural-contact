Template.officeFooterUpdateSupport.events({
  'click .js_update_support': function(e) {
    e.preventDefault();
    $('.js_update_support_form').submit();
  }
});
