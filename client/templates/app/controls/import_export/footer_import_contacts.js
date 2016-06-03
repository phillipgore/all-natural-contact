Template.footerImportContacts.events({
	'click .js_choose_file_btn': function(e) {
		e.preventDefault();
		if (!$(e.target).hasClass('js_inactive')) {
			$('.js_choose_file').click();
		}
	},

	'click .js_cancel_import_btn': function(e) {
		e.preventDefault();
		if (!$(e.target).hasClass('js_inactive')) {
			Router.go('/info/tag/all_contacts_tag')
		}
	},

	'click .js_return': function(e) {
		e.preventDefault();

		Session.set({
			contactScrollDir: 'up',
			contactPivotNameLast: '',
			contactPivotId: '',
			currentTag: 'all_contacts_tag',
			currentContact: '',
			currentNameLast: ''
		});

		Router.go('/info/tag/all_contacts_tag')
	},

	'change .js_choose_file': function(e) {
		e.preventDefault();
		function upperCaseWords(string) {
			if (string) {
				return string.replace(/\w\S*/g, function(tStr) {
					return tStr.charAt(0).toUpperCase() + tStr.substr(1).toLowerCase();
				});
			} else {
				return '';
			}
		}

		$('.js_submit').attr('disabled', 'disabled');
		$('.js_saving_msg').text('Importing Contacts')
		$('.js_choose_file_btn').text('Importing...').addClass('js_inactive');
		$('.js_initial_loading_overlay, .js_toolbar_disable').show();

		var file = e.target.files[0]
		var fileReader = new FileReader();
		var newContacts = []

		if (file.type === 'text/vcard') {
			fileReader.onload = function (e) {
				var vcResults = fileReader.result.split(/\r\n|\r|\n/)
				var vcArray = []

				for (; vcResults[0] === 'BEGIN:VCARD';) {
					vcArray.push(vcResults.slice(vcResults.indexOf('BEGIN:VCARD'), vcResults.indexOf('END:VCARD') + 1))
					vcResults.splice(vcResults.indexOf('BEGIN:VCARD'), vcResults.indexOf('END:VCARD') + 1)
				}

				for (var a = 0; a < vcArray.length; a++) {
					var vCard = vcArray[a]

					var prefix = ""
					var first = ""
					var middle = ""
					var last = ""
					var nameFirst = ""
					var nameLast = ""
					var suffix = ""
					var phonetic_first = ""
					var phonetic_middle = ""
					var phonetic_last = ""
					var nickname = ""
					var job_title = ""
					var department = ""
					var company = ""
					var fullName = ""
					var maiden = ""
					var notes = ""

					var line = ""
					var colon = ""
					var preColon = ""
					var postColon = ""

					var period = ""
					var item = ""
					var iLine = ""
					var iColon = ""
					var customLabel = ""

					var phones = []
					var emails = []
					var urls = []
					var dates = []
					var relateds = []
					var immps = []
					var addresses = []

					for (var vc = 0; vc < vCard.length; vc++) {
						var line = vCard[vc]
						var colon = line.indexOf(':') + 1
						var preColon = line.slice(0, colon)
						var postColon = line.slice(colon)

						if (preColon.includes('type=') && preColon.includes('ADR')) {
							var period = preColon.indexOf('.') + 1
							var preColon = preColon.slice(period)
						}

						if (preColon.startsWith('item')) {
							var period = preColon.indexOf('.') + 1
							var item = preColon.slice(0, period)
							var preColon = preColon.slice(period)
							var iLine = vCard[vc + 1]
							var iColon = iLine.indexOf(':') + 1
							var customLabel = iLine.slice(iColon).replace(/[^a-z0-9+]+/gi, '').toLowerCase()
						} else {
							var period = ""
							var item = ""
							var iLine = ""
							var iColon = ""
							var customLabel = ""
						}

						var postColon = postColon.replace('x-apple:', '')

						if (preColon.startsWith('N:')) {
							var items = postColon.split(';')
							for (var i = 0; i < items.length; i++) {
								var last = items[0]
								var first = items[1]
								var middle = items[2]
								var prefix = items[3]
								var suffix = items[4]
							}

						} else if (preColon.startsWith('FN:')) {
							var items = postColon.split(';')
							for (var i = 0; i < items.length; i++) {
								var fullName = items[0]
							}

						} else if (preColon.startsWith('X-PHONETIC-FIRST-NAME')) {
							var items = postColon.split(';')
							for (var i = 0; i < items.length; i++) {
								var phonetic_first = items[0]
							}

						} else if (preColon.startsWith('X-PHONETIC-MIDDLE-NAME')) {
							var items = postColon.split(';')
							for (var i = 0; i < items.length; i++) {
								var phonetic_middle = items[0]
							}

						} else if (preColon.startsWith('X-PHONETIC-LAST-NAME')) {
							var items = postColon.split(';')
							for (var i = 0; i < items.length; i++) {
								var phonetic_last = items[0]
							}

						} else if (preColon.startsWith('NICKNAME')) {
							var items = postColon.split(';')
							for (var i = 0; i < items.length; i++) {
								var nickname = items[0]
							}

						} else if (preColon.startsWith('TITLE')) {
							var items = postColon.split(';')
							for (var i = 0; i < items.length; i++) {
								var job_title = items[0]
							}

						} else if (preColon.startsWith('ORG')) {
							var items = postColon.split(';')
							for (var i = 0; i < items.length; i++) {
								var company = items[0]
								var department = items[1]
							}

						} else if (preColon.startsWith('X-MAIDENNAME')) {
							var items = postColon.split(';')
							for (var i = 0; i < items.length; i++) {
								var maiden = items[0]
							}

						} else if (preColon.startsWith('NOTE')) {
							var items = postColon.split(';')
							for (var i = 0; i < items.length; i++) {
								var notes = items[0]
							}

						} else if (preColon.startsWith('TEL')) {
							var labels = preColon.split(';')
							labels.shift()
							for (var i = 0; i < labels.length; i++) {
								labels[i] = labels[i].replace(':', '').replace('type=', '').replace('X-SERVICE-TYPE=', '').replace('X-SERVICE-TYPE=', '').toLowerCase();
							}
							if (customLabel || labels[0] === 'pref') {
								var label = customLabel
							} else {
								var label = labels[0]
							}
							var items = postColon.split(';')
							var phoneProperties = {
								phone_label: upperCaseWords(label),
								phone: items[0]
							}
							phones.push(phoneProperties)

						} else if (preColon.startsWith('EMAIL')) {
							var labels = preColon.split(';')
							labels.shift()
							for (var i = 0; i < labels.length; i++) {
								labels[i] = labels[i].replace(':', '').replace('type=', '').replace('X-SERVICE-TYPE=', '').replace('X-SERVICE-TYPE=', '').toLowerCase();
							}
							if (customLabel || labels[0] === 'pref') {
								var label = customLabel
							} else if (labels[0] === 'internet') {
								var label = labels[1]
							} else {
								var label = labels[0]
							}
							var items = postColon.split(';')
							var emailProperties = {
								email_label: upperCaseWords(label),
								email: items[0]
							}
							emails.push(emailProperties)

						} else if (preColon.startsWith('URL') || preColon.startsWith('X-SOCIALPROFILE')) {
							var labels = preColon.split(';')
							labels.shift()
							for (var i = 0; i < labels.length; i++) {
								labels[i] = labels[i].replace(':', '').replace('type=', '').replace('X-SERVICE-TYPE=', '').replace('X-SERVICE-TYPE=', '').toLowerCase();
							}
							if (customLabel || labels[0] === 'pref') {
								var label = customLabel
							} else {
								var label = labels[0]
							}
							var items = postColon.split(';')
							var urlProperties = {
								url_label: upperCaseWords(label),
								url: items[0]
							}
							urls.push(urlProperties)

						} else if (preColon.startsWith('BDAY') || preColon.startsWith('ANNIVERSARY') || preColon.startsWith('X-ABDATE')) {
							var labels = preColon.split(';')
							labels.shift()
							for (var i = 0; i < labels.length; i++) {
								labels[i] = labels[i].replace(':', '').replace('type=', '').replace('X-SERVICE-TYPE=', '').replace('X-SERVICE-TYPE=', '').toLowerCase();
							}
							if (preColon.startsWith('BDAY')) {
								var label = 'Birthday'
							} else if (preColon.startsWith('ANNIVERSARY')) {
								var label = 'Anniversary'
							} else if (customLabel || labels[0] === 'pref') {
								var label = customLabel
							} else {
								var label = labels[0]
							}
							var items = postColon.split(';')
							var dateProperties = {
								date_label: upperCaseWords(label),
								date_entry: items[0]
							}
							dates.push(dateProperties)

						} else if (preColon.startsWith('RELATED') || preColon.startsWith('X-ABRELATEDNAMES')) {
							var labels = preColon.split(';')
							labels.shift()

							for (var i = 0; i < labels.length; i++) {
								labels[i] = labels[i].replace(':', '').replace('type=', '').replace('X-SERVICE-TYPE=', '').replace('X-SERVICE-TYPE=', '').toLowerCase();
							}
							if (customLabel || labels[0] === 'pref') {
								var label = customLabel
							} else {
								var label = labels[0]
							}
							var items = postColon.split(';')
							var relatedProperties = {
								related_label: upperCaseWords(label),
								related: items[0]
							}
							relateds.push(relatedProperties)

						} else if (preColon.startsWith('IMPP')) {
							var internalColon = postColon.indexOf(':') + 1
							var labels = preColon.split(';')
							labels.shift()
							for (var i = 0; i < labels.length; i++) {
								labels[i] = labels[i].replace(':', '').replace('type=', '').replace('X-SERVICE-TYPE=', '').replace('X-SERVICE-TYPE=', '');
							}
							if (customLabel || labels[0] === 'pref') {
								var label = customLabel.toLowerCase()
							} else {
								var label = labels[1]
							}
							var items = postColon.slice(internalColon).split(';')
							if (labels[0] === "GaduGadu") {
								var service = "Gadu-Gadu"
							} else if (labels[0] === "GoogleTalk") {
								var service = "Google Talk"
							} else {
								var service = labels[0]
							}
							var immpProperties = {
								immp_label: upperCaseWords(label),
								immp_user_name: items[0],
								immp_service: service
							}
							immps.push(immpProperties)

						} else

						if (preColon.startsWith('ADR')) {
							var labels = preColon.split(';')
							labels.shift()
							for (var i = 0; i < labels.length; i++) {
								labels[i] = labels[i].replace(':', '').replace('type=', '').replace('X-SERVICE-TYPE=', '').replace('X-SERVICE-TYPE=', '').toLowerCase();
							}
							if (customLabel || labels[0] === 'pref') {
								var label = customLabel.toLowerCase()
							} else {
								var label = labels[0]
							}

							var items = postColon.split(';')
							var addressProperties = {
								address_label: upperCaseWords(label),
								street: items[2],
								city: items[3],
								state: items[4],
								postal_code: items[5],
							}
							addresses.push(addressProperties)
						}
					}

					if (fullName === company) {
						var isCompany = true;
					} else {
						var isCompany = false;
					}

					var date = new Date();

					if (first) {
						var comboNameFirst = first.toLowerCase() + date.getTime().toString();
					} else {
						var comboNameFirst = "aaaaaaaa" + date.getTime().toString();
					}

					if (last) {
						var comboNameLast = last.toLowerCase() + date.getTime().toString();
					} else {
						var comboNameLast = "aaaaaaaa" + date.getTime().toString();
					}

					if (isCompany) {
						var companyComboName = company.replace(/\s+/g, '').toLowerCase() + date.getTime().toString();
						var comboNameFirst = companyComboName;
						var comboNameLast = companyComboName;
					}

					var contactProperties = {
						prefix: prefix,
						first: first,
						middle: middle,
						last: last,
						nameFirst: comboNameFirst,
						nameLast: comboNameLast,
						suffix: suffix,

						phonetic_first: phonetic_first,
						phonetic_middle: phonetic_middle,
						phonetic_last: phonetic_last,

						nickname: nickname,

						job_title: job_title,
						department: department,
						company: company,
						is_company: isCompany,

						maiden: maiden,

						phones: phones,
						emails: emails,
						urls: urls,
						dates: dates,
						relateds: relateds,
						immps: immps,
						addresses: addresses,

						notes: notes,
					}

					newContacts.push(contactProperties)
				}

				for (var i = 0; i < newContacts.length; i++) {
					Meteor.call('contactInsert', newContacts[i], function(error, result) {
						if (error) {
							return alert(error.reason);
						}
					});
					if (i + 2 > newContacts.length) {
						$('.js_complete, .js_complete_btns').show()
						$('.js_loading, .js_import_btns, .js_toolbar_disable').hide()
						$('.js_saving_msg').text('Import Complete')
						$('.js_choose_file_btn').text('Complete');
						$('.js_cancel_import_btn, .js_choose_file_btn').addClass('js_inactive');
					}
				}

			}
			fileReader.readAsText(file);


		} else if (file.type === 'text/csv') {
			Papa.parse( file, {
				header: true,
				skipEmptyLines: true,
				complete( results, file ) {
					var data = results.data
					var keys = results.meta.fields

					var phone_keys = []
					var email_keys = []
					var url_keys = []
					var date_keys = []
					var related_keys = []
					var immp_keys = []
					var address_keys = []

					$(keys).each(function() {
						var key = this

						if (key.toLowerCase().includes('phone')) {
							phone_keys.push(key.toString())
						}

						if (key.toLowerCase().includes('e-mail') || key.toLowerCase().includes('email')) {
							email_keys.push(key.toString())
						}

						if (key.toLowerCase().includes('website')) {
							url_keys.push(key.toString())
						}

						if (key.toLowerCase().includes('event') || key.toLowerCase().includes('date')) {
							date_keys.push(key.toString())
						}

						if (key.toLowerCase().includes('relation') || key.toLowerCase().includes('related')) {
							related_keys.push(key.toString())
						}

						if (key.toLowerCase().includes('im')) {
							immp_keys.push(key.toString())
						}

						if (key.toLowerCase().includes('- type') || key.toLowerCase().includes('- street') || key.toLowerCase().includes('- city') || key.toLowerCase().includes('- region') || key.toLowerCase().includes('- state') || key.toLowerCase().includes('- postal code')) {
							address_keys.push(key.toString())
						}
					})

					var phone_key_pairs = []
					var email_key_pairs = []
					var url_key_pairs = []
					var date_key_pairs = []
					var related_key_pairs = []
					var immp_key_pairs = []
					var address_key_pairs = []

					//Phone Key Pairs
					function filterPhone(phone, index) {
						if (phone.includes('Phone ' + this.num)) {
							return phone.includes('Phone ' + this.num)
						}
					}

					for (var i = 0; i < phone_keys.length; i++) {
						var num = (i + 1).toString()
						phone_key_pairs.push(phone_keys.filter(filterPhone, {num: num}))
					}

					phone_key_pairs.forEach(
						function(item) {
							if (item.length === 0) {
								var index = phone_key_pairs.indexOf(item)
								phone_key_pairs.splice(index)
							}
						}
					)


					//Email Key Pairs
					function filterEmail(email, index) {
						if (email.includes('E-mail ' + this.num)) {
							return email.includes('E-mail ' + this.num)
						} else if (email.includes('Email ' + this.num)) {
							return email.includes('Email ' + this.num)
						}
					}

					for (var i = 0; i < email_keys.length; i++) {
						var num = (i + 1).toString()
						email_key_pairs.push(email_keys.filter(filterEmail, {num: num}))
					}

					email_key_pairs.forEach(
						function(item) {
							if (item.length === 0) {
								var index = email_key_pairs.indexOf(item)
								email_key_pairs.splice(index)
							}
						}
					)


					//Url Key Pairs
					function filterUrl(url, index) {
						if (url.includes('Website ' + this.num)) {
							return url.includes('Website ' + this.num)
						}
					}

					for (var i = 0; i < url_keys.length; i++) {
						var num = (i + 1).toString()
						url_key_pairs.push(url_keys.filter(filterUrl, {num: num}))
					}

					url_key_pairs.forEach(
						function(item) {
							if (item.length === 0) {
								var index = url_key_pairs.indexOf(item)
								url_key_pairs.splice(index)
							}
						}
					)


					//Date Key Pairs
					function filterDate(date, index) {
						if (date.includes('Event ' + this.num)) {
							return date.includes('Event ' + this.num)
						} else if (date.includes('Date ' + this.num)) {
							return date.includes('Date ' + this.num)
						}
					}

					for (var i = 0; i < date_keys.length; i++) {
						var num = (i + 1).toString()
						date_key_pairs.push(date_keys.filter(filterDate, {num: num}))
					}

					date_key_pairs.forEach(
						function(item) {
							if (item.length === 0) {
								var index = date_key_pairs.indexOf(item)
								date_key_pairs.splice(index)
							}
						}
					)


					//Related Key Pairs
					function filterRelated(related, index) {
						if (related.includes('Relation ' + this.num)) {
							return related.includes('Relation ' + this.num)
						} else if (related.includes('Related ' + this.num)) {
							return related.includes('Related ' + this.num)
						}
					}

					for (var i = 0; i < related_keys.length; i++) {
						var num = (i + 1).toString()
						related_key_pairs.push(related_keys.filter(filterRelated, {num: num}))
					}

					related_key_pairs.forEach(
						function(item) {
							if (item.length === 0) {
								var index = related_key_pairs.indexOf(item)
								related_key_pairs.splice(index)
							}
						}
					)


					//IMMP Key Pairs
					function filterImmp(immp, index) {
						if (immp.includes('IM ' + this.num)) {
							return immp.includes('IM ' + this.num)
						}
					}

					for (var i = 0; i < immp_keys.length; i++) {
						var num = (i + 1).toString()
						immp_key_pairs.push(immp_keys.filter(filterImmp, {num: num}))
					}

					immp_key_pairs.forEach(
						function(item) {
							if (item.length === 0) {
								var index = immp_key_pairs.indexOf(item)
								immp_key_pairs.splice(index)
							}
						}
					)


					//Address Key Pairs
					function filterAddress(address, index) {
						if (address.includes('Address ' + this.num)) {
							return address.includes('Address ' + this.num)
						}
					}

					for (var i = 0; i < address_keys.length; i++) {
						var num = (i + 1).toString()
						address_key_pairs.push(address_keys.filter(filterAddress, {num: num}))
					}

					address_key_pairs.forEach(
						function(item) {
							if (item.length === 0) {
								var index = address_key_pairs.indexOf(item)
								address_key_pairs.splice(index)
							}
						}
					)




					for (var c = 0; c < data.length; c++) {

						$(keys).each(function() {
							var key = this
							var current_data = data[c]

							if (key.toLowerCase() === ('name prefix') || key.toLowerCase() === ('prefix')) {
								var key = key.toString();
								var value = current_data[key];
								delete current_data[key];
								current_data.Prefix = value;
							}

							if (key.toLowerCase() === ('given name') || key.toLowerCase() === ('first')) {
								var key = key.toString();
								var value = current_data[key];
								delete current_data[key];
								current_data.First = value;
							}

							if (key.toLowerCase() === ('additional name') || key.toLowerCase() === ('middle')) {
								var key = key.toString();
								var value = current_data[key];
								delete current_data[key];
								current_data.Middle = value;
							}

							if (key.toLowerCase() === ('family name') || key.toLowerCase() === ('last')) {
								var key = key.toString();
								var value = current_data[key];
								delete current_data[key];
								current_data.Last = value;
							}

							if (key.toLowerCase() === ('name suffix') || key.toLowerCase() === ('suffix')) {
								var key = key.toString();
								var value = current_data[key];
								delete current_data[key];
								current_data.Suffix = value;
							}

							if (key.toLowerCase() === ('maiden name') || key.toLowerCase() === ('maiden')) {
								var key = key.toString();
								var value = current_data[key];
								delete current_data[key];
								current_data.Maiden = value;
							}

							if (key.toLowerCase() === ('organization 1 - title') || key.toLowerCase() === ('job title')) {
								var key = key.toString();
								var value = current_data[key];
								delete current_data[key];
								current_data["Job Title"] = value;
							}

							if (key.toLowerCase() === ('organization 1 - department') || key.toLowerCase() === ('department')) {
								var key = key.toString();
								var value = current_data[key];
								delete current_data[key];
								current_data.Department = value;
							}

							if (key.toLowerCase() === ('organization 1 - name') || key.toLowerCase() === ('company')) {
								var key = key.toString();
								var value = current_data[key];
								delete current_data[key];
								current_data.Company = value;
							}
						})




						var phone_keys = []
						for (var kp = 0; kp < phone_key_pairs.length; kp++) {
							var current_data = data[c]
							var keys = phone_key_pairs[kp]
							var values = []
							for (var i = 0; i < keys.length; i++) {
								values.push(current_data[keys[i]])
							}
							if (values[1] && values[1].length > 0) {
								if (values[1].includes(':::')) {
									var items = values[1].split(' ::: ')
									for (var i = 0; i < items.length; i++) {
										properties = {
											phone_label: values[0].replace('* ', ''),
											phone: items[i]
										}
										phone_keys.push(properties)
									}
								} else {
									properties = {
										phone_label: values[0].replace('* ', ''),
										phone: values[1]
									}
									phone_keys.push(properties)
								}
							}
						}
						_.extend(data[c], {phones: phone_keys})

						for (var k = 0; k < phone_keys.length; k++) {
							var current_data = data[c]
							var current_key = phone_keys[k]
							delete current_data[current_key]
						}

						var email_keys = []
						for (var kp = 0; kp < email_key_pairs.length; kp++) {
							var current_data = data[c]
							var keys = email_key_pairs[kp]
							var values = []
							for (var i = 0; i < keys.length; i++) {
								values.push(current_data[keys[i]])
							}
							if (values[1] && values[1].length > 0) {
								if (values[1].includes(':::')) {
									var items = values[1].split(' ::: ')
									for (var i = 0; i < items.length; i++) {
										properties = {
											email_label: values[0].replace('* ', ''),
											email: items[i]
										}
										email_keys.push(properties)
									}
								} else {
									properties = {
										email_label: values[0].replace('* ', ''),
										email: values[1]
									}
									email_keys.push(properties)
								}
							}
						}
						_.extend(data[c], {emails: email_keys})

						for (var k = 0; k < email_keys.length; k++) {
							var current_data = data[c]
							var current_key = email_keys[k]
							delete current_data[current_key]
						}

						var url_keys = []
						for (var kp = 0; kp < url_key_pairs.length; kp++) {
							var current_data = data[c]
							var keys = url_key_pairs[kp]
							var values = []
							for (var i = 0; i < keys.length; i++) {
								values.push(current_data[keys[i]])
							}
							if (values[1] && values[1].length > 0) {
								if (values[1].includes(':::')) {
									var items = values[1].split(' ::: ')
									for (var i = 0; i < items.length; i++) {
										var url_entry = items[i];

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
										properties = {
											url_label: values[0].replace('* ', ''),
											url: url_entry
										}
										url_keys.push(properties)
									}
								} else {
									var url_entry = values[1];

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
									properties = {
										url_label: values[0].replace('* ', ''),
										url: url_entry
									}
									url_keys.push(properties)
								}
							}
						}
						_.extend(data[c], {urls: url_keys})

						for (var k = 0; k < url_keys.length; k++) {
							var current_data = data[c]
							var current_key = url_keys[k]
							delete current_data[current_key]
						}

						var date_keys = []
						for (var kp = 0; kp < date_key_pairs.length; kp++) {
							var current_data = data[c]
							var keys = date_key_pairs[kp]
							var values = []
							for (var i = 0; i < keys.length; i++) {
								values.push(current_data[keys[i]])
							}
							if (values[1] && values[1].length > 0) {
								if (values[1].includes(':::')) {
									var items = values[1].split(' ::: ')
									for (var i = 0; i < items.length; i++) {
										properties = {
											date_label: values[0].replace('* ', ''),
											date_entry: moment(items[i]).format('YYYY-MM-DD').toString()
										}
										date_keys.push(properties)
									}
								} else {
									properties = {
										date_label: values[0].replace('* ', ''),
										date_entry: moment(values[1]).format('YYYY-MM-DD').toString()
									}
									date_keys.push(properties)
								}
							}
						}
						_.extend(data[c], {dates: date_keys})

						for (var k = 0; k < date_keys.length; k++) {
							var current_data = data[c]
							var current_key = date_keys[k]
							delete current_data[current_key]
						}

						var related_keys = []
						for (var kp = 0; kp < related_key_pairs.length; kp++) {
							var current_data = data[c]
							var keys = related_key_pairs[kp]
							var values = []
							for (var i = 0; i < keys.length; i++) {
								values.push(current_data[keys[i]])
							}
							if (values[1] && values[1].length > 0) {
								if (values[1].includes(':::')) {
									var items = values[1].split(' ::: ')
									for (var i = 0; i < items.length; i++) {
										properties = {
											related_label: values[0].replace('* ', ''),
											related: items[i]
										}
										related_keys.push(properties)
									}
								} else {
									properties = {
										related_label: values[0].replace('* ', ''),
										related: values[1]
									}
									related_keys.push(properties)
								}
							}
						}
						_.extend(data[c], {relateds: related_keys})

						for (var k = 0; k < related_keys.length; k++) {
							var current_data = data[c]
							var current_key = related_keys[k]
							delete current_data[current_key]
						}

						var immp_keys = []
						for (var kp = 0; kp < immp_key_pairs.length; kp++) {
							var current_data = data[c]
							var keys = immp_key_pairs[kp]
							var values = []
							for (var i = 0; i < keys.length; i++) {
								values.push(current_data[keys[i]])
							}
							if (values[1] && values[1].length > 0) {
								if (values[1].includes(':::')) {
									var items = values[1].split(' ::: ')
									var values = values[2].split(' ::: ')
									for (var i = 0; i < items.length; i++) {
										properties = {
											immp_label: 'Work',
											immp_user_name: values[i].replace('* ', ''),
											immp_service: items[i],
										}
										immp_keys.push(properties)
									}
								} else {
									properties = {
										immp_label: 'Work',
										immp_user_name: values[2],
										immp_service: values[1].replace('* ', ''),
									}
									immp_keys.push(properties)
								}
							}
						}
						_.extend(data[c], {immps: immp_keys})

						for (var k = 0; k < immp_keys.length; k++) {
							var current_data = data[c]
							var current_key = immp_keys[k]
							delete current_data[current_key]
						}

						var address_keys = []
						for (var kp = 0; kp < address_key_pairs.length; kp++) {
							var current_data = data[c]
							var keys = address_key_pairs[kp]
							var values = []
							for (var i = 0; i < keys.length; i++) {
								values.push(current_data[keys[i]])
							}
							if (values[1] && values[1].length > 0) {
								if (values[1].includes(':::')) {
									var street = values[1].split(' ::: ')
									var city = values[2].split(' ::: ')
									var state = values[3].split(' ::: ')
									var postal_code = values[4].split(' ::: ')
									for (var i = 0; i < items.length; i++) {
										properties = {
											address_label: values[0].replace('* ', ''),
											street: street[i],
											city: city[i],
											state: state[i],
											postal_code: postal_code[i],
										}
										address_keys.push(properties)
									}
								} else {
									properties = {
										address_label: values[0].replace('* ', ''),
										street: values[1],
										city: values[2],
										state: values[3],
										postal_code: values[4],
									}
									address_keys.push(properties)
								}
							}
						}
						_.extend(data[c], {addresses: address_keys})

						for (var k = 0; k < address_keys.length; k++) {
							var current_data = data[c]
							var current_key = address_keys[k]
							delete current_data[current_key]
						}
					}

					var newContacts = data.map(function (item) {
						var date = new Date();
						var firstName = item["First"];
						var lastName = item["Last"];

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

						if (!firstName && lastName && lastName === item["Company"] || !firstName && !lastName && item["Company"]) {
							var isCompany = true
						} else {
							var isCompany = false
						}

						if (item["Is Company"] === true) {
							var isCompany = true
						}

						if (lastName === item["Company"]) {
							var lastName = ""
						}

						return {
							prefix: item["Prefix"],
							first: firstName,
							middle: item["Middle"],
							last: lastName,
							nameFirst: comboNameFirst,
							nameLast: comboNameLast,
							suffix: item["Suffix"],
							phonetic_first: item["Phonetic First"],
							phonetic_middle: item["Phonetic Middle"],
							phonetic_last: item["Phonetic Last"],
							nickname: item["Nickname"],
							maiden: item["Maiden"],
							job_title: item["Job Title"],
							department: item["Department"],
							company: item["Company"],
							is_company: isCompany,
							phones: item["phones"],
							emails: item["emails"],
							urls: item["urls"],
							dates: item["dates"],
							relateds: item["relateds"],
							immps: item["immps"],
							addresses: item["addresses"],
							notes: item["Notes"],
						}
					});

					for (var i = 0; i < newContacts.length; i++) {
						Meteor.call('contactInsert', newContacts[i], function(error, result) {
							if (error) {
								return alert(error.reason);
							}
						});
						if (i + 2 > newContacts.length) {
							$('.js_complete, .js_complete_btns').show()
							$('.js_loading, .js_import_btns, .js_toolbar_disable').hide()
							$('.js_saving_msg').text('Import Complete');
							$('.js_choose_file_btn').text('Complete');
							$('.js_cancel_import_btn, .js_choose_file_btn').addClass('js_inactive');
						}
					}
				}
			});
		} else {
			alert('File type must be vcf or csv.')
		}
	},
});
