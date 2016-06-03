Template.contactImageUpload.onRendered(function() {

});

Template.contactImageUpload.events({
	'click .js_image_cancel': function(e) {
		$('.js_image_box').fadeToggle('fast', function() {
			$('.js_image_edit').slideToggle('fast');
		});
	}
});