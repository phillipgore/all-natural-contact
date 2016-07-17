var cursor = Conversations.find({});

cursor.observeChanges({
	added: function (id) {
		var conversation = Conversations.findOne(
			{_id: id},
			{transform: function(doc) {
				doc.conversation_date = moment(doc.conversation_date).format('MMMM D, YYYY');
				return doc;
			}}
		);

		EsClient.indices.exists({
			index: 'conversationsindex'
		}, function(error, exists) {
			if (exists) {
				conversationIndex(conversation);
			} else {
				conversationCreate().then(function() {
					conversationIndex(conversation);
				});
			}
		});
	},

	changed: function (id) {
		var conversation = Conversations.findOne(
			{_id: id},
			{transform: function(doc) {
				doc.conversation_date = moment(doc.conversation_date).format('MMMM D, YYYY');
				return doc;
			}}
		);

		EsClient.indices.exists({
			index: 'conversationsindex'
		}, function(error, exists) {
			if (exists) {
				conversationIndex(conversation);
			} else {
				conversationCreate().then(function() {
					conversationIndex(conversation);
				});
			}
		});
	},

	removed: function (id) {
		EsClient.delete({
			index: 'conversationsindex',
			type: 'conversations',
			id: id,
		});
	},
});



function conversationCreate() {
	return EsClient.indices.create({
		index: 'conversationsindex',
		body: {
			settings: {
				analysis: {
					filter: {
						conversation_filter: {
							type: 'nGram',
							min_gram: 1,
							max_gram: 20
						}
					},
					analyzer: {
						conversation_analyzer: {
							type: 'custom',
							tokenizer: 'standard',
							filter: [
								'lowercase',
								'conversation_filter'
							]
						}
					}
				}
			},
			mappings: {
				conversations: {
	        properties: {
	          id: {
	            type: 'string'
	          },

	          conversation_label: {
	            type: 'string',
							analyzer: 'conversation_analyzer',
							search_analyzer: 'standard'
	          },
	          conversation_date: {
	            type: 'string',
							analyzer: 'conversation_analyzer',
							search_analyzer: 'standard'
	          },
	          conversation: {
	            type: 'string',
							analyzer: 'conversation_analyzer',
							search_analyzer: 'standard'
	          },
	          belongs_to_contact: {
	            type: 'string'
	          },

						groupId: {
	            type: 'string'
	          },
	          created_by: {
	            type: 'string',
	          },
	          created_on: {
	            type: 'date',
	            format: 'strict_date_optional_time||epoch_millis'
	          }
	        }
      	}
			}
		}
	})
};

function conversationIndex(conversation) {
	return EsClient.index({
		index: 'conversationsindex',
		type: 'conversations',
		id: conversation._id,
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
};
