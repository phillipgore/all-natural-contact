Template.tagProcess.onRendered(function() {
	Session.set('process_ready', '')
	
	var checkProcessCount = setInterval(function() {
		if (ProcessCount.find().count() > 0) {
			clearInterval(checkProcessCount);
			var expectedProcess = ProcessCount.findOne().processCount;
			
			if (expectedProcess === 0) {
				$('.js_process_loader').hide();
				Session.set('process_ready', true)
			} else {
				var checkProcessRecieved = setInterval(function() {
					var receivedProcess = Tags.find().count();
					if (receivedProcess === expectedProcess) {
						clearInterval(checkProcessRecieved);
						
						var checkProcessVisible = setInterval(function() {
							var visibleProcessCount = $('.js_tag').length;
							
							if (visibleProcessCount === receivedProcess) {
								clearInterval(checkProcessVisible);
								var contactId = Session.get('currentContact');
								var contact = Contacts.findOne({_id: contactId})
								if (_.has(contact, 'belongs_to_tags')) {
									var contactSelect = Contacts.findOne({_id: contactId});
									Session.set('belongsToTags', Contacts.findOne({_id: contactId}).belongs_to_tags)
								}
								$('.js_process_loader').hide();
								Session.set('process_ready', true)
							}
						}, 300);
						
					}
				}, 300);
			}
		}
	}, 300);
	
	
});

Template.tagProcess.helpers({
	processes: function() {
		var processTags = Tags.find({processTagType: true}, {sort: {created_on: 1}});
		var milestoneTags = Tags.find({milestoneTagType: true}, {sort: {created_on: 1}});
		var belongsToTags = Session.get('belongsToTags');
		
		var processes = []
		processTags.forEach(function(processTag) {
			
			var milestones = []
			milestoneTags.forEach(function(milestoneTag) {
				if (processTag._id === milestoneTag.belongs_to) {
					if ($.inArray(milestoneTag._id, belongsToTags) < 0) {
						var contact_belongs = false;
					} else {
						var contact_belongs = true;
					}
					if (milestoneTag.personal === 'open') {
						var personal = false;
					} else {
						var personal = true;
					}
					var milestoneUpdate = {
						_id: milestoneTag._id,
						tag: milestoneTag.tag,
						belongs_to: milestoneTag.belongs_to,
						contact_belongs: contact_belongs,
						personal: personal,
					}
					milestones.push(milestoneUpdate)
				}
			})
			
			if (processTag.personal === 'open') {
				var personal = false;
			} else {
				var personal = true;
			}
			var processUpdate = {
				_id: processTag._id,
				tag: processTag.tag,
				milestones: milestones,
				personal: personal,
			}
			processes.push(processUpdate)
			
		});

		return processes
	},
	
	contact: function() {
		return Contacts.findOne(Session.get('currentContact'));
	},
});

Template.tagProcess.events({
	'click .js_checkbox_milestone': function(e) {
		e.preventDefault();
		var tag_ids = [$(e.target).attr('id')];
		var contact_ids = [Session.get('currentContact')];
		
		if ($(e.target).find('input').val() === 'false') {
			Meteor.call('addToTag', tag_ids, contact_ids, function(error, result) {
				if (error) {
					return alert(error.reason);
				} else {
					$(e.target).toggleClass('unchecked')
					$(e.target).find('input').val('true');
				}
			});
		} else {
			Meteor.call('removeFromTag', tag_ids, contact_ids, function(error, result) {
				if (error) {
					return alert(error.reason);
				} else {
					$(e.target).toggleClass('unchecked')
					$(e.target).find('input').val('false');
				}
			});
		}
	},
})