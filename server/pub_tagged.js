// Contact Lists Publications
Meteor.publish('firstContact', function(tagId) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;

		if (tagId === 'all_contacts_tag') {
			return Contacts.find({groupId: groupId}, {sort: {nameLast: 1, nameFirst: 1, company: 1}, fields: {nameLast: 1, nameFirst: 1, company: 1}, limit: 1});
		} else {
			var tag = Tags.findOne({groupId: groupId, _id: tagId})
			if (_.has(tag, 'has_contacts')) {
				var contactIds = tag.has_contacts
				if (tag.reminderTagType) {
					return Contacts.find({groupId: groupId, _id: {$in: contactIds}}, {sort: {latest_conversation_date: 1, nameLast: 1, nameFirst: 1, company: 1}, fields: {latest_conversation_date: 1, nameLast: 1, nameFirst: 1, company: 1}, limit: 1});
				} else {
					return Contacts.find({groupId: groupId, _id: {$in: contactIds}}, {sort: {nameLast: 1, nameFirst: 1, company: 1}, fields: {nameLast: 1, nameFirst: 1, company: 1}, limit: 1});
				}
			} else {
				return this.ready();
			}
		}
	} else {
		return this.ready();
	}
});


Meteor.publish('lastContact', function(tagId) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;

		if (tagId === 'all_contacts_tag') {
			return Contacts.find({groupId: groupId}, {sort: {nameLast: -1, nameFirst: -1, company: -1}, fields: {nameLast: 1, nameFirst: 1, company: 1}, limit: 1});
		} else {
			var tag = Tags.findOne({groupId: groupId, _id: tagId})
			if (_.has(tag, 'has_contacts')) {
				var contactIds = tag.has_contacts
				if (tag.reminderTagType) {
					return Contacts.find({groupId: groupId, _id: {$in: contactIds}}, {sort: {latest_conversation_date: -1, nameLast: -1, nameFirst: -1, company: -1}, fields: {latest_conversation_date: 1, nameLast: 1, nameFirst: 1, company: 1}, limit: 1});
				} else {
					return Contacts.find({groupId: groupId, _id: {$in: contactIds}}, {sort: {nameLast: -1, nameFirst: -1, company: -1}, fields: {nameLast: 1, nameFirst: 1, company: 1}, limit: 1});
				}
			} else {
				return this.ready();
			}
		}
	} else {
		return this.ready();
	}
});


