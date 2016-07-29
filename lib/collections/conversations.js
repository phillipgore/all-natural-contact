Conversations = new Mongo.Collection('conversations');
ConversationCount = new Mongo.Collection('conversationCount');

ConversationsSchema = new SimpleSchema({
	conversation_label: {
		type: String,
		label: "Conversation Label",
	},
	conversation_date: {
		type: String,
		label: "Conversation Date",
	},
	conversation: {
		type: String,
		label: "conversation",
		optional: true
	},
	belongs_to_contact: {
		type: String,
		label: "Conversation Belongs To",
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

Conversations.attachSchema( ConversationsSchema );

Meteor.methods({
	conversationInsert: function(contact_id, conversationProperties) {
		var conversationId = Conversations.insert(conversationProperties);
		Contacts.update({_id: contact_id}, {$addToSet: {has_conversations: conversationId}})
		Meteor.call('mostRecent', contact_id);
		return {
			_id: conversationId
		};
	},

	conversationUpdate: function(contact_id, conversation_id, conversationProperties) {
		Conversations.update(conversation_id, {$set: conversationProperties})
		Meteor.call('mostRecent', contact_id);
	},

	conversationRemove: function(contact_id, conversation_ids, conversationDate) {
		Conversations.remove({_id: {$in: conversation_ids}});
		Contacts.update({_id: contact_id}, {$pull: {has_conversations: {$in: conversation_ids}}}, { multi: true });
		Meteor.call('mostRecent', contact_id);
	}
});
