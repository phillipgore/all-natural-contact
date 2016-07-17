Template.officeControlsList.onRendered(function() {
  $('.js_delete').addClass('hide')
  $('.js_delete_inactive').removeClass('hide');
  
  $('.js_tool').removeClass('active')
  $('.js_tool_office_controls').addClass('active');
});

Template.officeControlsList.events({
  'change .free_trial': function(e) {
    e.preventDefault();

    var trialProperties = {freeTrial: $(e.target).val()}
    Meteor.call('trialUpdate', Controls.findOne()._id, trialProperties, function(error, result) {
			if (error) {
				return alert(error.reason);
			}
		});
  },

  'click .js_checkbox_bug': function(e) {
		e.preventDefault();
		if ($(e.target).find('input').val() === 'false' || $(e.target).find('input').val() === '' ) {
      var bugProperties = {bugReporting: true}
		} else {
      var bugProperties = {bugReporting: false}
		}

    Meteor.call('bugUpdate', Controls.findOne()._id, bugProperties, function(error, result) {
			if (error) {
				return alert(error.reason);
			} else {
				$(e.target).find('input').val(bugProperties.bugReporting);
			}
		});
	},

  'click .js_checkbox_beta': function(e) {
		e.preventDefault();
		if ($(e.target).find('input').val() === 'false' || $(e.target).find('input').val() === '' ) {
      var betaProperties = {publicBeta: true}
		} else {
      var betaProperties = {publicBeta: false}
		}

    Meteor.call('betaUpdate', Controls.findOne()._id, betaProperties, function(error, result) {
			if (error) {
				return alert(error.reason);
			} else {
				$(e.target).find('input').val(betaProperties.publicBeta);
			}
		});
	},
});
