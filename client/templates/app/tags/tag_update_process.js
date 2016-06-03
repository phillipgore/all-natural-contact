Template.tagUpdateProcess.helpers({
	personalCheck: function() {
		if (Tags.findOne({processTagType: true}).personal === 'open') {
			return 'unchecked'
		} else {
			return ''
		}
	},
	
	milestoneTags: function() {
		return Tags.find({milestoneTagType: true})
	}
});

Template.tagUpdateProcess.events({
	'submit .js_process_tag_update_form': function(e) {
		e.preventDefault();
		
		$('.js_submit').attr('disabled', 'disabled');
		$('.js_tag_update').text('Updating...').addClass('js_inactive');
		$('.js_saving_msg').text('Updating...');
		$('.js_initial_loading_overlay').show();
		
		var tag_id = this._id;
		var currentTagName = this.tagName;
		var date = new Date();
		var tag = $(e.target).find('[name=tag]').val().trim();
		var personalTag = $(e.target).find('[name=personal_tag]').val().trim();
		var comboTagName = tag.toLowerCase().replace(/\s/g,'');
		
		if (tag.length === 0) {
			var comboTagName = "aaaaaaaa";
		}
		
		var tagProperties = {
		  tag: tag,
		  tagName: comboTagName + date.getTime().toString(),
		  personal: personalTag
		}
		
		var existingMilestoneProperties = []
		$(e.target).find('#milestone').find('.js_existing_milestone').each(function() {
			if ($(this).val().length) {
				var milestone = {
					_id: $(this).attr('id'),
					tag: $(this).val(),
					tagName: $(this).val().toLowerCase().replace(/\s/g,'') + date.getTime().toString(),
					personal: personalTag,
					standardTagType: false,
					reminderTagType: false,
					processTagType: false,
					milestoneTagType: true,
					belongs_to: tag_id,
				}
				existingMilestoneProperties.push(milestone)
			}
		});
		
		var has_tags = Tags.findOne({processTagType: true}).has_tags
		var currentMilestones = []
		$(e.target).find('#milestone').find('.js_existing_milestone').each(function() {
			currentMilestones.push($(this).attr('id'))
		});
		var removeMilestones = _.difference(has_tags, currentMilestones)
		
		var newMilestoneProperties = []
		$(e.target).find('#milestone').find('.js_new_milestone').each(function() {
			if ($(this).val().length) {
				var milestone = {
					tag: $(this).val(),
					tagName: $(this).val().toLowerCase().replace(/\s/g,'') + date.getTime().toString(),
					personal: personalTag,
					standardTagType: false,
					reminderTagType: false,
					processTagType: false,
					milestoneTagType: true,
					belongs_to: tag_id,
				}
				newMilestoneProperties.push(milestone)
			}
		});
		
		Meteor.call('tagUpdateProcess', removeMilestones, tag_id, tagProperties, existingMilestoneProperties, newMilestoneProperties, function(error) {
			if (error) {
				return alert(error.reason);
			} else {
				Session.set({currentTag: tag_id, tagScrollDir: 'middle', tagPivotId: tag_id, tagPivotName: tagProperties.tagName});
				Router.go('/list/tags');
			}
		});
	},
 });