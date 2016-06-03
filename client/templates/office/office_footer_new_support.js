Template.officeFooterNewSupport.events({
  'click .js_new_support_submit': function(e) {
    e.preventDefault();
    $('.js_new_support_form').submit();
  }
});
