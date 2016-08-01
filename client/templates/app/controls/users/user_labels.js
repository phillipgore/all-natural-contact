Template.userLabels.onRendered(function() {
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();

	DeleteLabels.remove({});

	$("#sortable").sortable({
		handle: '.handle',
		axis: "y",
		opacity: 0.8,
		activate: function(event, ui) {
			$('.js_checkbox_labels').removeClass('bg_light_pink');
			$(ui.item).addClass('bg_light_blue');
		},
		deactivate: function(event, ui) {
			$(ui.item).removeClass('bg_light_blue')
			$('.red_alert_msg').slideUp();
			$('.js_new_label').val('');
			$('.js_label_list').find('.js_checkbox_labels').each(function(index) {
				var order = index + 1;
				$(this).find('.order').text(order);
				$(this).find('#label_order').val(order);
			});
			$('.js_existing').addClass('js_update');
		}
	});

	$('.js_startup_loader').hide();
});

Template.userLabels.helpers({
	currentUser: function() {
		return Meteor.users.findOne(Meteor.userId());
	},

	labelsUser: function() {
		return Meteor.users.findOne(Session.get('updateUser'));
	},

	labelHeading: function() {
		return Session.get('labelHeading')
	},

	label: function() {
		var labels = Labels.find()
		var newLabels = []
		labels.forEach(function(label) {
			label.user.forEach(function(user, index) {
				if (user.userId === Session.get('updateUser')) {
					var labelProperties = {
						labelId: label._id,
						labelName: label.labelName,
						labelType: label.labelType,
						userId: user.userId,
						labelOrder: user.labelOrder,
						labelVisible: user.labelVisible,
					}
					newLabels.push(labelProperties)
				}
			})
		});
		var newLabels = _.sortBy(newLabels, 'labelOrder');

		return newLabels;
	}
});


Template.userLabels.events({
	'click .js_insert_label': function(e) {
		e.preventDefault();
		$('.red_alert_msg').slideUp();
		$('.js_checkbox_labels').removeClass('bg_light_pink');

		var existingNames = []
		$('.js_checkbox_labels').each(function() {
			existingNames.push($(this).find('.label_name_text').text())
		})

		var name = $('[name=new_label]').val().trim().split(" ");
		var labelName = []
		for (var i = 0; i < name.length; i++) {
			labelName.push(s.capitalize(name[i]))
		}
		var newName = labelName.toString().replace(/,/g, " ")

		if (newName) {
			if (existingNames.indexOf(newName) >= 0) {
				$("li[data-label-name='" + newName + "']").addClass('bg_light_pink')
				$('.red_alert_msg').text('That label already exists.').slideDown();
			} else {
				$('.js_lable_clone').clone().prependTo('.js_label_list');
				$('.js_lable_clone:first').find('.label_name_text').text(newName);
				$('.js_lable_clone:first').find('#label_name').val(newName);
				$('.js_lable_clone:first').attr('data-label-name', newName);
				$('.js_lable_clone:first').addClass('js_new');
				$('.js_lable_clone:first').removeClass('js_lable_clone').slideDown();


				$('.js_label_list').find('.js_checkbox_labels').each(function(index) {
					var order = index + 1;
					$(this).find('.order').text(order);
					$(this).find('#label_order').val(order);
				});

				$('.js_new_label').val('').blur();
			}
		}
	},

	'keydown .js_new_label': function(e) {
		var code = e.keyCode || e.which;
		if (code == 9 || code == 13) {
			e.preventDefault();
			$('.js_insert_label').click();
			return false;
		}
	},

	'click .label_name_text': function(e) {
		e.preventDefault();
		$(e.target).parent().click()
	},

	'click .js_checkbox_labels': function(e) {
		e.preventDefault();
		$(e.target).toggleClass('unchecked')
		if ($(e.target).find('#label_visible').val() === 'false' || $(e.target).find('#label_visible').val() === '' ) {
			$(e.target).find('#label_visible').val('true');
		} else {
			$(e.target).find('#label_visible').val('false');
		}
		$(e.target).addClass('js_update');
	},

	'submit form': function(e) {
		e.preventDefault();
		$('.js_submit').attr('disabled', 'disabled').text('Updating...');
		$('.js_initial_loading_overlay').show();

		var labelType = $(e.target).find('[name=label_type]:first').val().trim();

		if ($(e.target).find('.js_new').length > 0) {
			var labelInserts = [];
			$(e.target).find('.js_new').each(function() {
				var labelOrder = $(this).find('[name=label_order]').val().trim();
				var labelVisible = $(this).find('[name=label_visible]').val().trim() == "true";

				var users = []
				var groupUsers = Meteor.users.find()
				groupUsers.forEach(function(user) {
					if (Session.get('updateUser') === user._id) {
						var userUpdate = {
							userId: Session.get('updateUser'),
							labelOrder: labelOrder,
							labelVisible: labelVisible,
						}
					} else {
						var userUpdate = {
							userId: user._id,
							labelOrder: 100000,
							labelVisible: false,
						}
					}
					users.push(userUpdate)
				})
				var label = {
					labelName: $(this).find('[name=label_name]').val().trim(),
					labelType: labelType,
					user: users,
				};
				labelInserts.push(label);
			});
		}

		if ($(e.target).find('.js_update').length > 0) {
			var labelUpdates = [];
			$(e.target).find('.js_update').each(function() {
				var labelId = $(this).find('[name=label_id]').val().trim();
				var labelOrder = $(this).find('[name=label_order]').val().trim();
				var labelVisible = $(this).find('[name=label_visible]').val().trim() == "true";

				var users = []
				var groupUsers = Meteor.users.find()
				groupUsers.forEach(function(user, index) {
					if (Session.get('updateUser') === user._id) {
						var userUpdate = {
							userId: Session.get('updateUser'),
							labelOrder: labelOrder,
							labelVisible: labelVisible,
						}
					} else {
						var labelUser = Labels.findOne({"user.userId": user._id})
						var userUpdate = {
							userId: user._id,
							labelOrder: labelUser.user[index].labelOrder,
							labelVisible: labelUser.user[index].labelVisible,
						}
					}
					users.push(userUpdate)
				})

				var label = {
					labelId: $(this).find('[name=label_id]').val().trim(),
					user: users
				};
				labelUpdates.push(label);
			});
		}

		Meteor.call('labelBulk', labelInserts, labelUpdates, function(error, result) {
			if (error) {
				return alert(error.reason);
			} else {
				Router.go('/dropdowns/user/' + Session.get('updateUser'))
			}
		});

	}
})
