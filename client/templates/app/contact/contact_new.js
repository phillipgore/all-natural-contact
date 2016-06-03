Template.contactNew.onRendered(function() {
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();

	$('#first').focus();

	$('.js_startup_loader').fadeOut('fast');
});

Template.contactNew.helpers({
	currentUser: function() {
		return Meteor.users.findOne(Meteor.userId());
	},

	hasProfession: function() {
		var currentUser = Meteor.users.findOne(Meteor.userId())
		if (currentUser.fields.job_title_field || currentUser.fields.department_field || currentUser.fields.company_field  ) {
			return true;
		}
	}
});

Template.contactNew.events({
	'click .js_checkbox_is_company': function(e) {
		e.preventDefault();
		var clone = $('.js_company').clone();
		$('.js_company').remove();
		$(e.target).toggleClass('unchecked')
		if ($(e.target).find('input').val() === 'false' || $(e.target).find('input').val() === '') {
			$(e.target).find('input').val('true');
			$('.js_is_company_container').append(clone);
			$('.js_is_company').show();
		} else {
			$(e.target).find('input').val('false');
			$('.js_is_not_company_container').append(clone);
			$('.js_is_company').hide();
		}
	},

	'submit form': function(e) {
		e.preventDefault(e);
		$('.js_submit').attr('disabled', 'disabled');
		$('.js_contact_new_submit').text('Saving...').addClass('js_inactive');
		$('.js_initial_loading_overlay').show();

		var date = new Date();
		var firstName = $(e.target).find('[name=first]').val().trim();
		var lastName = $(e.target).find('[name=last]').val().trim();
		var company = $(e.target).find('[name=company]').val().trim();
		var isCompany = $(e.target).find('[name=is_company]').val().trim() == "true";
		if (isCompany === true) {
			var comboNameFirst = company.replace(/\s+/g, '');
			var comboNameLast = '';
		} else {
			var comboNameFirst = firstName;
			var comboNameLast = lastName;
		}


		if (firstName.length === 0) {
			var comboNameFirst = "aaaaaaaa";
		}

		if (lastName.length === 0) {
			var comboNameLast = "aaaaaaaa";
		}

		//Phone
		var phones = []
		$(e.target).find('#phone').find('.js_input').each(function() {
			if ($(this).find('[name=phone]').val().length) {
				var phoneProperties = {
					phone_label: $(this).find('[name=phone_label]').val(),
					phone: $(this).find('[name=phone]').val()
				}
				phones.push(phoneProperties)
			}
		});


		//Email
		var emails = []
		$(e.target).find('#email').find('.js_input').each(function() {
			if ($(this).find('[name=email]').val().length) {
				var emailProperties = {
					email_label: $(this).find('[name=email_label]').val(),
					email: $(this).find('[name=email]').val()
				}
				emails.push(emailProperties)
			}
		});

		//Website
		var urls = []
		$(e.target).find('#url').find('.js_input').each(function() {
			var url_entry = $(this).find('[name=url]').val();

			if (url_entry.indexOf("https://") !=-1 || url_entry.indexOf("http://") !=-1) {
				var url_entry = url_entry;
			} else if (url_entry.indexOf("://") !=-1) {
				var end = url_entry.indexOf("://") + 3
				var url_entry = "http://" + url_entry.substring(end);
			} else if (url_entry.indexOf(":/") !=-1) {
				var end = url_entry.indexOf(":/") + 2
				var url_entry = "http://" + url_entry.substring(end);
			} else if (url_entry.indexOf(":") !=-1) {
				var end = url_entry.indexOf(":") + 1
				var url_entry = "http://" + url_entry.substring(end);
			} else if (url_entry.length >= 1) {
				var url_entry = "http://" + url_entry;
			}

			if ($(this).find('[name=url]').val().length) {
				var urlProperties = {
					url_label: $(this).find('[name=url_label]').val(),
					url: url_entry
				}
				urls.push(urlProperties)
			}
		});

		//Date
		var dates = []
		$(e.target).find('#date').find('.js_input').each(function() {
			if ($(this).find('[name=date_entry]').val().length) {
				if (moment($(this).find('[name=date_entry]').val()).isValid()) {
					var date_entry = $(this).find('[name=date_entry]').val().trim();
					var dateProperties = {
						date_label: $(this).find('[name=date_label]').val(),
						date_entry: moment(date_entry).format('YYYY-MM-DD').toString(),
					}
					dates.push(dateProperties)
				}
			}
		});

		//Related
		var relateds = []
		$(e.target).find('#related').find('.js_input').each(function() {
			if ($(this).find('[name=related]').val().length) {
				var relatedProperties = {
					related_label: $(this).find('[name=related_label]').val(),
					related: $(this).find('[name=related]').val()
				}
				relateds.push(relatedProperties)
			}
		});

		//IMMP
		var immps = []
		$(e.target).find('#immp').find('.js_input').each(function() {
			if ($(this).find('[name=immp_user_name]').val().length) {
				var immpProperties = {
					immp_label: $(this).find('[name=immp_label]').val(),
					immp_user_name: $(this).find('[name=immp_user_name]').val(),
					immp_service: $(this).find('[name=immp_service]').val()
				}
				immps.push(immpProperties)
			}
		});

		//Address
		var addresses = []
		$(e.target).find('#address').find('.js_input').each(function() {
			if ($(this).find('[name=street]').val().length || $(this).find('[name=city]').val().length || $(this).find('[name=state]').val().length || $(this).find('[name=postal_code]').val().length) {
				var addressProperties = {
					address_label: $(this).find('[name=address_label]').val(),
					street: $(this).find('[name=street]').val(),
					city: $(this).find('[name=city]').val(),
					state: $(this).find('[name=state]').val(),
					postal_code: $(this).find('[name=postal_code]').val()
				}
				addresses.push(addressProperties)
			}
		});

		var date = new Date();

		if (firstName) {
			var comboNameFirst = firstName.toLowerCase() + lastName.toLowerCase() + date.getTime().toString();
		} else {
			var comboNameFirst = "aaaaaaaa" + date.getTime().toString();
		}

		if (lastName) {
			var comboNameLast = lastName.toLowerCase() + firstName.toLowerCase() + date.getTime().toString();
		} else {
			var comboNameLast = "aaaaaaaa" + date.getTime().toString();
		}

		if (isCompany) {
			var companyComboName = company.replace(/\s+/g, '').toLowerCase() + date.getTime().toString();
			var comboNameFirst = companyComboName;
			var comboNameLast = companyComboName;
		}

		var contactProperties = {
			//Name
			prefix: $(e.target).find('[name=prefix]').val().trim(),
			first: firstName,
			middle: $(e.target).find('[name=middle]').val().trim(),
			last: lastName,
			nameFirst: comboNameFirst,
			nameLast: comboNameLast,
			suffix: $(e.target).find('[name=suffix]').val().trim(),

			//Phonetic
			phonetic_first: $(e.target).find('[name=phonetic_first]').val().trim(),
			phonetic_middle: $(e.target).find('[name=phonetic_middle]').val().trim(),
			phonetic_last: $(e.target).find('[name=phonetic_last]').val().trim(),

			//Nickname
			nickname: $(e.target).find('[name=nickname]').val().trim(),

			//Profession
			job_title: $(e.target).find('[name=job_title]').val().trim(),
			department: $(e.target).find('[name=department]').val().trim(),
			company: company,
			is_company: isCompany,

			//Maiden
			maiden: $(e.target).find('[name=maiden]').val().trim(),

			//Contact
			phones: phones,
			emails: emails,
			urls: urls,
			dates: dates,
			relateds: relateds,
			immps: immps,
			addresses: addresses
		};

		Meteor.call('contactInsert', contactProperties, function(error, result) {
			if (error) {
				return alert(error.reason);
			} else {
				Session.set({currentContact: result._id})
				Router.go('/info/contact/' + result._id);
			}
		});

   	}

});
