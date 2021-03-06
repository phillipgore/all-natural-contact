Template.tagNewReminder.onRendered(function() {
	$('#tag').focus();
});

Template.tagNewReminder.helpers({
	conversationLabel: function() {
    var labels = Labels.find({labelType: 'conversation_label'})
    var newLabels = []
    labels.forEach(function(label) {
      label.user.forEach(function(user, index) {
        if (user.userId === Meteor.userId()) {
          var labelProperties = {
            labelId: label._id,
            labelName: label.labelName,
            labelType: label.labelType,
            userId: user.userId,
            labelOrder: user.labelOrder,
            labelVisible: user.labelVisible,
          }
          if (labelProperties.labelVisible) {
            newLabels.push(labelProperties)
          }
        }
      })
    });
    var newLabels = _.sortBy(newLabels, 'labelOrder');

    return newLabels;
  }
});

Template.tagNewReminder.events({
	'click .js_select_all': function(e) {
		$('.js_entries').removeClass('unchecked');
		$('.js_reminder_entries .js_entries #js_accepted_entry').val(true);
	},

	'click .js_unselect_all': function(e) {
		$('.js_entries').addClass('unchecked');
		$('.js_reminder_entries .js_entries #js_accepted_entry').val(false);
	},

	'click .js_checkbox_labels': function(e) {
		e.preventDefault();
		$(e.target).toggleClass('unchecked')
		if ($(e.target).find('input').val() === 'false' || $(e.target).find('input').val() === '' ) {
			$(e.target).find('input').val('true');
		} else {
			$(e.target).find('input').val('false');
		}
	},
})
