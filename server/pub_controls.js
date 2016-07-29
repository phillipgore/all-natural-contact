Meteor.publish('officeControls', function() {
  return Controls.find()
});

Meteor.publish('userLabels', function(labelType) {
  if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
    return Labels.find({groupId: groupId, labelType: labelType})
  } else {
    return this.ready();
  }
});
