var cursor = Contacts.find({});

cursor.observeChanges({
	added: function (id) {
		var contact = Contacts.findOne(
			{_id: id},
			{transform: function(doc) {
				doc.dates.forEach(function(date) {
					date.date_entry = moment(date.date_entry).format('MMMM D, YYYY');
				})
				return doc;
			}}
		);

		EsClient.indices.exists({
			index: 'contactsindex'
		}, function(error, exists) {
			if (exists) {
				contactIndex(contact);
			} else {
				contactCreate().then(function() {
					contactIndex(contact);
				});
			}
		});
	},

	changed: function (id) {
		var contact = Contacts.findOne(
			{_id: id},
			{transform: function(doc) {
				doc.dates.forEach(function(date) {
					date.date_entry = moment(date.date_entry).format('MMMM D, YYYY');
				})
				return doc;
			}}
		);

		EsClient.indices.exists({
			index: 'contactsindex'
		}, function(error, exists) {
			if (exists) {
				contactIndex(contact);
			} else {
				contactCreate().then(function() {
					contactIndex(contact);
				});
			}
		});
	},

	removed: function (id) {
		EsClient.delete({
			index: 'contactsindex',
			type: 'contacts',
			id: id,
		});
	},
});

function contactCreate() {
	return EsClient.indices.create({
		index: 'contactsindex',
		body: {
			settings: {
				analysis: {
					filter: {
						contacts_filter: {
							type: 'nGram',
							min_gram: 1,
							max_gram: 20
						}
					},
					analyzer: {
						contacts_analyzer: {
							type: 'custom',
							tokenizer: 'standard',
							filter: [
								'lowercase',
								'contacts_filter'
							]
						}
					}
				}
			},

			mappings: {
				contacts: {
					properties: {
						id: {
							type: 'string'
						},

						prefix: {
							type: 'string'
						},
						first: {
							type: 'string',
							analyzer: 'contacts_analyzer',
							search_analyzer: 'standard',
						},
						middle: {
							type: 'string',
							analyzer: 'contacts_analyzer',
							search_analyzer: 'standard'
						},
						last: {
							type: 'string',
							analyzer: 'contacts_analyzer',
							search_analyzer: 'standard'
						},
						nameFirst: {
							type: 'string'
						},
						nameLast: {
							type: 'string'
						},
						suffix: {
							type: 'string',
							analyzer: 'contacts_analyzer',
							search_analyzer: 'standard'
						},

						phonetic_first: {
							type: 'string',
							analyzer: 'contacts_analyzer',
							search_analyzer: 'standard'
						},
						phonetic_last: {
							type: 'string',
							analyzer: 'contacts_analyzer',
							search_analyzer: 'standard'
						},
						phonetic_middle: {
							type: 'string',
							analyzer: 'contacts_analyzer',
							search_analyzer: 'standard'
						},

						nickname: {
							type: 'string',
							analyzer: 'contacts_analyzer',
							search_analyzer: 'standard'
						},

						job_title: {
							type: 'string',
							analyzer: 'contacts_analyzer',
							search_analyzer: 'standard'
						},
						department: {
							type: 'string',
							analyzer: 'contacts_analyzer',
							search_analyzer: 'standard'
						},
						company: {
							type: 'string',
							analyzer: 'contacts_analyzer',
							search_analyzer: 'standard'
						},
						is_company: {
							type: 'boolean'
						},

						maiden: {
							type: 'string',
							analyzer: 'contacts_analyzer',
							search_analyzer: 'standard'
						},

						phones: {
							properties: {
								phone: {
									type: 'string',
									analyzer: 'contacts_analyzer',
									search_analyzer: 'standard'
								},
								phone_label: {
									type: 'string'
								}
							}
						},

						emails: {
							properties: {
								email: {
									type: 'string',
									analyzer: 'contacts_analyzer',
									search_analyzer: 'standard'
								},
								email_label: {
									type: 'string'
								}
							}
						},

						urls: {
							properties: {
								url: {
									type: 'string',
									analyzer: 'contacts_analyzer',
									search_analyzer: 'standard'
								},
								url_label: {
									type: 'string'
								}
							}
						},

						dates: {
							properties: {
								date_entry: {
									type: 'string',
									analyzer: 'contacts_analyzer',
									search_analyzer: 'standard'
								},
								date_label: {
									type: 'string'
								}
							}
						},

						relateds: {
							properties: {
								related: {
									type: 'string',
									analyzer: 'contacts_analyzer',
									search_analyzer: 'standard'
								},
								related_label: {
									type: 'string'
								}
							}
						},

						immps: {
							properties: {
								immp_label: {
									type: 'string'
								},
								immp_service: {
									type: 'string',
									analyzer: 'contacts_analyzer',
									search_analyzer: 'standard'
								},
								immp_user_name: {
									type: 'string',
									analyzer: 'contacts_analyzer',
									search_analyzer: 'standard'
								}
							}
						},

						addresses: {
							properties: {
								address_label: {
									type: 'string'
								},
								city: {
									type: 'string',
									analyzer: 'contacts_analyzer',
									search_analyzer: 'standard'
								},
								postal_code: {
									type: 'string',
									analyzer: 'contacts_analyzer',
									search_analyzer: 'standard'
								},
								state: {
									type: 'string',
									analyzer: 'contacts_analyzer',
									search_analyzer: 'standard'
								},
								street: {
									type: 'string',
									analyzer: 'contacts_analyzer',
									search_analyzer: 'standard'
								}
							}
						},

						notes: {
							'type': 'string',
							analyzer: 'contacts_analyzer',
							search_analyzer: 'standard'
						},

						belongs_to_tags: {
							type: 'string'
						},
						has_conversations: {
							type: 'string'
						},
						latest_conversation_date: {
							type: 'date',
							format: 'strict_date_optional_time||epoch_millis'
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
						},

					}
				}
			}
		}
	});
};

function contactIndex(contact) {
	return EsClient.index({
		index: 'contactsindex',
		type: 'contacts',
		id: contact._id,
		body: {
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
};
