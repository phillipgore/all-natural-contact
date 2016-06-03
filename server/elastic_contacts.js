var cursor = Contacts.find({});

cursor.observeChanges({
	added: function (id) {
		var contact = Contacts.findOne({_id: id})
		EsClient.index({
			index: "contactsindex",
			type: "contacts",
			id: id,
			body: {
				//Name
				id: contact._id,

				prefix: contact.prefix,
				first: contact.first,
				middle: contact.middle,
				last: contact.last,
				nameFirst: contact.nameFirst,
				nameLast: contact.nameLast,
				suffix: contact.suffix,

				//Phonetic
				phonetic_first: contact.phonetic_first,
				phonetic_middle: contact.phonetic_middle,
				phonetic_last: contact.phonetic_last,

				//Nickname
				nickname: contact.nickname,

				//Profession
				job_title: contact.job_title,
				department: contact.department,
				company: contact.company,
				is_company: contact.is_company,

				//Maiden
				maiden: contact.maiden,
				notes: contact.notes,

				phones: contact.phones,
				emails: contact.emails,
				urls: contact.urls,
				dates: contact.dates,
				relateds: contact.relateds,
				immps: contact.immps,
				addresses: contact.addresses,

				belongs_to_tags: contact.belongs_to_tags,
				has_conversations: contact.has_conversations,
				latest_conversation_date: contact.latest_conversation_date,
				groupId: contact.groupId,
				created_by: contact.created_by,
				created_on: contact.created_on,
				updated_on: contact.updated_on
			}
		});
	},
	changed: function (id) {
		var contact = Contacts.findOne({_id: id})
		EsClient.index({
			index: "contactsindex",
			type: "contacts",
			id: id,
			body: {
				//Name
				id: contact._id,

				prefix: contact.prefix,
				first: contact.first,
				middle: contact.middle,
				last: contact.last,
				nameFirst: contact.nameFirst,
				nameLast: contact.nameLast,
				suffix: contact.suffix,

				//Phonetic
				phonetic_first: contact.phonetic_first,
				phonetic_middle: contact.phonetic_middle,
				phonetic_last: contact.phonetic_last,

				//Nickname
				nickname: contact.nickname,

				//Profession
				job_title: contact.job_title,
				department: contact.department,
				company: contact.company,
				is_company: contact.is_company,

				//Maiden
				maiden: contact.maiden,
				notes: contact.notes,

				phones: contact.phones,
				emails: contact.emails,
				urls: contact.urls,
				dates: contact.dates,
				relateds: contact.relateds,
				immps: contact.immps,
				addresses: contact.addresses,

				belongs_to_tags: contact.belongs_to_tags,
				has_conversations: contact.has_conversations,
				latest_conversation_date: contact.latest_conversation_date,
				groupId: contact.groupId,
				created_by: contact.created_by,
				created_on: contact.created_on,
				updated_on: contact.updated_on
			}
		});
	},
	removed: function (id) {
		EsClient.delete({
			index: "contactsindex",
			type: "contacts",
			id: id,
		});
	},
});
