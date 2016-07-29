Template.labelPhone.onRendered(function() {



});

Template.labelPhone.helpers({

  phoneLabel: function() {
    var labels = Labels.find({labelType: 'phone_label'})
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

Template.labelPhone.events({



});
