var cursor = Tags.find({});

cursor.observeChanges({
	added: function (id) {
		var tag = Tags.findOne({_id: id})

		EsClient.indices.exists({
			index: 'tagsindex'
		}, function(error, exists) {
			if (exists) {
				tagIndex(tag);
			} else {
				tagCreate().then(function() {
					tagIndex(tag);
				});
			}
		});
	},

	changed: function (id) {
		var tag = Tags.findOne({_id: id})

		EsClient.indices.exists({
			index: 'tagsindex'
		}, function(error, exists) {
			if (exists) {
				tagIndex(tag);
			} else {
				tagCreate().then(function() {
					tagIndex(tag);
				});
			}
		});
	},

	removed: function (id) {
		EsClient.delete({
			index: 'tagsindex',
			type: 'tags',
			id: id,
		});
	},
});

function tagCreate() {
	return EsClient.indices.create({
		index: 'tagsindex',
		body: {
			settings: {
				analysis: {
					filter: {
						tag_filter: {
							type: 'nGram',
							min_gram: 1,
							max_gram: 20
						}
					},
					analyzer: {
						tag_analyzer: {
							type: 'custom',
							tokenizer: 'standard',
							filter: [
								'lowercase',
								'tag_filter'
							]
						}
					}
				}
			},
			mappings: {
				tags: {
	        properties: {
						id: {
	            type: 'string'
	          },

						tag: {
							type: 'string',
							analyzer: 'tag_analyzer',
							search_analyzer: 'standard'
						},
	          tagName: {
	            type: 'string'
	          },
	          personal: {
	            type: 'string'
	          },
	          standardTagType: {
	            type: 'boolean'
	          },
	          reminderTagType: {
	            type: 'boolean'
	          },
	          processTagType: {
	            type: 'boolean'
	          },
	          milestoneTagType: {
	            type: 'boolean'
	          },
	          has_contacts: {
	            type: 'string'
	          },
	          has_tags: {
	            type: 'string'
	          },
					  belongs_to: {
	            type: 'string'
	          },
	          reminder_time: {
	            properties: {
	              increment: {
	                type: 'long'
	              },
	              period: {
	                type: 'string'
	              }
	            }
	          },
	          groupId: {
	            type: 'string'
	          },
	          created_by: {
	            type: 'string'
	          },
	          created_on: {
	            type: 'date',
	            format: 'strict_date_optional_time||epoch_millis'
	          },
	          updated_on: {
	            type: 'date',
	            format: 'strict_date_optional_time||epoch_millis'
	          }
	        }
	      }
			}
		}
	});
}

function tagIndex(tag) {
	return EsClient.index({
		index: 'tagsindex',
		type: 'tags',
		id: tag._id,
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
}