Meteor.reactivePublish('contactScroll', function(tagId, contactScrollDir, contactPivotNameLast) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		var contactCount = Contacts.find({groupId: groupId}).count()

		if (tagId === 'all_contacts_tag') {
			if (contactCount > 0) {
				var firstContact = Contacts.findOne({groupId: groupId}, {sort: {nameLast: 1, nameFirst: 1, company: 1}})._id;
			} else {
				var firstContact = ''
			}
		} else {
			var tag = Tags.findOne({groupId: groupId, _id: tagId})
			if (_.has(tag, 'has_contacts')) {
				var contactIds = tag.has_contacts
				var firstContact = Contacts.findOne({groupId: groupId, _id: {$in: contactIds}}, {sort: {nameLast: 1, nameFirst: 1, company: 1}})._id;
			} else {
				var firstContact = ''
			}
		}

		if (tagId === 'all_contacts_tag') {
			var taggedCount = Contacts.find({groupId: groupId}).count();

			if (!contactPivotNameLast && taggedCount > 0) {
				var pivot = Contacts.findOne({groupId: groupId}, {sort: {nameLast: 1, nameFirst: 1, company: 1}});
				var contactPivotNameLast = pivot.nameLast
			}

			if (contactScrollDir === 'up' || contactScrollDir === 'start') {
				var last = false
				var positive = 250
				var negative = -250
			} else if (contactScrollDir === 'middle') {
				var last = Contacts.find({groupId: groupId, nameLast: { $gte: contactPivotNameLast }}, {sort: {nameLast: 1, nameFirst: 1, company: 1}}).count() <= 150;
				var positive = 150
				var negative = -150
			} else if (contactScrollDir === 'down') {
				var last = Contacts.find({groupId: groupId, nameLast: { $gte: contactPivotNameLast }}, {sort: {nameLast: 1, nameFirst: 1, company: 1}}).count() <= 250;
				var positive = 50
				var negative = -50
			} else if (contactScrollDir === 'alpha') {
				var last = Contacts.find({groupId: groupId, nameLast: { $gte: contactPivotNameLast }}, {sort: {nameLast: 1, nameFirst: 1, company: 1}}).count() <= 295;
				var positive = 5
				var negative = -5
			}

			if (last) {

				return Contacts.find({groupId: groupId}, {sort: {nameLast: -1, nameFirst: -1, company: -1}, fields: {created_on: 1, first: 1, last: 1, company: 1, is_company: 1, nameLast: 1, nameFirst: 1}, limit: 300});

			} else {

				var contacts = Contacts.find({groupId: groupId, nameLast: { $lte: contactPivotNameLast }}, {sort: {nameLast: 1, nameFirst: 1, company: 1}, fields: {nameLast: 1}}).fetch();

				if (contacts.length > positive) {
					var contacts = contacts.slice(negative);
				}

				if (contactCount > 0) {
					if (contacts[0]._id === firstContact) {
						return Contacts.find({groupId: groupId}, {sort: {nameLast: 1, nameFirst: 1, company: 1}, fields: {created_on: 1, first: 1, last: 1, company: 1, is_company: 1, nameLast: 1, nameFirst: 1}, limit: 300});
					} else {
						return Contacts.find({groupId: groupId, nameLast: { $gte: contacts[0].nameLast }}, {sort: {nameLast: 1, nameFirst: 1, company: 1}, fields: {created_on: 1, first: 1, last: 1, company: 1, is_company: 1, nameLast: 1, nameFirst: 1}, limit: 300});
					}
				} else {
					this.ready()
				}
			}




		} else {
			var tag = Tags.findOne({groupId: groupId, _id: tagId}, {reactive: true});

			if (_.has(tag, 'has_contacts')) {
				var contactIds = tag.has_contacts
				var taggedCount = Contacts.find({groupId: groupId, _id: {$in: contactIds}}).count();

				if (!contactPivotNameLast && taggedCount > 0) {
					var contactPivotNameLast = Contacts.findOne({groupId: groupId, _id: {$in: contactIds}}, {sort: {nameLast: 1, nameFirst: 1, company: 1}}).nameLast;
				}

				if (contactScrollDir === 'up' || contactScrollDir === 'start') {
					var last = false
					var positive = 250
					var negative = -250
				} else if (contactScrollDir === 'middle') {
					var last = Contacts.find({groupId: groupId, _id: {$in: contactIds}, nameLast: { $gte: contactPivotNameLast }}, {sort: {nameLast: 1}, fields: {nameLast: 1, nameFirst: 1, company: 1}}).count() <= 150;
					var positive = 150
					var negative = -150
				} else if (contactScrollDir === 'down') {
					var last = Contacts.find({groupId: groupId, _id: {$in: contactIds}, nameLast: { $gte: contactPivotNameLast }}, {sort: {nameLast: 1}, fields: {nameLast: 1, nameFirst: 1, company: 1}}).count() <= 250;
					var positive = 50
					var negative = -50
				} else if (contactScrollDir === 'alpha') {
					var last = Contacts.find({groupId: groupId, _id: {$in: contactIds}, nameLast: { $gte: contactPivotNameLast }}, {sort: {nameLast: 1}, fields: {nameLast: 1, nameFirst: 1, company: 1}}).count() <= 295;
					var positive = 5
					var negative = -5
				}

				if (last) {

					if (tag.reminderTagType) {
						return Contacts.find({groupId: groupId, _id: {$in: contactIds}}, {sort: {latest_conversation_date: -1, nameLast: -1, nameFirst: -1, company: -1}, limit: 300, fields: {created_on: 1, first: 1, last: 1, company: 1, is_company: 1, nameLast: 1, nameFirst: 1, latest_conversation_date: 1}, reactive: true})
					} else {
						return Contacts.find({groupId: groupId, _id: {$in: contactIds}}, {sort: {nameLast: -1, nameFirst: -1, company: -1}, limit: 300, fields: {created_on: 1, first: 1, last: 1, company: 1, is_company: 1, nameLast: 1, nameFirst: 1}, reactive: true})
					}

				} else {

					var contacts = Contacts.find({groupId: groupId, _id: {$in: contactIds}, nameLast: { $lte: contactPivotNameLast }}, {sort: {nameLast: 1, nameFirst: 1, company: 1}, fields: {nameLast: 1}}).fetch();

					if (contacts.length >= positive) {
						var contacts = contacts.slice(negative);
					}

					if (contacts[0]._id === firstContact) {

						if (tag.reminderTagType) {
							return Contacts.find({groupId: groupId, _id: {$in: contactIds}}, {sort: {latest_conversation_date: 1, nameLast: 1, nameFirst: 1, company: 1}, fields: {created_on: 1, first: 1, last: 1, company: 1, is_company: 1, nameLast: 1, nameFirst: 1, latest_conversation_date: 1}, limit: 300, reactive: true})
						} else {
							return Contacts.find({groupId: groupId, _id: {$in: contactIds}}, {sort: {nameLast: 1, nameFirst: 1, company: 1}, fields: {created_on: 1, first: 1, last: 1, company: 1, is_company: 1, nameLast: 1, nameFirst: 1}, limit: 300, reactive: true})
						}

					} else {

						if (tag.reminderTagType) {
							return Contacts.find({groupId: groupId, _id: {$in: contactIds}, nameLast: { $gte: contacts[0].nameLast }}, {sort: {latest_conversation_date: 1, nameLast: 1, nameFirst: 1, company: 1}, fields: {created_on: 1, first: 1, last: 1, company: 1, is_company: 1, nameLast: 1, nameFirst: 1, latest_conversation_date: 1}, limit: 300, reactive: true})
						} else {
							return Contacts.find({groupId: groupId, _id: {$in: contactIds}, nameLast: { $gte: contacts[0].nameLast }}, {sort: {nameLast: 1, nameFirst: 1, company: 1}, fields: {created_on: 1, first: 1, last: 1, company: 1, is_company: 1, nameLast: 1, nameFirst: 1}, limit: 300, reactive: true})
						}
					}

				}
			} else {
				return this.ready();
			}
		}
	} else {
		return this.ready();
	}
});


