Groups = new Mongo.Collection('groups');

GroupsSchema = new SimpleSchema({
  name: {
		type: String,
		label: "Group Name",
		optional: true
	},
	has_users: {
		type: [String],
		label: "Group Has Users",
		optional: true
	},
  stripeId: {
    type: String,
		label: "Stripe Customer Id",
		optional: true
  },
  stripeSubcription: {
    type: String,
		label: "Stripe Subscription Id",
		optional: true
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
});

Groups.attachSchema( GroupsSchema );

Meteor.methods({
	groupInsert: function(groupProperties) {
		var groupId = Groups.insert(groupProperties);

		return {
			_id: groupId
		};
	},

	groupUpdate: function(group_id, groupProperties) {
		var groupId = Groups.update(group_id, {$set: groupProperties});
	},

	groupRemove: function(groupId) {
    Labels.remove({groupId: groupId});
    Conversations.remove({groupId: groupId});
    Contacts.remove({groupId: groupId});
    Tags.remove({groupId: groupId});
    Meteor.users.remove({"profile.belongs_to_group": groupId});
    Groups.remove({_id: groupId});
  }
});
