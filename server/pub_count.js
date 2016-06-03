// Count Tag Publications
Meteor.publish('accountTagCount', function() {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).group.group_id;
		Counts.publish(this, 'accountTagCount', Tags.find({groupId: groupId, belongs_to: {$exists: false }}), {nonReactive: false});
	} else {
		return this.ready();
	}
});

Meteor.publish('accountConversationCount', function() {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).group.group_id;
		Counts.publish(this, 'accountConversationCount', Conversations.find({groupId: groupId}), {nonReactive: false});
	} else {
		return this.ready();
	}
});

Meteor.publish('tagAlphaCounts', function() {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).group.group_id;
		Counts.publish(this, 'aTagCount', Tags.find({groupId: groupId, tag: { $gt: "a", $lt: "b" }, tag: { $gt: "A", $lt: "B" }}), {nonReactive: true});
		Counts.publish(this, 'bTagCount', Tags.find({groupId: groupId, tag: { $gt: "b", $lt: "c" }, tag: { $gt: "B", $lt: "C" }}), {nonReactive: true});
		Counts.publish(this, 'cTagCount', Tags.find({groupId: groupId, tag: { $gt: "c", $lt: "d" }, tag: { $gt: "C", $lt: "D" }}), {nonReactive: true});
		Counts.publish(this, 'dTagCount', Tags.find({groupId: groupId, tag: { $gt: "d", $lt: "e" }, tag: { $gt: "D", $lt: "E" }}), {nonReactive: true});
		Counts.publish(this, 'eTagCount', Tags.find({groupId: groupId, tag: { $gt: "e", $lt: "f" }, tag: { $gt: "E", $lt: "F" }}), {nonReactive: true});
		Counts.publish(this, 'fTagCount', Tags.find({groupId: groupId, tag: { $gt: "f", $lt: "g" }, tag: { $gt: "F", $lt: "G" }}), {nonReactive: true});
		Counts.publish(this, 'gTagCount', Tags.find({groupId: groupId, tag: { $gt: "g", $lt: "h" }, tag: { $gt: "G", $lt: "H" }}), {nonReactive: true});
		Counts.publish(this, 'hTagCount', Tags.find({groupId: groupId, tag: { $gt: "h", $lt: "i" }, tag: { $gt: "H", $lt: "I" }}), {nonReactive: true});
		Counts.publish(this, 'iTagCount', Tags.find({groupId: groupId, tag: { $gt: "i", $lt: "j" }, tag: { $gt: "I", $lt: "J" }}), {nonReactive: true});
		Counts.publish(this, 'jTagCount', Tags.find({groupId: groupId, tag: { $gt: "j", $lt: "k" }, tag: { $gt: "J", $lt: "K" }}), {nonReactive: true});
		Counts.publish(this, 'kTagCount', Tags.find({groupId: groupId, tag: { $gt: "k", $lt: "l" }, tag: { $gt: "K", $lt: "L" }}), {nonReactive: true});
		Counts.publish(this, 'lTagCount', Tags.find({groupId: groupId, tag: { $gt: "l", $lt: "m" }, tag: { $gt: "L", $lt: "M" }}), {nonReactive: true});
		Counts.publish(this, 'mTagCount', Tags.find({groupId: groupId, tag: { $gt: "m", $lt: "n" }, tag: { $gt: "M", $lt: "N" }}), {nonReactive: true});
		Counts.publish(this, 'nTagCount', Tags.find({groupId: groupId, tag: { $gt: "n", $lt: "o" }, tag: { $gt: "N", $lt: "O" }}), {nonReactive: true});
		Counts.publish(this, 'oTagCount', Tags.find({groupId: groupId, tag: { $gt: "o", $lt: "p" }, tag: { $gt: "O", $lt: "P" }}), {nonReactive: true});
		Counts.publish(this, 'pTagCount', Tags.find({groupId: groupId, tag: { $gt: "p", $lt: "q" }, tag: { $gt: "P", $lt: "Q" }}), {nonReactive: true});
		Counts.publish(this, 'qTagCount', Tags.find({groupId: groupId, tag: { $gt: "q", $lt: "r" }, tag: { $gt: "Q", $lt: "R" }}), {nonReactive: true});
		Counts.publish(this, 'rTagCount', Tags.find({groupId: groupId, tag: { $gt: "r", $lt: "s" }, tag: { $gt: "R", $lt: "S" }}), {nonReactive: true});
		Counts.publish(this, 'sTagCount', Tags.find({groupId: groupId, tag: { $gt: "s", $lt: "t" }, tag: { $gt: "S", $lt: "T" }}), {nonReactive: true});
		Counts.publish(this, 'tTagCount', Tags.find({groupId: groupId, tag: { $gt: "t", $lt: "u" }, tag: { $gt: "T", $lt: "U" }}), {nonReactive: true});
		Counts.publish(this, 'uTagCount', Tags.find({groupId: groupId, tag: { $gt: "u", $lt: "v" }, tag: { $gt: "U", $lt: "V" }}), {nonReactive: true});
		Counts.publish(this, 'vTagCount', Tags.find({groupId: groupId, tag: { $gt: "v", $lt: "w" }, tag: { $gt: "V", $lt: "W" }}), {nonReactive: true});
		Counts.publish(this, 'wTagCount', Tags.find({groupId: groupId, tag: { $gt: "w", $lt: "x" }, tag: { $gt: "W", $lt: "X" }}), {nonReactive: true});
		Counts.publish(this, 'xTagCount', Tags.find({groupId: groupId, tag: { $gt: "x", $lt: "y" }, tag: { $gt: "X", $lt: "Y" }}), {nonReactive: true});
		Counts.publish(this, 'yTagCount', Tags.find({groupId: groupId, tag: { $gt: "y", $lt: "z" }, tag: { $gt: "Y", $lt: "Z" }}), {nonReactive: true});
		Counts.publish(this, 'zTagCount', Tags.find({groupId: groupId, tag: { $gt: "z" }, tag: { $gt: "Z" }}), {nonReactive: true});
	} else {
		return this.ready();
	}
});

