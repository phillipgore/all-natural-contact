Contacts = new Mongo.Collection('contacts');
ProcessCount = new Mongo.Collection('processCount');
ContactsSearch = new Mongo.Collection('contactsSearch');

ContactsSchema = new SimpleSchema({
	prefix: {
		type: String,
		label: "Prefix",
		optional: true
	},
	first: {
		type: String,
		label: "First Name",
		optional: true
	},
	middle: {
		type: String,
		label: "Middle Name",
		optional: true
	},
	last: {
		type: String,
		label: "Last Name",
		optional: true
	},
	nameFirst: {
		type: String,
		label: "",
		defaultValue: "aaaaaaaa" + moment(Number).toString()
	},
	nameLast: {
		type: String,
		label: "",
		defaultValue: "aaaaaaaa" + moment(Number).toString()
	},
	suffix: {
		type: String,
		label: "Suffix",
		optional: true
	},

	phonetic_first: {
		type: String,
		label: "Phonetic First Name",
		optional: true
	},
	phonetic_middle: {
		type: String,
		label: "Phonetic Middle Name",
		optional: true
	},
	phonetic_last: {
		type: String,
		label: "Phonetic Last Name",
		optional: true
	},

	nickname: {
		type: String,
		label: "Nickname",
		optional: true
	},

	job_title: {
		type: String,
		label: "Job Title",
		optional: true
	},
	department: {
		type: String,
		label: "Department",
		optional: true
	},
	company: {
		type: String,
		label: "Company",
		optional: true
	},
	is_company: {
		type: Boolean,
		label: "Contact is Company",
		defaultValue: false
	},

	maiden: {
		type: String,
		label: "Maiden Name",
		optional: true
	},

	"phones.$.phone_label": {
		type: String,
		label: "Phone Label",
		defaultValue: "Unknown"
	},
	"phones.$.phone": {
		type: String,
		label: "Phone Number",
		optional: true
	},

	"emails.$.email_label": {
		type: String,
		label: "Email Label",
		defaultValue: "Unknown"
	},
	"emails.$.email": {
		type: String,
		label: "Email Address",
		optional: true
	},

	"urls.$.url_label": {
		type: String,
		label: "URL Label",
		defaultValue: "Unknown"
	},
	"urls.$.url": {
		type: String,
		label: "URL",
		optional: true
	},

	"dates.$.date_label": {
		type: String,
		label: "Date Label",
		defaultValue: "Unknown"
	},
	"dates.$.date_entry": {
		type: String,
		label: "Date",
		optional: true
	},

	"relateds.$.related_label": {
		type: String,
		label: "Related Label",
		defaultValue: "Unknown"
	},
	"relateds.$.related": {
		type: String,
		label: "Related",
		optional: true
	},

	"immps.$.immp_label": {
		type: String,
		label: "Messaging Label",
		defaultValue: "Unknown"
	},
	"immps.$.immp_user_name": {
		type: String,
		label: "Messaging User Name",
		optional: true
	},
	"immps.$.immp_service": {
		type: String,
		label: "Immp Service",
		defaultValue: "Unknown"
	},

	"addresses.$.address_label": {
		type: String,
		label: "Address Label",
		defaultValue: "Unknown"
	},
	"addresses.$.street": {
		type: String,
		label: "Street",
		optional: true
	},
	"addresses.$.city": {
		type: String,
		label: "City",
		optional: true
	},
	"addresses.$.state": {
		type: String,
		label: "State",
		optional: true
	},
	"addresses.$.postal_code": {
		type: String,
		label: "Zip Code",
		optional: true
	},

	notes: {
		type: String,
		label: "Notes",
		optional: true
	},
	
	belongs_to_tags: {
		type: [String],
		label: "Belongs To Tags",
		optional: true
	},
	has_conversations: {
		type: [String],
		label: "Contact Tag Has Conversations",
		optional: true
	},
	latest_conversation_date: {
		type: String,
		label: "Latest Conversation Date",
		defaultValue: "1776-07-04T12:00:00+00:00"
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

Contacts.attachSchema( ContactsSchema );

Meteor.methods({
	contactInsert: function(contactProperties) {
		var contactId = Contacts.insert(contactProperties);

		return {
			_id: contactId
		};
	},

	contactUpdate: function(contact_id, contactProperties) {
		Contacts.update(contact_id, {$set: contactProperties});
	},

	contactRemove: function(contact_ids) {
		Contacts.remove({_id: {$in: contact_ids}});
		Conversations.remove({belongs_to_contact: {$in: contact_ids}});
		Tags.update({}, {$pull: {has_contacts: {$in: contact_ids}}}, { multi: true });
	}
});
