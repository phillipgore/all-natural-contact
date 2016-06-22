Template.supportLayout.onRendered(function() {
  $('html, body').addClass('support_scroll');
});

Template.supportLayout.events({

  'click .btn_nav_slide': function(e) {
    e.preventDefault();
    $('.js_support_sidebar').toggleClass('slide_open');
    $('.js_btn_nav_slide').toggleClass('open');
  },

  'click img.js_clear_search': function(e) {
    e.preventDefault();
    $('.js_support_search').val('').removeAttr('style');
    $('.js_search_icn_blue').hide();
    $('.js_search_icn_gray').show();
    Router.go('support')
  },

  'focus .support_search': function(e) {
    $('.js_support_search').css('border-color', '#6C89A6');
    $('.js_search_icn_gray').hide();
    $('.js_search_icn_blue').show();
    var supportSearchText = $(e.target).val();
    if (supportSearchText.length > 0) {
			Router.go('/support/search/' + supportSearchText);
		}
  },

  'keyup .js_support_search': _.throttle(function(e) {
		e.preventDefault();

		var supportSearchText = $(e.target).val();
    if (supportSearchText.length > 0) {
			Router.go('/support/search/' + supportSearchText);
		} else {
			Router.go('support')
		}
  }, 1000),

})
