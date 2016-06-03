Template.userTimezone.onRendered(function() {
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();
	
	var timezone = Meteor.user().profile.timezone
		
	var zones = moment.tz.names();

	for (var i = 0; i < zones.length; i++) {
		$('.js_timezone').append('<a id="' + zones[i].replace(/\//g, "") + '" data-timezone="' + zones[i] + '" class="js_list_item js_timezone_item list_item divided list_icon"><div class="icon_box icn_timezone"></div>' + zones[i] + ' (' + moment.tz([2015, 0], zones[i]).format('z') + ')</a>')
	}
	
	$('#' + timezone.replace(/\//g, "")).addClass('js_active active');
	
	var listPos = zones.indexOf(timezone) * 50 - 50;
	$('.js_timezone').scrollTop(listPos);
	
	$('.js_startup_loader').hide();
});

Template.userTimezone.helpers({
	timezoneUser: function() {
		return Meteor.users.findOne(Session.get('updateUser'));
	},
});


Template.userTimezone.events({
	'click .js_timezone_item': function(e) {
		e.preventDefault();
		$('.js_active').removeClass('js_active active');
		$(e.target).addClass('js_active active');
	},
	
	'submit .js_user_timezone_update_form': function(e) {
		e.preventDefault();
		$('.js_submit').attr('disabled', 'disabled').text('Updating...');
		$('.js_saving_msg').text('Updating...');
		$('.js_initial_loading_overlay').show();
		
		var timezone = $('.js_active').attr('data-timezone');
		
		Meteor.call('updateTimezone', Session.get('updateUser'), timezone, function(error, result) {
			if (error) {
				return alert(error.reason);
			} else {
				Router.go('userReturn');  
			}
		});
	}
})