Template.userBilling.onRendered(function() {
	$('.js_startup_loader').hide();
});


Template.userBilling.helpers({
	currentUser: function() {
		return Meteor.user();
	},

	currentGroup: function() {
		return Groups.findOne();
	},

	adminPause: function() {
		if (Groups.findOne().stripePause === "adminPause") {
			return true;
		} else {
			return false;
		}
	},

	adminPauseTimeout: function() {
		if (moment.unix(Groups.findOne().stripeEnd).utc().valueOf() >= moment().utc().valueOf()) {
			return true;
		} else {
			return false;
		}
	},

	failPause: function() {
		if (Groups.findOne().stripePause === "failPause") {
			return true;
		} else {
			return false;
		}
	},

	controls: function() {
		return Controls.findOne();
	},

	groupCardExists: function() {
		if (Groups.findOne().stripeSubcription) {
			return true;
		} else {
			return false;
		}
	},

	freeTrialExpired: function() {
		var free_account_expires = moment(Groups.findOne().created_on).add(Controls.findOne().freeTrial, Meteor.settings.public.trialTime).utc().valueOf();
		var current_date = moment().utc().valueOf();

		if (free_account_expires <= current_date && Meteor.user().role.app_administrator === false && Controls.findOne().publicBeta === false) {
			return true;
		} else {
			return false;
		}
	},

	freeTrialDaysRemain: function() {
		var timeSince = moment(Groups.findOne().created_on).add(Controls.findOne().freeTrial, Meteor.settings.public.trialTime).utc().valueOf() - moment().utc().valueOf();
		return parseInt(moment.duration(timeSince).asDays())
	},

	freeTrialExpirationDate: function () {
		return moment(Groups.findOne().created_on).add(Controls.findOne().freeTrial, Meteor.settings.public.trialTime).add(Controls.findOne().freeTrial, Meteor.settings.public.trialTime)
	},
});
