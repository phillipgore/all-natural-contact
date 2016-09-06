Template.footerSaveBilling.events({
	'click .js_billing_submit': function(e) {
		e.preventDefault();
		alert('billing');
	}
});

Template.footerSaveBilling.helpers({
	controls: function() {
		return Controls.findOne();
	},

	freeTrialExpired: function() {
		var free_account_expires = moment(Groups.findOne().created_on).add(Controls.findOne().freeTrial, 'd').utc().valueOf();
		var current_date = moment().utc().valueOf();

		if (free_account_expires <= current_date && Meteor.user().role.app_administrator === false && Controls.findOne().publicBeta === false) {
			return true;
		} else {
			return false;
		}
	},
});
