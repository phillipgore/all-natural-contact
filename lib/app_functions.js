Meteor.appFunctions = {
	fakerData: function(createTags, createContacts, createConversations) {

		for (var i = 0; i < createTags; i++) {
			var name = faker.name.firstName() + ' Tag';
			var date = new Date();
			var tagProperties = {
				tag: name,
				tagName: name.toLowerCase().replace(/\s/g,'') + date.getTime().toString(),
				standardTagType: true,
				reminderTagType: false,
				processTagType: false,
				milestoneTagType: false
			}

			Meteor.call('tagInsert', tagProperties, function(error, result) {
				if (error) {
					return alert(error.reason);
				}
			});
		};

		var newContacts = [];
		for (var i = 0; i < createContacts; i++) {
			var first = faker.name.firstName();
			var last = faker.name.lastName();
			var date = new Date();
			var contactProperties = {
				prefix: "",
				first: first,
				middle: "",
				last: last,
				nameFirst: first.toLowerCase() + last.toLowerCase() + date.getTime().toString(),
				nameLast: last.toLowerCase() + first.toLowerCase() + date.getTime().toString(),
				suffix: "",

				phonetic_first: "",
				phonetic_middle: "",
				phonetic_last: "",

				nickname: "",

				job_title: "",
				department: "",
				company: faker.company.companyName(),
				is_company: false,

				maiden: "",

				phones: [],
				emails: [],
				urls: [],
				dates: [],
				relateds: [],
				addresses: []
			};

			Meteor.call('contactInsert', contactProperties, function(error, result) {
				if (error) {
					return alert(error.reason);
				} else {
					for (var cc = 0; cc < createConversations; cc++) {
						var date = moment(faker.date.past()).format('YYYY-MM-DD');
						var zulu = moment(date).format('YYYY-MM-DD');
						var local = moment().format('HH:mm:ssZ');
						var newLocal = date + "T" + local;
						var conversationProperties = {
							belongs_to_contact: result._id,
							conversation_label: "Phone",
							conversation_date: moment.tz(newLocal, "Zulu").format(),
							conversation: faker.lorem.sentences()
						}

						Meteor.call('conversationInsert', result._id, conversationProperties, function(error, result) {
							if (error) {
								return alert(error.reason);
							}
						});
					}
				}

			});
		}

	}
}
