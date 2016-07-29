Labels = new Mongo.Collection('labels');

LabelsSchema = new SimpleSchema({
  labelName: {
		type: String,
		label: "Label Name",
	},
  labelType: {
		type: String,
		label: "Label Type",
		allowedValues: ['phone_label', 'email_label', 'url_label', 'date_label', 'related_label', 'immp_label', 'immp_service_label', 'address_label', 'conversation_label']
	},
  "user.$.userId": {
		type: String,
		label: "User Id",
	},
  "user.$.labelOrder": {
		type: Number,
		label: "Label Order",
	},
  "user.$.labelVisible": {
		type: Boolean,
		label: "Label Visible",
	},
  groupId: {
		type: String,
		label: "Group ID",
		autoValue: function() {
			if ( this.isInsert ) {
				return Meteor.user().profile.belongs_to_group;
			}
		}
	},
  created_by: {
		type: String,
		label: "Created By User ID",
		autoValue: function() {
			if ( this.isInsert ) {
				return Meteor.userId();
			}
		}
	},
	created_on: {
		type: String,
		label: "Created On Date",
		autoValue: function() {
			if ( this.isInsert ) {
				return moment().toISOString();
			}
		}
	},
	updated_on: {
		type: String,
		label: "Updated On Date",
		optional: true,
		autoValue: function() {
			if ( this.isUpdate ) {
				return moment().toISOString();
			}
		}
	}
});

Labels.attachSchema( LabelsSchema );

Meteor.methods({
	labelInsert: function(labelInserts) {
    for (var i = 0; i < labelInserts.length; i++) {
      console.log('insert: ' + JSON.stringify(labelInserts[i]));
    }
		// Labels.insert(labelProperties);
	},

	labelUpdate: function(labelUpdates) {
    for (var i = 0; i < labelUpdates.length; i++) {
      console.log('insert: ' + JSON.stringify(labelUpdates[i]));
    }
		// Labels.update(label_id, {$set: labelProperties});
	},

	labelRemove: function(labelRemoves) {
    console.log('remove: ' + labelRemoves);
		// Labels.remove({_id: {$in: contact_ids}});
	},

  labelBulk: function(labelInserts, labelUpdates, labelRemoves) {
    if (labelInserts) {
      labelInserts.forEach(function(label) {
        //console.log('insert: ' + JSON.stringify(label));
        Labels.insert(label);
      })
    }

    if (labelUpdates) {
      labelUpdates.forEach(function(label) {
        //console.log('update: ' + JSON.stringify(label));
        Labels.update(label.labelId, {$set: {user: label.user}});
      })
    }

    if (labelRemoves) {
      // labelRemoves.forEach(function(label) {
      //   console.log('remove: ' + JSON.stringify(label));
      // })
      Labels.remove({_id: {$in: labelRemoves}});
    }
  }
});
