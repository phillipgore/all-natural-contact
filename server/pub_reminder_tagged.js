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
    	contacts.forEach(function(contact, index) {
        var accepted = []
    		entries.forEach(function(entry) {
          if (contact.latest_conversation && contact.latest_conversation.length > 0) {
      			contact.latest_conversation.forEach(function functionName(conversation) {
      				if (entry === conversation.label) {
      					accepted.push(conversation);
      				} else {
                accepted.push({
                  date: '1776-07-04T12:00:00+00:00',
                  label: entries[0]
                });
              }
      			})
          } else {
            accepted.push({
              date: '1776-07-04T12:00:00+00:00',
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
        //console.log('CONTACT: ' + contact._id +" "+ contact.first +" "+ contact.last +" "+ 'ACCEPTED: ' + accepted[0].date +" "+ accepted[0].label)
    		var contactProperties = {
    			_id: contact._id,
    			groupId: contact.groupId,
          first: contact.first,
          last: contact.last,
    			nameLast: contact.nameLast,
    			nameFirst: contact.nameFirst,
    			company: contact.company,
          is_company: contact.is_company,
    			latest_conversation: accepted[0].date,
          created_on: contact.created_on,
    		}
    		reminderContacts.push(contactProperties)
    	})

      reminderContacts.sort(function (a, b) {
        if (a.latest_conversation > b.latest_conversation) {
          return 1;
        }
        if (a.latest_conversation < b.latest_conversation) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });

      reminderContacts.forEach(function (contact, index) {
        contact.position = index;
      });


      var pivotIndex = []
      if (contactPivotNameLast) {
        reminderContacts.forEach(function (contact, index) {
          if (contact.nameLast === contactPivotNameLast) {
            pivotIndex.push(index)
          }
        })
      } else {
        pivotIndex.push(0)
      }

      if (contactScrollDir === 'up' || contactScrollDir === 'start') {
				var first = pivotIndex[0] <= 250;
				var start = pivotIndex[0] - 250;
				var end = pivotIndex[0] + 50;
        var last = false;
			} else if (contactScrollDir === 'middle') {
				var first = pivotIndex[0] <= 150;
				var start = pivotIndex[0] - 150;
				var end = pivotIndex[0] + 150;
        var last = reminderContacts.length - start <= 150;
			} else if (contactScrollDir === 'down') {
				var first = false;
				var start = pivotIndex[0] - 50;
				var end = pivotIndex[0] + 250;
        var last = reminderContacts.length - start <= 250;
			}

      if (reminderContacts.length > 300) {
        console.log(contactPivotNameLast)
        console.log(pivotIndex[0])
        console.log('contactScrollDir: ' + contactScrollDir + '\n')

        console.log('first: ' + first)
        console.log('start: ' + start)
        console.log('end: ' + end)
        console.log('last: ' + last + '\n')


        if (first) {
          var reminderContacts = reminderContacts.slice(0, 300)
        } else if (last) {
          var reminderContacts = reminderContacts.slice(-300)
        } else {
          var reminderContacts = reminderContacts.slice(start, end);
        }
      }

      console.log('sent: ' + reminderContacts.length)
      console.log('\n/----------------------------------------/\n')

      _.each(reminderContacts, function(contact) {
        self.added('reminderContacts', contact._id, contact);
      });

      self.ready();
    } else {
      return this.ready();
    }
  } else {
    return this.ready();
  }
});
