TagCount = new Mongo.Collection('tagCount');
TaggedCount = new Mongo.Collection('taggedCount');
Tags = new Mongo.Collection('tags');

TagsSchema = new SimpleSchema({
	tag: {
		type: String,
		label: "Tag",
		optional: true
	},
	tagName: {
		type: String,
		label: "Tag Name",
	},
	personal: {
		type: String,
		label: "Personal Tag",
		defaultValue: "open",
	},
	standardTagType: {
		type: Boolean,
		label: "Standard Tag Type",
	},
	reminderTagType: {
		type: Boolean,
		label: "Reminder Tag Type",
	},
	processTagType: {
		type: Boolean,
		label: "Process Tag Type",
	},
	milestoneTagType: {
		type: Boolean,
		label: "Milestone Tag Type",
	},
	has_contacts: {
		type: [String],
		label: "Tag Has Contacts",
		optional: true
	},
	has_tags: {
		type: [String],
		label: "Process Tag Has Tags",
		optional: true
	},
	belongs_to: {
		type: String,
		label: "Milestone Belongs To",
		optional: true
	},
	
	"reminder_time.$.increment": {
		type: Number,
		label: "Reminder Time Increment",
		optional: true
	},
	"reminder_time.$.period": {
		type: String,
		label: "Reminder Time Period",
		optional: true
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

Tags.attachSchema( TagsSchema );

Meteor.methods({
	tagInsert: function(tagProperties, milestoneProperties) {
		var tagId = Tags.insert(tagProperties);
		
		var mileIds = []
		if (_.size(milestoneProperties) > 0) {
			for (var i = 0; i < _.size(milestoneProperties); i++) {
				var mileId = Tags.insert(_.extend(milestoneProperties[i], {belongs_to: tagId}));
				mileIds.push(mileId);
			}
		}
		
		var mileTags = []
		for (var i = 0; i < mileIds.length; i++) {
			mileTags.push(mileIds[i])
		}
		
		Tags.update({_id: tagId}, {$set: {has_tags: mileTags}})
		
		return {
			_id: tagId
		};
	},
	
	tagUpdate: function(tag_id, tagProperties) {
		
		//Update any changes to the Process tag
		Tags.update(tag_id, {$set: tagProperties});
		
	},
	
	tagUpdateProcess: function(removeMilestones, tag_id, tagProperties, existingMilestoneProperties, newMilestoneProperties) {
	
		//Remove Deleted Milestones
		Tags.remove({_id: {$in: removeMilestones}});
		
		//Delete connection to contacts the belong to Milestones
		Contacts.update({}, {$pull: {belongs_to_tags: {$in: removeMilestones}}}, { multi: true });
		
		if (Meteor.isServer) {
			Tags.update({}, {$pull: {has_tags: {$in: removeMilestones}}}, { multi: true });
		} else {
			for (var i = 0; i < removeMilestones.length; i++) {
				Tags.update({}, {$pull: {has_tags: removeMilestones[i]}});
			}
		}
	
		//Update existing Milestones
		existingMilestoneProperties.forEach(function(existingMilestone) {
			Tags.update(existingMilestone._id, {$set: existingMilestone})
		});
		
		//Create new Milestones
		var newMilestoneIds = []
		if (_.size(newMilestoneProperties) > 0) {
			for (var i = 0; i < _.size(newMilestoneProperties); i++) {
				var newMilestoneId = Tags.insert(_.extend(newMilestoneProperties[i], {belongs_to: tag_id}));
				newMilestoneIds.push(newMilestoneId);
			}
		}
		
		//Update any changes to the Process tag
		Tags.update(tag_id, {$set: tagProperties, $addToSet: {has_tags: {$each: newMilestoneIds}}});
		
	},
	
	tagRemove: function(tag_ids) {
		//Delete Tags
		Tags.remove({_id: {$in: tag_ids}});
		//Delete any Tags belonging to the primary Tags
		Tags.remove({belongs_to: {$in: tag_ids}});
		//Remove Tags from has_tags Array of Tags they belong to
		Tags.update({}, {$pull: {has_tags: {$in: tag_ids}}}, { multi: true });
		//Delete connection to contacts the belong to Tags
		Contacts.update({}, {$pull: {belongs_to_tags: {$in: tag_ids}}}, { multi: true });
	},
	
	addToTag: function(tag_ids, contact_ids) {
		for (var i = 0; i < tag_ids.length; i++) {
			var tag_id = tag_ids[i]
			Tags.update({_id: tag_id}, {$addToSet: {has_contacts: {$each: contact_ids}}});
		}
		for (var i = 0; i < contact_ids.length; i++) {
			var contact_id = contact_ids[i]
			Contacts.update({_id: contact_id}, {$addToSet: {belongs_to_tags: {$each: tag_ids}}});
		}
	},
	
	removeFromTag: function(tag_ids, contact_ids) {
		for (var i = 0; i < tag_ids.length; i++) {
			Tags.update({_id: tag_ids[i]}, {$pull: {has_contacts: {$in: contact_ids}}}, {multi: true});
		}
		for (var i = 0; i < contact_ids.length; i++) {
			Contacts.update({_id: contact_ids[i]}, {$pull: {belongs_to_tags: {$in: tag_ids}}});
		}
	}
})









