Meteor.publish('firstTag', function() {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		var personal = ['open', this.userId]
		var firstTag = Tags.find({groupId: groupId, milestoneTagType: false, personal: {$in: personal}}, {sort: {tagName: 1}, fields: {_id: 1, tagName: 1}, limit: 1});
		if (firstTag) {
			return firstTag;
		} else {
			return this.ready();
		}
	} else {
		return this.ready();
	}
});

Meteor.publish('lastTag', function(contactId) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		var personal = ['open', this.userId]
		var lastTag = Tags.find({groupId: groupId, milestoneTagType: false, personal: {$in: personal}}, {sort: {tagName: -1}, fields: {_id: 1, tagName: 1}, limit: 1});
		if (lastTag) {
			return lastTag;
		} else {
			return this.ready();
		}
	} else {
		return this.ready();
	}
});

Meteor.publish('tagScroll', function(tagScrollDir, tagPivotName) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		var personal = ['open', this.userId]
		var tagCount = Tags.find({groupId: groupId, milestoneTagType: false, personal: {$in: personal}}).count()
		if (tagCount > 0 && tagCount < 300) {
			var firstTag = Tags.findOne({groupId: groupId, milestoneTagType: false, personal: {$in: personal}}, {sort: {tagName: 1}})._id;
		} else {
			var firstTag = ''
		}

		if (!tagPivotName && tagCount > 0) {
			var tagPivotName = Tags.findOne({groupId: groupId, milestoneTagType: false, personal: {$in: personal}}, {sort: {tagName: 1}}).tagName;
		}

		if (tagScrollDir === 'up') {
			var last = false
			var positive = 250
			var negative = -250
		} else if (tagScrollDir === 'middle') {
			var last = Tags.find({groupId: groupId, milestoneTagType: false, personal: {$in: personal}, tagName: { $gte: tagPivotName }}, {sort: {tagName: 1}}).count() <= 150;
			var positive = 150
			var negative = -150
		} else if (tagScrollDir === 'down') {
			var last = Tags.find({groupId: groupId, milestoneTagType: false, personal: {$in: personal}, tagName: { $gte: tagPivotName }}, {sort: {tagName: 1}}).count() <= 250;
			var positive = 50
			var negative = -50
		} else if (tagScrollDir === 'alpha') {
			var last = Tags.find({groupId: groupId, milestoneTagType: false, personal: {$in: personal}, tagName: { $gte: tagPivotName }}, {sort: {tagName: 1}}).count() <= 295;
			var positive = 5
			var negative = -5
		}

		if (last) {

			return Tags.find({groupId: groupId, milestoneTagType: false, personal: {$in: personal}}, {sort: {tagName: -1}, fields: {has_contacts: 0}, limit: 300});

		} else {

			var tags = Tags.find({groupId: groupId, milestoneTagType: false, personal: {$in: personal}, tagName: { $lte: tagPivotName }}, {sort: {tagName: 1}}).fetch();

			if (tags.length >= positive) {
				var tags = tags.slice(negative);
			}

			if (tagCount > 0) {
				if (tags[0]._id === firstTag || tagCount < 300) {
					return Tags.find({groupId: groupId, milestoneTagType: false, personal: {$in: personal}}, {sort: {tagName: 1}, fields: {has_contacts: 0}, limit: 300});
				} else if (tagCount >= 300) {
					return Tags.find({groupId: groupId, milestoneTagType: false, personal: {$in: personal}, tagName: { $gte: tags[0].tagName }}, {sort: {tagName: 1}, fields: {has_contacts: 0}, limit: 300});
				} else {
					this.ready();
				}
			} else {
				this.ready();
			}
		}
	} else {
		return this.ready();
	}
});

Meteor.publish('infoTag', function(tagId) {
	if (this.userId) {
		check(tagId, String);
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		var personal = ['open', this.userId]
		return Tags.find({groupId: groupId, _id: tagId, personal: {$in: personal}})
	} else {
		return this.ready();
	}
});

Meteor.publish('milestoneTags', function(tagId) {
	if (this.userId) {
		check(tagId, String);
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		var personal = ['open', this.userId]
		return Tags.find({groupId: groupId, belongs_to: tagId, personal: {$in: personal}}, {sort: {created_on: 1}})
	} else {
		return this.ready();
	}
});

Meteor.reactivePublish('contactProcessTags', function(contactId) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		var personal = ['open', this.userId]
		var contact = Contacts.findOne({groupId: groupId, _id: contactId}, {reactive: true})

		if (_.has(contact, 'belongs_to_tags')) {
			var tags = contact.belongs_to_tags
			var process = Tags.find({groupId: groupId, _id: {$in: tags}, processTagType: true, personal: {$in: personal}}).fetch()

			var processIds = []
			for (var i = 0; i < process.length; i++) {
				processIds.push(process[i]._id)
			}

			var milestone = Tags.find({groupId: groupId, belongs_to: {$in: processIds}, personal: {$in: personal}}).fetch()
			var milestoneIds = []
			for (var i = 0; i < milestone.length; i++) {
				milestoneIds.push(milestone[i]._id)
			}

			var tagIds = processIds.concat(milestoneIds)
			return Tags.find({groupId: groupId, _id: {$in: tagIds}}, {sort: {created_on: 1}})
		} else {
			this.ready()
		}
	} else {
		return this.ready();
	}
});

Meteor.publish('processCount', function(contactId) {
	if (this.userId) {
		var self = this

		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		var personal = ['open', this.userId]
		var contact = Contacts.findOne({groupId: groupId, _id: contactId}, {reactive: true})

		if (_.has(contact, 'belongs_to_tags')) {
			var tags = contact.belongs_to_tags
			var process = Tags.find({groupId: groupId, _id: {$in: tags}, processTagType: true, personal: {$in: personal}}).fetch()

			var processIds = []
			for (var i = 0; i < process.length; i++) {
				processIds.push(process[i]._id)
			}

			var milestone = Tags.find({groupId: groupId, belongs_to: {$in: processIds}, personal: {$in: personal}}).fetch()
			var milestoneIds = []
			for (var i = 0; i < milestone.length; i++) {
				milestoneIds.push(milestone[i]._id)
			}

			var tagIds = processIds.concat(milestoneIds)
			var processCount = Tags.find({groupId: groupId, _id: {$in: tagIds}}, {sort: {created_on: 1}}).count()
		} else {
			var processCount = 0
		}

			var processCount = [{
				belongs_to_contact: contactId,
				processCount: processCount
			}];

		_.each(processCount, function(count) {
			self.added('processCount', Random.id(), count);
		});

		self.ready();
	} else {
		return this.ready();
	}
});


Meteor.publish('tagCount', function(userId) {
	if (this.userId) {
		var self = this
		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
		var personal = ['open', this.userId]
		var tagCount = Tags.find({groupId: groupId, milestoneTagType: false, personal: {$in: personal}}).count()

		var tagCount = [{
			belongs_to_group: 'groupId',
			tag_count: tagCount
		}];

		_.each(tagCount, function(count) {
			self.added('tagCount', Random.id(), count);
		});

		self.ready();
	} else {
		return this.ready();
	}
});
