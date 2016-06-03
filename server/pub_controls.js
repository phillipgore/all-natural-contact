Meteor.publish('officeControls', function() {
  return Controls.find()
});
