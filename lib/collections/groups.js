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
		Groups.update(group_id, {$set: groupProperties});
	}
});
