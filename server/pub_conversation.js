Meteor.methods({
	mostRecent: function(contactId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		var conversationLabels = Labels.find({groupId: groupId, labelType: 'conversation_label'})

		var latest_conversation = []
		conversationLabels.forEach(function(label) {
			var conversation = Conversations.findOne({groupId: groupId, belongs_to_contact: contactId, conversation_label: label.labelName}, {sort: {conversation_date: -1}})

			if (conversation) {
				var latestProperties = {
					date: conversation.conversation_date,
					label: conversation.conversation_label,
				}
				latest_conversation.push(latestProperties)
			}
		})

		latest_conversation.sort(function (a, b) {
		  if (a.date < b.date) {
		    return 1;
		  }
		  if (a.date > b.date) {
		    return -1;
		  }
		  // a must be equal to b
		  return 0;
		});
		
		Contacts.update({groupId: groupId, _id: contactId}, {$set: {latest_conversation: latest_conversation}})
	},
});

// Contact Publications
Meteor.publish('firstConversation', function(contactId) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		check(contactId, String);

		var contact = Contacts.findOne({groupId: groupId, _id: contactId})
		if (_.has(contact, 'has_conversations')) {
			var conversationIds = contact.has_conversations
			return Conversations.find({groupId: groupId, _id: {$in: conversationIds}}, {sort: {conversation_date: -1}, fields: {_id: 1, conversation_date: 1}, limit: 1});
		} else {
			return this.ready();
		}
	} else {
		return this.ready();
	}
});

Meteor.publish('lastConversation', function(contactId) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		check(contactId, String);

		var contact = Contacts.findOne({groupId: groupId, _id: contactId})
		if (_.has(contact, 'has_conversations')) {
			var conversationIds = contact.has_conversations
			return Conversations.find({groupId: groupId, _id: {$in: conversationIds}}, {sort: {conversation_date: 1}, fields: {_id: 1, conversation_date: 1}, limit: 1});
		} else {
			return this.ready();
		}
	} else {
		return this.ready();
	}
});

Meteor.publish('contactInfo', function(contactId, conScrollDir, conPivotDate) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		check(contactId, String);

		var contact = Contacts.findOne({groupId: groupId, _id: contactId})
		var conversationIds = contact.has_conversations

		if (conversationIds) {
			var conCount = conversationIds.length;
		} else {
			var conCount = 0;
		}

		if (!conPivotDate && conCount > 0) {
			var conPivotDate = Conversations.findOne({groupId: groupId, belongs_to_contact: contactId}, {sort: {conversation_date: -1}}).conversation_date;
		}

		if (conScrollDir === 'up') {
			var last = false
			var positive = 250
			var negative = -250
		} else if (conScrollDir === 'middle' || conScrollDir === 'alpha') {
			var last = Conversations.find({groupId: groupId, belongs_to_contact: contactId, "conversation_date": { $lte: conPivotDate }}, {sort: {conversation_date: -1}}).count() <= 150;
			var positive = 150
			var negative = -150
		} else if (conScrollDir === 'down') {
			var last = Conversations.find({groupId: groupId, belongs_to_contact: contactId, "conversation_date": { $lte: conPivotDate }}, {sort: {conversation_date: -1}}).count() <= 250;
			var positive = 50
			var negative = -50
		};

		if (last) {
			if (conCount > 0) {
				return [
					Contacts.find({groupId: groupId, _id: contactId}, {fields: {has_conversations: 0}}),
					Conversations.find({groupId: groupId, belongs_to_contact: contactId}, {sort: {conversation_date: 1}, limit: 300}),
				]
			} else {
				return [
					Contacts.find({groupId: groupId, _id: contactId}, {fields: {has_conversations: 0}}),
				]
			}
		} else {
			var conversations = Conversations.find({groupId: groupId, belongs_to_contact: contactId, "conversation_date": { $gte: conPivotDate }}, {sort: {conversation_date: -1}}).fetch();

			if (conversations.length > positive) {
				var conversations = conversations.slice(negative);
			}

			if (conCount > 0) {
				return [
					Contacts.find({groupId: groupId, _id: contactId}, {fields: {has_conversations: 0}}),
					Conversations.find({groupId: groupId, belongs_to_contact: contactId, "conversation_date": { $lte: conversations[0].conversation_date }}, {sort: {conversation_date: -1}, limit: 300}),
				]
			} else {
				return [
					Contacts.find({groupId: groupId, _id: contactId}, {fields: {has_conversations: 0}}),
				]
			}
		}
	} else {
		return this.ready();
	}
});



Meteor.publish('conversationCount', function(contactId) {
	if (this.userId) {
		check(contactId, String);
		var self = this
		var contact = Contacts.findOne(contactId)

		if (_.has(contact, 'has_conversations')) {
			var count = contact.has_conversations.length;
		} else {
			var count = 0;
		}

		var conversationCount = [{
			count_of: contactId,
			conversation_count: count
		}];

		_.each(conversationCount, function(count) {
			self.added('conversationCount', Random.id(), count);
		});

		self.ready();
	} else {
		return this.ready();
	}
});




Meteor.publish('accountContactCount', function(contactId) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		Counts.publish(this, 'accountContactCount', Contacts.find({groupId: groupId}), {nonReactive: false});
		Counts.publish(this, 'totalConversationCount', Conversations.find({groupId: groupId}), {nonReactive: false});
	} else {
		return this.ready();
	}
});

Meteor.publish('deleteContacts', function(contactIds) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		return [
			Contacts.find({groupId: groupId, _id: {$in: contactIds}}, {fields: {_id: 1}}),
		]
	} else {
		return this.ready();
	}
});



//Conversation Information
Meteor.publish('allConversations', function() {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		return Conversations.find({groupId: groupId}, {fields: {contact_id: 1}})
	} else {
		return this.ready();
	}
});

Meteor.publish('conversationNew', function(contactId) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		check(contactId, String);
		return Contacts.find({groupId: groupId, _id: contactId}, {fields: {has_conversations: 0}});
	} else {
		return this.ready();
	}
});

Meteor.publish('conversationUpdate', function(conversationId, contactId) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		check(conversationId, String);

		return [
			Contacts.find({groupId: groupId, _id: contactId}, {fields: {has_conversations: 0}}),
			Conversations.find({groupId: groupId, _id: conversationId}),
		]
	} else {
		return this.ready();
	}
});

Meteor.publish('conversationRecent', function() {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		return Conversations.find({groupId: groupId}, {sort: {conversation_date: -1}, fields: {conversation_date: 1}, limit: 1})
	} else {
		return this.ready();
	}
});