Meteor.publish('taggedCount', function(tagId) {
	if (this.userId) {
		check(tagId, String);
		var self = this
		var tag = Tags.findOne(tagId)

		if (tagId === 'all_contacts_tag') {
			var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
			var count = Contacts.find({groupId: groupId}).count()
		} else if (_.has(tag, 'has_contacts')) {
			var count = tag.has_contacts.length
		} else {
			var count = 0;
		}
		var taggedCount = [{
			count_of: tagId,
			tagged_count: count
		}];

		_.each(taggedCount, function(count) {
			self.added('taggedCount', Random.id(), count);
		});

		self.ready();
	} else {
		return this.ready();
	}
});



Meteor.publish('taggedContactCount', function(tagIds, userId) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		Counts.publish(this, 'taggedContactCount', Contacts.find({groupId: groupId, belongs_to_tags: {$in: tagIds}}), {nonReactive: true});
	} else {
		return this.ready();
	}
});




import Future from 'fibers/future';
Meteor.publish('contactsSearch', function(searchText, userId) {
	if (this.userId) {
		var self = this
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		var future = new Future();

		EsClient.search({
			index: 'contactsindex',
			type: 'contacts',
			body: {
				query: {
					bool: {
						filter: {
							'term': { groupId: groupId }
						},
						must: [{
							multi_match: {
								query: searchText,
								type: 'most_fields',
								fields: ['prefix', 'first^1.3', 'middle', 'last^1.4', 'suffix', 'phonetic_first', 'phonetic_middle', 'phonetic_last', 'nickname^1.2', 'job_title', 'department', 'company^1.1', 'maiden', 'phones.phone^1.0', 'emails.email^1.09', 'urls.url^1.05', 'dates.date_entry', 'relateds.related^1.03', 'immps.immp_user_name^1.04', 'immps.immp_service', 'addresses.street^1.08', 'addresses.city^1.06', 'addresses.state^1.01', 'addresses.postal_code^1.07', 'notes^1.02']
							}
						}],
					}
				},
			  highlight: {
			    fields: {
						first: {'number_of_fragments': 0},
			      last: {'number_of_fragments': 0},
			      company: {'number_of_fragments': 0},
			      'addresses.street': {'number_of_fragments': 0},
			      'addresses.city': {'number_of_fragments': 0},
			      'addresses.state': {'number_of_fragments': 0},
			      'addresses.postal_code': {'number_of_fragments': 0},
			      'urls.url': {'number_of_fragments': 0},
			      'immps.immp_user_name': {'number_of_fragments': 0},
			      'immps.immp_service': {'number_of_fragments': 0},
			      notes: {'number_of_fragments': 0},
			      maiden: {'number_of_fragments': 0},
			      middle: {'number_of_fragments': 0},
			      'relateds.related': {'number_of_fragments': 0},
			      prefix: {'number_of_fragments': 0},
			      suffix: {'number_of_fragments': 0},
			      phonetic_first: {'number_of_fragments': 0},
			      phonetic_middle: {'number_of_fragments': 0},
			      phonetic_last: {'number_of_fragments': 0}
			    }
			  }
			},
			//size: 10,
		}).then(function(body) {
			var contacts = body.hits.hits;
			future.return(contacts);
		}, function(error) {
			results.reject(error);
		})

		_.each(future.wait(), function(contact) {
			var source = contact._source
			var highlight = contact.highlight
			var new_contact = _.extend(source, highlight);
			self.added('contactsSearch', Random.id(), new_contact);
		});

		self.ready();
	} else {
		return this.ready();
	}
});
