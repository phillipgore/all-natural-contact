Meteor.reactivePublish('reminderContacts', function(tagId, contactScrollDir, contactPivotNameLast) {
  if (this.userId) {
    var self = this;

		var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
    var tag = Tags.findOne({groupId: groupId, _id: tagId})
    var contactIds = tag.has_contacts
    var contacts = Contacts.find({groupId: groupId, _id: {$in: contactIds}}, {sort: {nameLast: 1, nameFirst: 1, company: 1}});
  	var entries = tag.reminder_time[0].entries

    if (_.has(tag, 'has_contacts')) {
      var reminderContacts = []
    	contacts.forEach(function(contact) {
    		var accepted = []
    		entries.forEach(function(entry) {
          if (contact.latest_conversation.length > 0) {
      			contact.latest_conversation.forEach(function functionName(conversation) {
      				if (entry === conversation.label) {
      					accepted.push(conversation);
      				} else {
                accepted.push({
                  date: '1776-07-04T00:00:00+00:00',
                  label: entries[0]
                });
              }
      			})
          } else {
            accepted.push({
              date: '1776-07-04T00:00:00+00:00',
              label: entries[0]
            });
          }
    		})

    		accepted.sort(function (a, b) {
    			if (a.date < b.date) {
    				return 1;
    			}
    			if (a.date > b.date) {
    				return -1;
    			}
    			// a must be equal to b
    			return 0;
    		});
        console.log('CONTACT: ' + contact._id +" "+ contact.first +" "+ contact.last +" "+ 'ACCEPTED: ' + accepted[0].date +" "+ accepted[0].label)
    		var contactProperties = {
    			_id: contact._id,
    			groupId: contact.groupId,
          first: contact.first,
          last: contact.last,
    			nameLast: contact.nameLast,
    			nameFirst: contact.nameFirst,
    			company: contact.company,
    			latest_conversation: accepted[0].date,
          created_on: contact.created_on,
    		}
    		reminderContacts.push(contactProperties)
    	})

      reminderContacts.sort(function (a, b) {
        if (a.latest_conversation < b.latest_conversation) {
          return 1;
        }
        if (a.latest_conversation > b.latest_conversation) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });

      _.each(reminderContacts, function(contact) {
        self.added('reminderContacts', Random.id(), contact);
      });

      self.ready();
    } else {
      return this.ready();
    }
  } else {
    return this.ready();
  }
});
