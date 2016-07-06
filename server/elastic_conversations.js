var cursor = Conversations.find({});

cursor.observeChanges({
	added: function (id) {
		var conversation = Conversations.findOne({_id: id})
		EsClient.index({
			index: "conversationsindex",
			type: "conversations",
			id: id,
			body: {
				id: conversation._id,

				conversation_label: conversation.conversation_label,
				conversation_date: conversation.conversation_date,
				conversation: conversation.conversation,
				belongs_to_contact: conversation.belongs_to_contact,

				groupId: conversation.groupId,
				created_by: conversation.created_by,
				created_on: conversation.created_on,
				updated_on: conversation.updated_on
			}
		});
	},
	changed: function (id) {
		var contact = Conversations.findOne({_id: id})
		EsClient.index({
			index: "conversationsindex",
			type: "conversations",
			id: id,
			body: {
				id: conversation._id,

				conversation_label: conversation.conversation_label,
				conversation_date: conversation.conversation_date,
				conversation: conversation.conversation,
				belongs_to_contact: conversation.belongs_to_contact,

				groupId: conversation.groupId,
				created_by: conversation.created_by,
				created_on: conversation.created_on,
				updated_on: conversation.updated_on
			}
		});
	},
	removed: function (id) {
		EsClient.delete({
			index: "conversationsindex",
			type: "conversations",
			id: id,
		});
	},
});

Meteor.methods({
	conversationSearch: function(searchText) {
		EsClient.search({
			index: 'conversationsindex',
			type: 'conversations',
			body: {
				query: {
					match: {
						conversation: searchText
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
