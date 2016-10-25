Template.footerPauseAccount.events({
  'click .js_pause_account': function(e) {
    e.preventDefault();

    $('.js_submit').attr('disabled', 'disabled').text('Pausing...');
		$('.js_saving_msg').text('Pausing...');
		$('.js_initial_loading_overlay').show();
		$('.red_alert_msg').slideUp();

    Meteor.call('cancelSubscription', function(error, result) {
      if (error) {
        $('.js_submit').removeAttr('disabled', 'disabled').text('Confirm Pause');
				$('.js_initial_loading_overlay').hide();
				$('.red_alert_msg').text(error.reason).slideDown();
      } else {
        var group_id = Groups.findOne()._id;
        var groupProperties = {
          stripeEnd: result.subInfo.current_period_end,
          stripePause: 'adminPause'
        }

        Meteor.call('groupUpdate', group_id, groupProperties, function(error) {
          if (error) {
            $('.js_submit').removeAttr('disabled', 'disabled').text('Confirm Pause');
    				$('.js_initial_loading_overlay').hide();
    				$('.red_alert_msg').text(error.reason).slideDown();
  				} else {
  					Router.go('userBilling');
  				}
        })
      }
    })
  },
})
