Template.tagUpdateReminder.helpers({
	personalCheck: function() {
		if (Tags.findOne().personal === 'open') {
			return 'unchecked'
		} else {
			return ''
		}
	},

	days: function() {
		if (Tags.findOne().reminder_time[0].period === 'days') {
			return true;
		} else {
			return false;
		}
	},

	weeks: function() {
		if (Tags.findOne().reminder_time[0].period === 'weeks') {
			return true;
		} else {
			return false;
		}
	},

	months: function() {
		if (Tags.findOne().reminder_time[0].period === 'months') {
			return true;
		} else {
			return false;
		}
	},

	years: function() {
		if (Tags.findOne().reminder_time[0].period === 'years') {
			return true;
		} else {
			return false;
		}
	},

	conversationLabel: function() {
    var labels = Labels.find({labelType: 'conversation_label'})
		var acceptedEntries = Tags.findOne().reminder_time[0].entries

    var newLabels = []
    labels.forEach(function(label) {
      label.user.forEach(function(user, index) {
				if (acceptedEntries.indexOf(label.labelName) >= 0) {
					var labelAccepted = true
				} else {
					var labelAccepted = false
				}
        if (user.userId === Meteor.userId()) {
          var labelProperties = {
            labelId: label._id,
            labelName: label.labelName,
            labelType: label.labelType,
            userId: user.userId,
            labelOrder: user.labelOrder,
            labelVisible: user.labelVisible,
						labelAccepted: labelAccepted,
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

Template.tagUpdateReminder.events({
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

	'submit .js_reminder_tag_update_form': function(e) {
		e.preventDefault();

		$('.js_submit').attr('disabled', 'disabled');
		$('.js_tag_update').text('Updating...').addClass('js_inactive');
		$('.js_saving_msg').text('Updating...');
		$('.js_initial_loading_overlay').show();

		var tag_id = this._id;
		var currentTagName = this.tagName;
		var date = new Date();
		var tag = $(e.target).find('[name=tag]').val().trim();
		var personalTag = $(e.target).find('[name=personal_tag]').val().trim();
		var comboTagName = tag.toLowerCase().replace(/\s/g,'');

		var selected = $('.js_toggle_reminder').find('.js_period[value="true"]');
		var entries = []
		$('.js_reminder_entries').find('.js_entries').each(function() {
			if ($(this).find('input').val().trim() == "true") {
				entries.push($(this).attr('data-label-name'))
			}
		})
		var reminderProperties = [{
			increment: parseInt($(selected).parentsUntil('.js_reminder_option').parent().find('.js_increment').val()),
			period: $(selected).attr('id'),
			entries: entries
		}]

		var reminderPeriod = $(selected).attr('id');

		if (tag.length === 0) {
			var comboTagName = "aaaaaaaa";
		}

		var tagProperties = {
		  tag: tag,
		  tagName: comboTagName + date.getTime().toString(),
		  personal: personalTag,
		  reminder_time: reminderProperties
		}

		Meteor.call('tagUpdate', tag_id, tagProperties, function(error) {
			if (error) {
				return alert(error.reason);
			} else {
				Session.set({currentTag: tag_id, tagScrollDir: 'middle', tagPivotId: tag_id, tagPivotName: tagProperties.tagName});
				Router.go('/list/tags');
			}
		});
	},
 });
