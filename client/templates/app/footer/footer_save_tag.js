Template.footerSaveTag.events({	
	'click .js_tag_new_submit, click .js_tag_new_submit_plus': function(e) {
		e.preventDefault();
		
		if (!$(e.target).hasClass('js_inactive')) {
			$('.js_tag_new_form').submit();
		}	
	}
});