Meteor.publish('counts', function(tagId) {
	if (this.userId) {
		var groupId = Meteor.users.findOne({_id: this.userId}).group.group_id;
		check(tagId, String);

		if (tagId === "all_contacts_tag") {

			Counts.publish(this, 'aCount', Contacts.find({groupId: groupId, nameLast: { $gt: "a", $lt: "b" }}), {nonReactive: true});
			Counts.publish(this, 'bCount', Contacts.find({groupId: groupId, nameLast: { $gt: "b", $lt: "c" }}), {nonReactive: true});
			Counts.publish(this, 'cCount', Contacts.find({groupId: groupId, nameLast: { $gt: "c", $lt: "d" }}), {nonReactive: true});
			Counts.publish(this, 'dCount', Contacts.find({groupId: groupId, nameLast: { $gt: "d", $lt: "e" }}), {nonReactive: true});
			Counts.publish(this, 'eCount', Contacts.find({groupId: groupId, nameLast: { $gt: "e", $lt: "f" }}), {nonReactive: true});
			Counts.publish(this, 'fCount', Contacts.find({groupId: groupId, nameLast: { $gt: "f", $lt: "g" }}), {nonReactive: true});
			Counts.publish(this, 'gCount', Contacts.find({groupId: groupId, nameLast: { $gt: "g", $lt: "h" }}), {nonReactive: true});
			Counts.publish(this, 'hCount', Contacts.find({groupId: groupId, nameLast: { $gt: "h", $lt: "i" }}), {nonReactive: true});
			Counts.publish(this, 'iCount', Contacts.find({groupId: groupId, nameLast: { $gt: "i", $lt: "j" }}), {nonReactive: true});
			Counts.publish(this, 'jCount', Contacts.find({groupId: groupId, nameLast: { $gt: "j", $lt: "k" }}), {nonReactive: true});
			Counts.publish(this, 'kCount', Contacts.find({groupId: groupId, nameLast: { $gt: "k", $lt: "l" }}), {nonReactive: true});
			Counts.publish(this, 'lCount', Contacts.find({groupId: groupId, nameLast: { $gt: "l", $lt: "m" }}), {nonReactive: true});
			Counts.publish(this, 'mCount', Contacts.find({groupId: groupId, nameLast: { $gt: "m", $lt: "n" }}), {nonReactive: true});
			Counts.publish(this, 'nCount', Contacts.find({groupId: groupId, nameLast: { $gt: "n", $lt: "o" }}), {nonReactive: true});
			Counts.publish(this, 'oCount', Contacts.find({groupId: groupId, nameLast: { $gt: "o", $lt: "p" }}), {nonReactive: true});
			Counts.publish(this, 'pCount', Contacts.find({groupId: groupId, nameLast: { $gt: "p", $lt: "q" }}), {nonReactive: true});
			Counts.publish(this, 'qCount', Contacts.find({groupId: groupId, nameLast: { $gt: "q", $lt: "r" }}), {nonReactive: true});
			Counts.publish(this, 'rCount', Contacts.find({groupId: groupId, nameLast: { $gt: "r", $lt: "s" }}), {nonReactive: true});
			Counts.publish(this, 'sCount', Contacts.find({groupId: groupId, nameLast: { $gt: "s", $lt: "t" }}), {nonReactive: true});
			Counts.publish(this, 'tCount', Contacts.find({groupId: groupId, nameLast: { $gt: "t", $lt: "u" }}), {nonReactive: true});
			Counts.publish(this, 'uCount', Contacts.find({groupId: groupId, nameLast: { $gt: "u", $lt: "v" }}), {nonReactive: true});
			Counts.publish(this, 'vCount', Contacts.find({groupId: groupId, nameLast: { $gt: "v", $lt: "w" }}), {nonReactive: true});
			Counts.publish(this, 'wCount', Contacts.find({groupId: groupId, nameLast: { $gt: "w", $lt: "x" }}), {nonReactive: true});
			Counts.publish(this, 'xCount', Contacts.find({groupId: groupId, nameLast: { $gt: "x", $lt: "y" }}), {nonReactive: true});
			Counts.publish(this, 'yCount', Contacts.find({groupId: groupId, nameLast: { $gt: "y", $lt: "z" }}), {nonReactive: true});
			Counts.publish(this, 'zCount', Contacts.find({groupId: groupId, nameLast: { $gt: "z" }}), {nonReactive: true});

		} else {
			var tag = Tags.findOne({groupId: groupId, _id: tagId})

			if (_.has(tag, 'has_contacts')) {
				var tagged = tag.has_contacts;

				Counts.publish(this, 'aCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "a", $lt: "b" }}), {nonReactive: true});
				Counts.publish(this, 'bCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "b", $lt: "c" }}), {nonReactive: true});
				Counts.publish(this, 'cCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "c", $lt: "d" }}), {nonReactive: true});
				Counts.publish(this, 'dCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "d", $lt: "e" }}), {nonReactive: true});
				Counts.publish(this, 'eCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "e", $lt: "f" }}), {nonReactive: true});
				Counts.publish(this, 'fCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "f", $lt: "g" }}), {nonReactive: true});
				Counts.publish(this, 'gCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "g", $lt: "h" }}), {nonReactive: true});
				Counts.publish(this, 'hCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "h", $lt: "i" }}), {nonReactive: true});
				Counts.publish(this, 'iCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "i", $lt: "j" }}), {nonReactive: true});
				Counts.publish(this, 'jCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "j", $lt: "k" }}), {nonReactive: true});
				Counts.publish(this, 'kCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "k", $lt: "l" }}), {nonReactive: true});
				Counts.publish(this, 'lCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "l", $lt: "m" }}), {nonReactive: true});
				Counts.publish(this, 'mCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "m", $lt: "n" }}), {nonReactive: true});
				Counts.publish(this, 'nCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "n", $lt: "o" }}), {nonReactive: true});
				Counts.publish(this, 'oCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "o", $lt: "p" }}), {nonReactive: true});
				Counts.publish(this, 'pCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "p", $lt: "q" }}), {nonReactive: true});
				Counts.publish(this, 'qCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "q", $lt: "r" }}), {nonReactive: true});
				Counts.publish(this, 'rCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "r", $lt: "s" }}), {nonReactive: true});
				Counts.publish(this, 'sCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "s", $lt: "t" }}), {nonReactive: true});
				Counts.publish(this, 'tCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "t", $lt: "u" }}), {nonReactive: true});
				Counts.publish(this, 'uCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "u", $lt: "v" }}), {nonReactive: true});
				Counts.publish(this, 'vCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "v", $lt: "w" }}), {nonReactive: true});
				Counts.publish(this, 'wCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "w", $lt: "x" }}), {nonReactive: true});
				Counts.publish(this, 'xCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "x", $lt: "y" }}), {nonReactive: true});
				Counts.publish(this, 'yCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "y", $lt: "z" }}), {nonReactive: true});
				Counts.publish(this, 'zCount', Contacts.find({groupId: groupId, _id: {$in: tagged}, nameLast: { $gt: "z" }}), {nonReactive: true});
			} else {
				this.ready();
			}
		}
	} else {
		return this.ready();
	}
});
