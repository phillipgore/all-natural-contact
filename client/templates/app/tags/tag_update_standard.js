Template.tagUpdateStandard.helpers({
	personalCheck: function() {
		if (Tags.findOne().personal === 'open') {
			return 'unchecked'
		} else {
			return ''
		}
	}
});

Template.tagUpdateStandard.events({
	'submit .js_standard_tag_update_form': function(e) {
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
		
		Meteor.call('tagUpdate', tag_id, tagProperties, function(error) {
			if (error) {
				return alert(error.reason);
			} else {
				Session.set({currentTag: tag_id, tagScrollDir: 'middle', tagPivotId: tag_id, tagPivotName: tagProperties.tagName});
				Router.go('/list/tags');
			}
		});
	},
 });