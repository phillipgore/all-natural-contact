Template.tagReminderInfo.helpers({
  tag: function() {
		return Tags.findOne({_id: Session.get('currentTag')})
	},

	reminderTime: function() {
		var tag = Tags.findOne({_id: Session.get('currentTag')})
		var increment = tag.reminder_time[0].increment
		var period = tag.reminder_time[0].period
		if (increment === 1) {
			var period = period.slice(0, -1)
		}
		return increment +" "+ period;
	},

	reminderEntries: function() {
		var tag = Tags.findOne({_id: Session.get('currentTag')})
		return tag.reminder_time[0].entries.toString().replace(/,/g, ", ")
	},

  reminderContacts: function() {
    return ReminderContacts.find()
  }
})
