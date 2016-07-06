var cursor = Tags.find({});

cursor.observeChanges({
	added: function (id) {
		var tag = Tags.findOne({_id: id})
		EsClient.index({
			index: "tagsindex",
			type: "tags",
			id: id,
			body: {
				id: tag._id,

				tag: tag.tag,
				tagName: tag.tagName,
				personal: tag.personal,
				standardTagType: tag.standardTagType,
				reminderTagType: tag.reminderTagType,
				processTagType: tag.processTagType,
				milestoneTagType: tag.milestoneTagType,
				has_contacts: tag.has_contacts,
				has_tags: tag.has_tags,
				belongs_to:  tag.belongs_to,

				reminder_time: tag.reminder_time,

				groupId: tag.groupId,
				created_by: tag.created_by,
				created_on: tag.created_on,
				updated_on: tag.updated_on
			}
		});
	},
	changed: function (id) {
		var tag = Tags.findOne({_id: id})
		EsClient.index({
			index: "tagsindex",
			type: "tags",
			id: id,
			body: {
				id: tag._id,

				tag: tag.tag,
				tagName: tag.tagName,
				personal: tag.personal,
				standardTagType: tag.standardTagType,
				reminderTagType: tag.reminderTagType,
				processTagType: tag.processTagType,
				milestoneTagType: tag.milestoneTagType,
				has_contacts: tag.has_contacts,
				has_tags: tag.has_tags,
				belongs_to:  tag.belongs_to,

				reminder_time: tag.reminder_time,

				groupId: tag.groupId,
				created_by: tag.created_by,
				created_on: tag.created_on,
				updated_on: tag.updated_on
			}
		});
	},
	removed: function (id) {
		EsClient.delete({
			index: "tagsindex",
			type: "tags",
			id: id,
		});
	},
});

Meteor.methods({
	tagSearch: function(searchText) {
		EsClient.search({
			index: 'tagsindex',
			type: 'tags',
			body: {
				query: {
					match: {
						tag: searchText
					}
				}
			}
		}).then(function (body) {
			body.hits.hits.map(function(doc) {
				var results = doc._source;
			});
		}, function (error) {
			console.trace(error.message);
		});
	},
});
