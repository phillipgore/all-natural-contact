Meteor.publish('conversationLabels', function() {
  if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
    return Labels.find({groupId: groupId, labelType: 'conversation_label'})
  } else {
    return this.ready();
  }
});

Meteor.publish('contactLabels', function() {
  if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
    return Labels.find({groupId: groupId, labelType: {$in: ['phone_label', 'email_label', 'url_label', 'date_label', 'related_label', 'immp_label', 'immp_service_label', 'address_label']}})
  } else {
    return this.ready();
  }
});
