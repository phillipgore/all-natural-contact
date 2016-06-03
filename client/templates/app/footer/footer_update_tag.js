Template.footerUpdateTag.events({	
	'click .js_tag_update': function(e) {
		e.preventDefault();
		
		if (!$(e.target).hasClass('js_inactive')) {
			$('.js_tag_update_form').submit();
		}
	}
});