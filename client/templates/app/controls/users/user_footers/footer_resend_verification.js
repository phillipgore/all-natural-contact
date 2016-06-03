Template.footerResendVerification.helpers({
	deleteUser: function() {
		return Meteor.users.findOne(Session.get('updateUser'));
	},
});

Template.footerResendVerification.events({
	'click .js_resend_verification': function(e) {
		e.preventDefault();
		$('.js_verify_email_form').submit();
	}
});