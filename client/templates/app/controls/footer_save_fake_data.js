Template.footerSaveFakeData.events({	
	'click .js_fake_data_submit': function(e) {
		e.preventDefault();
		
		if (!$(e.target).hasClass('js_inactive')) {
			$('.js_fake_data_form').submit();
		}
	}
});