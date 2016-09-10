Template.footerSaveBilling.helpers({
	controls: function() {
		return Controls.findOne();
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
});

Template.footerSaveBilling.events({
	'click .js_sign_out_billing': function(e) {
		e.preventDefault();
		Meteor.logout();
	},

	'click .js_billing_submit': function(e) {
		e.preventDefault();
		$('.red_alert_msg').slideUp();
		var month = $('[data-stripe="expMonth"]').val().slice(0,2).trim()
		STRIPE.getToken( '#billing_form', {
			  number: $('[data-stripe="cardNumber"]').val(),
			  exp_month: month,
			  exp_year: $('[data-stripe="expYear"]').val(),
			  cvc: $('[data-stripe="cvc"]').val()
			}, function() {
				var group = Groups.findOne()
				var groupProperties = {
					name: group.name,
					plan: 'simple',
					token: $('[name="stripeToken"]').val()
				};
				console.log(JSON.stringify(groupProperties))
				Meteor.call('groupUpdate', group._id, groupProperties, function(error, result) {
					if (error) {
						return alert(error.reason);
					} else {
						console.log(result.token)
						STRIPE.stripeCreateCustomer(groupProperties.token, function() {
							var customerId = stripeCustomer.id;
							var plan = groupProperties.plan;
							alert(customerId +" "+ plan)
						})
					}
				});

			}
		);
	},
});
