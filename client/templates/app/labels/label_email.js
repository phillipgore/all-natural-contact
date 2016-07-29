Template.labelEmail.onRendered(function() {



});

Template.labelEmail.helpers({

  emailLabel: function() {
    var labels = Labels.find({labelType: 'email_label'})
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
          newLabels.push(labelProperties)
        }
      })
    });
    var newLabels = _.sortBy(newLabels, 'labelOrder');

    return newLabels;
  }

});

Template.labelEmail.events({



});
