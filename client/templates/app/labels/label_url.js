Template.labelUrl.onRendered(function() {



});

Template.labelUrl.helpers({

  urlLabel: function() {
    var labels = Labels.find({labelType: 'url_label'})
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

Template.labelUrl.events({



});
