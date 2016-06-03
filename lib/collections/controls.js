Controls = new Mongo.Collection('controls');

ControlsSchema = new SimpleSchema({
  freeTrial: {
		type: Number,
		label: "Free Trial Period",
		defaultValue: 30
	},
  bugReporting: {
		type: Boolean,
		label: "Bug Reporting",
		defaultValue: false
	},
  publicBeta: {
		type: Boolean,
		label: "Beta",
		defaultValue: false
	},
});

Controls.attachSchema( ControlsSchema );

Meteor.methods({
  trialUpdate: function(control_id, trialProperties) {
    if (Meteor.user().role.app_administrator === true)
		  Controls.update(control_id, {$set: trialProperties});
	},

  bugUpdate: function(control_id, bugProperties) {
    if (Meteor.user().role.app_administrator === true)
		  Controls.update(control_id, {$set: bugProperties});
	},

	betaUpdate: function(control_id, betaProperties) {
    if (Meteor.user().role.app_administrator === true)
		  Controls.update(control_id, {$set: betaProperties});
	}
});
