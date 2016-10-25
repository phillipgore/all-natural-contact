Template.footerSaveBilling.helpers({
	controls: function() {
		return Controls.findOne();
	},

	adminPause: function() {
		if (Groups.findOne().stripePause === "adminPause") {
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
});

Template.footerSaveBilling.events({
	'click .js_sign_out_billing': function(e) {
		e.preventDefault();
		Meteor.logout();
	},

	'click .js_billing_submit': function(e) {
		e.preventDefault();

		$('.js_submit').attr('disabled', 'disabled').text('Submitting...');
		$('.js_saving_msg').text('Submitting...');
		$('.js_initial_loading_overlay').show();
		$('.red_alert_msg').slideUp();

		var month = $('[data-stripe="expMonth"]').val().slice(0,2).trim()
		var cardProperties = {
			number: $('[data-stripe="cardNumber"]').val(),
			exp_month: month,
			exp_year: $('[data-stripe="expYear"]').val(),
			cvc: $('[data-stripe="cvc"]').val()
		}

		Stripe.createToken(cardProperties, function(status, result) {
			if (result.error) {
				$('.js_submit').removeAttr('disabled', 'disabled').text('Submit Payment');
				$('.js_initial_loading_overlay').hide();
				$('.red_alert_msg').text(result.error.message).slideDown();
			} else {
				var customerProperties = {
					source: result.id,
					plan: 'simple',
					quantity: Meteor.users.find({'role.inactive': false, 'emails.0.verified': true}).count()
				}

				Meteor.call('addCard', customerProperties, function(error, response) {
					if (error) {
						$('.js_submit').removeAttr('disabled', 'disabled').text('Submit Payment');
						$('.js_initial_loading_overlay').hide();
						$('.red_alert_msg').text(error.reason).slideDown();
					} else {
						Router.go('settings');
					}
				})
			}
		})

	},

	'click .js_billing_update': function(e) {
		e.preventDefault();

		$('.js_submit').attr('disabled', 'disabled').text('Updateing...');
		$('.js_saving_msg').text('Updating...');
		$('.js_initial_loading_overlay').show();
		$('.red_alert_msg').slideUp();

		var month = $('[data-stripe="expMonth"]').val().slice(0,2).trim()
		var cardProperties = {
			number: $('[data-stripe="cardNumber"]').val(),
			exp_month: month,
			exp_year: $('[data-stripe="expYear"]').val(),
			cvc: $('[data-stripe="cvc"]').val()
		}

		Stripe.createToken(cardProperties, function(status, result) {
			if (result.error) {
				$('.js_submit').removeAttr('disabled', 'disabled').text('Update Card');
				$('.js_initial_loading_overlay').hide();
				$('.red_alert_msg').text(result.error.message).slideDown();
			} else {
				Meteor.call('swapCard', result.id, function(error, response) {
					if (error) {
						$('.js_submit').removeAttr('disabled', 'disabled').text('Update Card');
						$('.js_initial_loading_overlay').hide();
						$('.red_alert_msg').text(error.reason).slideDown();
					} else {
						Router.go('settings');
					}
				})
			}
		});

	},

	'click .js_reactivate': function(e) {
		e.preventDefault();

		$('.js_submit').attr('disabled', 'disabled').text('Reactivating...');
		$('.js_saving_msg').text('Reactivating...');
		$('.js_initial_loading_overlay').show();
		$('.red_alert_msg').slideUp();

		Meteor.call('reactivateSubscription', function(error, result) {
			if (error) {
        $('.js_submit').removeAttr('disabled', 'disabled').text('Reactivate Account');
				$('.js_initial_loading_overlay').hide();
				$('.red_alert_msg').text(error.reason).slideDown();
      } else {
				var group_id = Groups.findOne()._id;
        var groupProperties = {
          stripeEnd: null,
          stripePause: 'activated'
        }

        Meteor.call('groupUpdate', group_id, groupProperties, function(error) {
          if (error) {
            $('.js_submit').removeAttr('disabled', 'disabled').text('Confirm Pause');
    				$('.js_initial_loading_overlay').hide();
    				$('.red_alert_msg').text(error.reason).slideDown();
  				} else {
						$('.js_initial_loading_overlay').hide();
  				}
        })
			}
		})
	},

});
