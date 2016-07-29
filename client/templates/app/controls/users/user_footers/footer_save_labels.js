Template.footerSaveLabels.helpers({
	returnUser: function() {
		return Session.get('updateUser')
	}
});

Template.footerSaveLabels.events({
	'click .js_labels_submit': function(e) {
		e.preventDefault();

		$('.js_user_labels_update_form').submit();
	}
});
