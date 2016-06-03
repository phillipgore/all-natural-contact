Template.controls.events({
	'click .js_sign_out': function(e) {
		e.preventDefault()
		Meteor.logout();
	},

	'click .js_export_data': function(e) {
		e.preventDefault();
		Router.go('/export')
	},

	'click .js_support': function(e) {
		e.preventDefault();

		if ($(e.target).hasClass('js_ion_box')) {
			var href = $(e.target).parent().attr('href')
		} else {
			var href = $(e.target).attr('href')
		}
		window.open(href, '_blank');
	},
});

Template.controls.helpers({
	controls: function() {
		return Controls.findOne();
	},
});
