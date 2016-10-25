Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function() { return [
		Meteor.subscribe('officeControls'),
		Meteor.subscribe('userData'),
		Meteor.subscribe('groupData'),
	]}
});

var requireLogin = function() {
	if (!Meteor.userId()) {
		if (Meteor.loggingIn()) {
			this.render(this.loadingTemplate);
		} else {
			Session.set('currentContact', '')
			Router.go('/login');
		}
	} else {
		var group = Groups.findOne();
		var stripeEnd = moment.unix(group.stripeEnd).utc().valueOf();
		var stripePause = group.stripePause;
		var stripeSubcription = group.stripeSubcription;
		var free_account_expires = moment(Groups.findOne().created_on).add(Controls.findOne().freeTrial, Meteor.settings.public.trialTime).utc().valueOf();
		var current_date = moment().utc().valueOf();

		console.log(stripeEnd +" "+ current_date)

		if (stripePause === 'adminPause' && stripeEnd <= current_date || !stripeSubcription && free_account_expires <= current_date && Meteor.user().role.app_administrator === false && Controls.findOne().publicBeta === false) {
			if (Meteor.user().role.administrator) {
				Session.set('billingExpired', true)
				$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled, .icn_controls_disabled, .icn_action_disabled, .search_box_disabled').show();
				$('.icn_add_tag, .icn_add_contact, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag, .icn_controls, .icn_action, .search_box').hide();
				if ($(window).width() < 768) {
					$('.icn_action').hide();
					$('.icn_action_disabled').show();
				} else {
					$('.icn_action, .icn_action_disabled').hide();
				}
				Router.go('userBilling');
				this.next();
			} else {
				Meteor.logout();
			}
		} else {
			Session.set('billingExpired', false);
			$('.icn_add_tag, .icn_add_contact, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled, .icn_controls, .search_box').show();
			$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag, .icn_controls_disabled, .search_box_disabled').hide();
			if ($(window).width() < 768) {
				$('.icn_action').show();
				$('.icn_action_disabled').hide();
			} else {
				$('.icn_action, .icn_action_disabled').hide();
			}
			this.next();
		}
	}
};

var checkLogin = function() {
	this.render(this.loadingTemplate);
	if (Meteor.user()) {
		Meteor.call('updateRemember', Session.get('remember_me'), Session.get('logout_time'), function(error) {
			if (error) {
				return alert(error.reason)
			} else {
				Router.go('/info/tag/all_contacts_tag');
			}
		});
	} else {
		this.next()
	}
};

var startUp = function() {
	Session.set('startUp', false);
};

var checkTimeout = function() {
	var initialCheckTimeout = setInterval(function() {
		if ( Meteor.user({_id: Meteor.userId()}) ) {
			clearInterval(initialCheckTimeout);
			var current_date = moment().utc().valueOf();
			var logout_time = moment(Meteor.user({_id: Meteor.userId()}).profile.logout_time).utc().valueOf();
			var inactive = Meteor.user({_id: Meteor.userId()}).role.inactive

			if (Meteor.user().profile.remember_me === false && logout_time <= current_date) {
				Session.set('logoutReason', 'time')
				Meteor.logout();
			}
			if (inactive) {
				Session.set('logoutReason', 'inactive')
				Meteor.logout();
			}
		}
	});
};

var searchClear = function() {
	$('.js_search_input').val('');
	$('.js_tool_search').hide();
	$('.js_tool_list').show();
}

Router.onBeforeAction(checkLogin, {only: ['login', 'register', 'emailNotVerified', 'emailVerified', 'reset', 'resetPassword', 'passwordLinkSent']});
Router.onBeforeAction(requireLogin, {except: ['home', 'pricing', 'support', 'supportSection', 'contact', 'facebook', 'twitter', 'linkedin', 'login', 'register', 'emailNotVerified', 'emailVerified', 'reset', 'resetPassword', 'passwordLinkSent', 'exportLoading', 'stripe']});
Router.onAfterAction(startUp, {except: ['exportLoading', 'stripe']})
Router.onAfterAction(checkTimeout, {except: ['home', 'pricing', 'support', 'supportSection', 'contact', 'facebook', 'twitter', 'linkedin', 'login', 'register', 'emailNotVerified', 'emailVerified', 'reset', 'resetPassword', 'passwordLinkSent', 'exportLoading', 'stripe']})
Router.onAfterAction(searchClear, {except: ['contactsSearch', 'contactInfo', 'exportLoading', 'stripe']});


//Account Routes
Router.route('login', {
	path: '/login',
	template: 'login',
	layoutTemplate: 'index',
	yieldTemplates: {
		'data': {to: 'data'},
	},
	onAfterAction: function() {
		SEO.set({
      title: 'All Natural Contact: Sign In',
      meta: {
        description: 'Sign In'
      }
    });
	}
});

Router.route('register', {
	path: '/register',
	template: 'register',
	layoutTemplate: 'index',
	onAfterAction: function() {
		SEO.set({
      title: 'All Natural Contact: Create Account',
      meta: {
        description: 'Create Account'
      }
    });
	}
});

Router.route('emailNotVerified', {
	path: '/not/verified',
	template: 'emailNotVerified',
	layoutTemplate: 'index',
	onAfterAction: function() {
		SEO.set({
      title: 'All Natural Contact: Verify Email',
      meta: {
        description: 'Verify Email'
      }
    });
	}
});

Router.route('emailVerified', {
	path: '/verify/email/:token',
	onBeforeAction: function() {
		Accounts.verifyEmail(this.params.token, function(error) {
			if (error) {
				alert()
				Router.go('/login');
			} else {
				Router.go('/info/tag/all_contacts_tag');
			}
		});
	},
	onAfterAction: function() {
		SEO.set({
      title: 'All Natural Contact: Email Verified',
      meta: {
        description: 'Email Verified'
      }
    });
	}
});

Router.route('reset', {
	path: '/rest/password',
	template: 'reset',
	layoutTemplate: 'index',
	onAfterAction: function() {
		SEO.set({
      title: 'All Natural Contact: Reset Password',
      meta: {
        description: 'Reset Password'
      }
    });
	}
});

Router.route('resetPassword', {
	path: '/reset/password/:token',
	template: 'passwordNew',
	layoutTemplate: 'index',
	onAfterAction: function() {
		Session.set('resetToken', this.params.token);
		SEO.set({
      title: 'All Natural Contact: New Password',
      meta: {
        description: 'New Password'
      }
    });
	}
});

Router.route('passwordLinkSent', {
	path: '/password/link/sent',
	template: 'passwordLinkSent',
	layoutTemplate: 'index',
	onAfterAction: function() {
		SEO.set({
      title: 'All Natural Contact: Password Sent',
      meta: {
        description: 'Password Sent'
      }
    });
	}
});



//Server Side Stripe Routes
Router.route('/webhooks/stripe', function () {
	var request = this.request.body;

	switch(request.type){
    case "customer.subscription.updated":
			console.log('\n/--------------------- Subscription ' +  moment().tz('America/Chicago').format('MM/DD/YY - h:mm A') + '---------------------/')
			console.log(request.data.object);
      break;
    case "invoice.payment_failed":
			console.log('\n/--------------------- Invoice ' +  moment().tz('America/Chicago').format('MM/DD/YY - h:mm A') + '---------------------/')
			console.log(request.data.object);
      break;
  }

	this.response.statusCode = 200;
  this.response.end('Stripe Webhooks Received\n');
}, {name: 'stripe', where: 'server'});



//Import and Export Routes
Router.route('importCSV', {
	path: '/import/csv',
	template: 'importCSV',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerImportContacts': {to: 'footerOne'}
	},
	waitOn: function() {
		Meteor.subscribe('accountContactCount');
	},
	onAfterAction: function() {
		if (!Session.get('currentRoute')) {
			Session.set('currentRoute', '/info/tag/all_contacts_tag')
		}

		Session.set({
			contactScrollDir: 'middle',
			contactPivotId: '',
		})

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('exportCSV', {
	path: '/export',
	template: 'exportCSV',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerExportContacts': {to: 'footerOne'}
	},
	waitOn: function() {
		var tags = TagSelect.find()
		var tagIds = []
		tags.forEach(function(tag) {
			tagIds.push(tag.tagId)
		})
		Meteor.subscribe('taggedContactCount', tagIds);
		Meteor.subscribe('accountContactCount');
	},
	onAfterAction: function() {
		if (!Session.get('currentRoute')) {
			Session.set('currentRoute', '/info/tag/all_contacts_tag')
		}

		Session.set({
			contactScrollDir: 'middle',
			contactPivotId: '',
		})

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('exportLoading', {
	path: '/export/:userId/:contacts/:ids',
	template: 'exportLoading',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerExportReturn': {to: 'footerOne'}
	},
	where: 'server',
	action: function () {
		var ids = this.params.ids
		var ids = ids.split(',')
		var userId = this.userId
		var groupId = Meteor.users.findOne({_id: this.params.userId}).profile.belongs_to_group;

		if (this.params.contacts === 'all') {
			var contacts = Contacts.find({groupId: groupId}).fetch()

		} else if (this.params.contacts === 'selected') {
			var contacts = Contacts.find({groupId: groupId, _id: {$in: ids}}).fetch()

		} else if (this.params.contacts === 'tagged') {
			var tagged = Tags.find({groupId: groupId, _id: {$in: ids}})
			var contactIds = []
			tagged.forEach(function(tag) {
				var contacts = tag.has_contacts
				for (var i = 0; i < contacts.length; i++) {
					contactIds.push(contacts[i])
				}
			})
			var contacts = Contacts.find({groupId: groupId, _id: {$in: contactIds}}).fetch()

		}

		var contactCount = contacts.length

		var phoneCount = [];
		var emailCount = [];
		var urlCount = [];
		var dateCount = [];
		var relatedCount = [];
		var immpCount = [];
		var addressCount = [];

		contacts.forEach(function(contact, index) {
			phoneCount.push(contact.phones.length)
			emailCount.push(contact.emails.length)
			urlCount.push(contact.urls.length)
			dateCount.push(contact.dates.length)
			relatedCount.push(contact.relateds.length)
			immpCount.push(contact.immps.length)
			addressCount.push(contact.addresses.length)
		})

		var phoneLabels = Math.max.apply(Math, phoneCount)
		var emailLabels = Math.max.apply(Math, emailCount)
		var urlLabels = Math.max.apply(Math, urlCount)
		var dateLabels = Math.max.apply(Math, dateCount)
		var relatedLabels = Math.max.apply(Math, relatedCount)
		var immpLabels = Math.max.apply(Math, immpCount)
		var addressLabels = Math.max.apply(Math, addressCount)

		var data = [];

		_.each(contacts, function(contact) {
			var basicInfo = [];
			var phoneInfo = [];
			var emailInfo = [];
			var urlInfo = [];
			var dateInfo = [];
			var relatedInfo = [];
			var immpInfo = [];
			var addressInfo = [];
			var noteInfo = []

			if (contact.is_company) {
				var is_company = "true"
			} else {
				var is_company = "false"
			}

			basicInfo.push(
				contact.prefix,
				contact.first,
				contact.middle,
				contact.last,
				contact.suffix,
				contact.phonetic_first,
				contact.phonetic_middle,
				contact.phonetic_last,
				contact.nickname,
				contact.maiden,
				contact.job_title,
				contact.department,
				contact.company,
				is_company
			)

			for (var i = 0; i < phoneLabels; i++) {
				if (i < contact.phones.length) {
					phoneInfo.push(
						contact.phones[i].phone_label,
						contact.phones[i].phone
					)
				} else {
					phoneInfo.push(
						'',
						''
					)
				}
			}

			for (var i = 0; i < emailLabels; i++) {
				if (i < contact.emails.length) {
					emailInfo.push(
						contact.emails[i].email_label,
						contact.emails[i].email
					)
				} else {
					emailInfo.push(
						'',
						''
					)
				}
			}

			for (var i = 0; i < urlLabels; i++) {
				if (i < contact.urls.length) {
					urlInfo.push(
						contact.urls[i].url_label,
						contact.urls[i].url
					)
				} else {
					urlInfo.push(
						'',
						''
					)
				}
			}

			for (var i = 0; i < dateLabels; i++) {
				if (i < contact.dates.length) {
					dateInfo.push(
						contact.dates[i].date_label,
						contact.dates[i].date_entry
					)
				} else {
					dateInfo.push(
						'',
						''
					)
				}
			}

			for (var i = 0; i < relatedLabels; i++) {
				if (i < contact.relateds.length) {
					relatedInfo.push(
						contact.relateds[i].related_label,
						contact.relateds[i].related
					)
				} else {
					relatedInfo.push(
						'',
						''
					)
				}
			}

			for (var i = 0; i < immpLabels; i++) {
				if (i < contact.immps.length) {
					immpInfo.push(
						contact.immps[i].immp_label,
						contact.immps[i].immp_user_name,
						contact.immps[i].immp_service
					)
				} else {
					immpInfo.push(
						'',
						'',
						''
					)
				}
			}

			for (var i = 0; i < addressLabels; i++) {
				if (i < contact.addresses.length) {
					addressInfo.push(
						contact.addresses[i].address_label,
						contact.addresses[i].street,
						contact.addresses[i].city,
						contact.addresses[i].state,
						contact.addresses[i].postal_code
					)
				} else {
					addressInfo.push(
						'',
						'',
						'',
						'',
						''
					)
				}
			}

			noteInfo.push(
				contact.notes
			)

			var contcatInfo = basicInfo.concat(phoneInfo, emailInfo, urlInfo, dateInfo, relatedInfo, immpInfo, addressInfo, noteInfo)
			data.push(contcatInfo)
		});

		var fields = [
			'Prefix',
			'First',
			'Middle',
			'Last',
			'Suffix',
			'Phonetic First',
			'Phonetic Middle',
			'Phonetic Last',
			'Nickname',
			'Maiden',
			'Job Title',
			'Department',
			'Company',
			'Is Company',
		];

		for (var i = 0; i < phoneLabels; i++) {
			fields.push(
				'Phone ' + (i + 1) + ' - Type',
				'Phone ' + (i + 1) + ' - Value'
			)
		}
		for (var i = 0; i < emailLabels; i++) {
			fields.push(
				'Email ' + (i + 1) + ' - Type',
				'Email ' + (i + 1) + ' - Value'
			)
		}
		for (var i = 0; i < urlLabels; i++) {
			fields.push(
				'Website ' + (i + 1) + ' - Type',
				'Website ' + (i + 1) + ' - Value'
			)
		}
		for (var i = 0; i < dateLabels; i++) {
			fields.push(
				'Date ' + (i + 1) + ' - Type',
				'Date ' + (i + 1) + ' - Value'
			)
		}
		for (var i = 0; i < relatedLabels; i++) {
			fields.push(
				'Related ' + (i + 1) + ' - Type',
				'Related ' + (i + 1) + ' - Value'
			)
		}
		for (var i = 0; i < immpLabels; i++) {
			fields.push(
				'IM ' + (i + 1) + ' - Type',
				'IM ' + (i + 1) + ' - User Name',
				'IM ' + (i + 1) + ' - Service'
			)
		}
		for (var i = 0; i < addressLabels; i++) {
			fields.push(
				'Address ' + (i + 1) + ' - Type',
				'Address ' + (i + 1) + ' - Street',
				'Address ' + (i + 1) + ' - City',
				'Address ' + (i + 1) + ' - State',
				'Address ' + (i + 1) + ' - Postal Code'
			)
		}

		fields.push('Notes')

		var csv = Papa.unparse({fields: fields, data: data});

		var date = moment().format('MM-DD-YY @ h-mm A')
		if (contactCount === 1) {
			var plural = ''
		} else {
			var plural = 's'
		}

		var filename = contactCount + ' Contact' + plural + ' (' + date + ').csv';

		var headers = {
		  'Content-type': 'text/csv',
		  'Content-Disposition': "attachment; filename=" + filename
		};

		this.response.writeHead(200, headers);
		return this.response.end(csv);
	}
});



//Dasboard Routes
Router.route('dashboard', {
	path: '/dashboard',
	template: 'dashboard',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerToolbar': {to: 'footerOne'}
	},
	waitOn: function() {
		return Meteor.subscribe('conversationRecent')
	},
	data: function() {
		return Conversations.findOne();
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		};
		Session.set('currentTool', 'js_tool_dash');

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});



// Tag Routes
Router.route('/list/tags', {
	name: 'tagList',
});

TagListController = RouteController.extend({
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerToolbar': {to: 'footerOne'}
	},
	subscriptions: function() {
		Meteor.subscribe('tagAlphaCounts');
		Meteor.subscribe('tagCount');
		Meteor.subscribe('firstTag');
		Meteor.subscribe('lastTag');
		Meteor.subscribe('tagScroll', Session.get('tagScrollDir'), Session.get('tagPivotName'));
	},
	tags: function() {
		return Tags.find({milestoneTagType: false}, {sort: {tagName: 1}});
	},
	data: function() {
		return { tags: this.tags(), };
	},
	onAfterAction: function () {
		Session.set({
			contactScrollDir: 'middle',
			contactPivotId: '',
			contactPivotNameLast: '',
			currentTool: 'js_tool_tags',
			currentType: 'tag',
			currentRoute: '/list/tags',
			deleteRoute: '/delete/tags',
			currentContact: '',
			milestoneTag: '',
			milestoneTagName: '',
		});

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('tagListProcess', {
	path: '/list/process/tags/:id',
	template: 'tagListProcess',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'': {to: 'newTag'},
		'footerToolbar': {to: 'footerOne'}
	},
	waitOn: function() {
		return [
			Meteor.subscribe('infoTag', this.params.id),
			Meteor.subscribe('milestoneTags', this.params.id)
		]
	},
	onAfterAction: function() {
		Session.set({
			currentTag: this.params.id,
			contactScrollDir: 'middle',
			currentTool: 'js_tool_tags',
			currentType: 'tag',
			currentRoute: '/list/tags',
			updateRoute: '/update/tag/' + Session.get('currentTag'),
			deleteRoute: '/delete/tags',
			currentContact: '',
		});

		if (!Session.get('milestoneTag')) {
			Session.set({
				milestoneTag: this.params.id,
			});
		}

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('/info/tag/:id', {
	name: 'tagInfo',
});

TagInfoController = RouteController.extend({
	template: 'tagInfo',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerToolbar': {to: 'footerOne'}
	},
	subscriptions: function() {
		Meteor.subscribe('counts', this.params.id);
		Meteor.subscribe('tagCount');
		Meteor.subscribe('infoTag', this.params.id);
		Meteor.subscribe('taggedCount', this.params.id);
		Meteor.subscribe('firstContact', this.params.id);
		Meteor.subscribe('lastContact', this.params.id);
		Meteor.subscribe('contactScroll', this.params.id, Session.get('contactScrollDir'), Session.get('contactPivotNameLast'));
	},
	contacts: function() {
		return Contacts.find({created_on: { $exists: true }});
	},
	data: function() {
		return { contacts: this.contacts(), };
	},
	onAfterAction: function () {
		Session.set({
			contactScrollDir: Session.get('contactScrollDir'),
			conScrollDir: 'up',
			conPivotDate: '',
			conPivotId: '',
			currentType: 'contact', //Informs what type is being edited and deleted
			currentTool: 'js_tool_list',
			deleteRoute: '/delete/contacts',
			currentTag: this.params.id,
		});
		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
			title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
			meta: {
				description: 'All Natural Contact App'
			}
		});
	}
});

Router.route('/reminder/info/tag/:id', {
	name: 'tagReminderInfo',
});

TagReminderInfoController = RouteController.extend({
	template: 'tagReminderInfo',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerToolbar': {to: 'footerOne'}
	},
	subscriptions: function() {
		Meteor.subscribe('counts', this.params.id);
		Meteor.subscribe('tagCount');
		Meteor.subscribe('infoTag', this.params.id);
		Meteor.subscribe('taggedCount', this.params.id);
		Meteor.subscribe('reminderContacts', this.params.id, Session.get('contactScrollDir'), Session.get('contactPivotNameLast'));
	},
	reminderContacts: function() {
		return ReminderContacts.find()
	},
	data: function() {
		return { reminderContacts: this.reminderContacts(), };
	},
	onAfterAction: function () {
		Session.set({
			contactScrollDir: Session.get('contactScrollDir'),
			conScrollDir: 'up',
			conPivotDate: '',
			conPivotId: '',
			currentType: 'contact', //Informs what type is being edited and deleted
			currentTool: 'js_tool_list',
			deleteRoute: '/delete/contacts',
			currentTag: this.params.id,
			reminderTag: true,
		});
		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
			title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
			meta: {
				description: 'All Natural Contact App'
			}
		});
	}
});

Router.route('tagNewStandard', {
	path: '/new/standard/tag',
	template: 'tagNew',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'tagNewStandard': {to: 'newTag'},
		'footerSaveTag': {to: 'footerOne'}
	},
	onAfterAction: function () {
		$('.js_sheet_action').slideUp('fast');
		Session.set('tagType', 'js_standard_toggle');

		if (!Session.get('currentRoute')) {
			Session.set('currentRoute', '/info/tag/all_contacts_tag');
		};
		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
			title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
			meta: {
				description: 'All Natural Contact App'
			}
		});
	}
});

Router.route('tagNewReminder', {
	path: '/new/reminder/tag',
	template: 'tagNew',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'tagNewReminder': {to: 'newTag'},
		'footerSaveTag': {to: 'footerOne'}
	},
	waitOn: function() {
		return Meteor.subscribe('conversationLabels')
	},
	onAfterAction: function () {
		$('.js_sheet_action').slideUp('fast');
		Session.set('tagType', 'js_reminder_toggle');

		if (!Session.get('currentRoute')) {
			Session.set('currentRoute', '/info/tag/all_contacts_tag');
		};

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('tagNewProcess', {
	path: '/new/process/tag',
	template: 'tagNew',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'tagNewProcess': {to: 'newTag'},
		'footerSaveTag': {to: 'footerOne'}
	},
	onAfterAction: function () {
		$('.js_sheet_action').slideUp('fast');
		Session.set('tagType', 'js_process_toggle');

		if (!Session.get('currentRoute')) {
			Session.set('currentRoute', '/info/tag/all_contacts_tag');
		};

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('tagUpdate', {
	path: '/update/tag/:id',
	template: 'tagUpdate',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerUpdateTag': {to: 'footerOne'}
	},
	waitOn: function() {
		return [
			Meteor.subscribe('conversationLabels'),
			Meteor.subscribe('milestoneTags', this.params.id),
			Meteor.subscribe('infoTag', this.params.id)
		]
	},
	data: function() { return Tags.findOne(this.params.id); },
	onAfterAction: function () {
		if (!Session.get('currentRoute')) {
			Session.set('currentRoute', '/info/tag/all_contacts_tag');
		};

		Session.set('currentType', 'tag');

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('/select/tag', {
	name: 'tagSelect',
});

TagSelectController = RouteController.extend({
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerAddToTag': {to: 'footerOne'}
	},
	subscriptions: function() {
		Meteor.subscribe('tagAlphaCounts');
		Meteor.subscribe('tagCount')
		Meteor.subscribe('firstTag');
		Meteor.subscribe('lastTag');
		Meteor.subscribe('tagScroll', Session.get('tagScrollDir'), Session.get('tagPivotName'));
	},
	tags: function() {
		return Tags.find({created_on: { $exists: true }}, {sort: {tagName: 1}});
	},
	data: function() {
		return { tags: this.tags(), };
	},
	onAfterAction: function () {
		if (!Session.get('currentRoute')) {
			Session.set('currentRoute', '/info/tag/all_contacts_tag');
		};

		Session.set({
			contactScrollDir: 'middle',
			currentTool: 'js_tool_tags',
			currentType: 'tag',
			currentContact: '',
			milestoneTag: '',
			milestoneTagName: '',
		});

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('tagSelectProcess', {
	path: '/select/process/tags/:id',
	template: 'tagSelectProcess',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'': {to: 'newTag'},
		'footerAddToTag': {to: 'footerOne'}
	},
	waitOn: function() {
		if (Session.get('startUp')) {
			this.router.go('/info/tag/all_contacts_tag');
		}
		return [
			Meteor.subscribe('infoTag', this.params.id),
			Meteor.subscribe('milestoneTags', this.params.id)
		]
	},
	onAfterAction: function() {
		Session.set({
			currentTag: this.params.id,
			currentTagName: Tags.findOne({_id: this.params.id}).tagName,
		});

		if (!Session.get('milestoneTag')) {
			Session.set({
				milestoneTag: this.params.id,
				milestoneTagName: Tags.findOne({_id: this.params.id}).tagName,
			});
		}

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});




// Contact Routes
Router.route('/info/contact/:id', {
	name: 'contactInfo',
});

ContactInfoController = RouteController.extend({
	template: 'contactInfo',
	yieldTemplates: {
		'data': {to: 'data'},
		'conversationInfo': {to: 'contentTwo'},
		'tagProcess': {to: 'contentThree'},
		'footerToolbar': {to: 'footerOne'}
	},
	subscriptions: function() {
		var userId = Meteor.userId()
		Meteor.subscribe('tagCount');
		Meteor.subscribe('conversationCount', this.params.id, userId);
		Meteor.subscribe('firstConversation', this.params.id, userId);
		Meteor.subscribe('lastConversation', this.params.id, userId);
		Meteor.subscribe('contactProcessTags', this.params.id, userId);
		Meteor.subscribe('processCount', this.params.id, userId);
		Meteor.subscribe('contactInfo', this.params.id, Session.get('conScrollDir'), Session.get('conPivotDate'), userId);
	},
	conversations: function() {
		return Conversations.find({contact_id: this.params.id, created_on: { $exists: true }}, {sort: {conversation_date: -1}});
	},
	data: function() {
		return { conversations: this.conversations(), };
	},
	onAfterAction: function() {
  	if (!Session.get('currentTag')) {
  		Session.set('currentTag', 'all_contacts_tag');
  	};

  	Session.set({
 		contactScrollDir: 'middle',
 		conScrollDir: Session.get('conScrollDir'),
 		contactPivotId: this.params.id,
  		currentContact: this.params.id,
  		currentType: 'contact',
  		currentRoute: '/info/contact/' + this.params.id,
  		updateRoute: '/update/contact/' + this.params.id,
  		deleteRoute: '/delete/contacts'
  	});

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('contactNew', {
	path: '/new/contact',
	template: 'contactNew',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerSaveContact': {to: 'footerOne'}
	},
	waitOn: function() {
		var userId = Meteor.userId()
		return [
			Meteor.subscribe('contactLabels'),
			Meteor.subscribe('counts', 'all_contacts_tag', userId)
		]
	},
	onAfterAction: function () {
		$('.js_sheet_action').slideUp('fast');

		if (!Session.get('currentRoute')) {
			Session.set('currentRoute', '/info/tag/all_contacts_tag');
		};

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('contactUpdate', {
	path: '/update/contact/:_id',
	template: 'contactUpdate',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerUpdateContact': {to: 'footerOne'}
	},
	waitOn: function() {
		var userId = Meteor.userId()
		if (this.params.id != 'all_contacts_tag' && Session.get('startUp')) {
			this.router.go('/info/tag/all_contacts_tag');
		}
		return [
			Meteor.subscribe('contactLabels'),
			Meteor.subscribe('counts', 'all_contacts_tag', userId),
			Meteor.subscribe('contactInfo', this.params._id, userId),
		]
	},
	data: function() { return Contacts.findOne(this.params._id); },
	onAfterAction: function () {
		if (!Session.get('currentRoute')) {
			Session.set('currentRoute', '/info/tag/all_contacts_tag');
		};

		Session.set('currentType', 'contact');

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});



// Conversation Routes
Router.route('conversationNew', {
	path: '/new/conversation/:_id',
	template: 'conversationNew',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerSaveConversation': {to: 'footerOne'}
	},
	waitOn: function() {
		var userId = Meteor.userId()
		return [
			Meteor.subscribe('conversationLabels'),
			Meteor.subscribe('firstConversation', this.params._id, userId),
			Meteor.subscribe('conversationNew', this.params._id, userId)
		]
	},
	data: function() { return Contacts.findOne(this.params._id); },
	onAfterAction: function () {
		$('.js_sheet_action').slideUp('fast');

		if (!Session.get('currentRoute')) {
			Session.set('currentRoute', '/info/tag/all_contacts_tag');
		};

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('conversationUpdate', {
	path: '/update/conversation/:_id',
	template: 'conversationUpdate',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerUpdateConversation': {to: 'footerOne'}
	},
	waitOn: function() {
		return [
			Meteor.subscribe('conversationLabels'),
			Meteor.subscribe('firstConversation', Session.get('currentContact')),
			Meteor.subscribe('conversationUpdate', this.params._id, Session.get('currentContact'))
		]
	},
	data: function() { return Conversations.findOne(this.params._id); },
	onAfterAction: function () {
		if (!Session.get('currentContact')) {
			Router.go('/info/tag/all_contacts_tag')
		};

		if (!Session.get('currentRoute')) {
			Session.set('currentRoute', '/info/tag/all_contacts_tag');
		};

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});



// Settings Routes
Router.route('settings', {
	path: '/settings',
	template: 'settings',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerToolbar': {to: 'footerOne'}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		};
		Session.set({
			contactScrollDir: 'middle',
			contactPivotId: '',
			contactPivotNameLast: '',
			currentTool: 'js_tool_tags',
			currentType: 'tag',
			currentRoute: '/list/tags',
			updateRoute: '/update/tag/' + Session.get('currentTag'),
			deleteRoute: '/delete/tags',
			currentContact: '',
			milestoneTag: '',
			milestoneTagName: '',
		});
		$('.js_tool').removeClass('js_tool_current active');
		Session.set('currentTool', '');
		Session.set('updateUser', Meteor.userId())

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	},
});

Router.route('userAccountInfo', {
	path: '/account/name',
	template: 'userAccountInfo',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerSaveAccountName': {to: 'footerOne'}
	},
	onBeforeAction: function() {
		if (Meteor.user().role.app_administrator) {
			Router.go('settings')
		} else {
			this.next();
		}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('userNew', {
	path: '/new/user',
	template: 'userNew',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerSaveNewUser': {to: 'footerOne'}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('userCreated', {
	path: '/created/user',
	template: 'userCreated',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerUser': {to: 'footerOne'}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('userRoles', {
	path: '/roles',
	template: 'userRoles',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerSaveRole': {to: 'footerOne'}
	},
	onBeforeAction: function() {
		if (Meteor.user().role.app_administrator) {
			Router.go('settings')
		} else {
			this.next();
		}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('userBilling', {
	path: '/billing',
	template: 'userBilling',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerSaveBilling': {to: 'footerOne'}
	},
	onBeforeAction: function() {
		if (Meteor.user().role.app_administrator) {
			Router.go('settings')
		} else {
			this.next();
		}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
})

Router.route('pauseAccount', {
	path: '/pause/account',
	template: 'pauseAccount',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerPauseAccount': {to: 'footerOne'}
	},
	onBeforeAction: function() {
		if (Meteor.user().role.app_administrator) {
			Router.go('settings')
		} else {
			this.next();
		}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
})

Router.route('userVerification', {
	path: '/verify/user/:id',
	template: 'userVerification',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerResendVerification': {to: 'footerOne'}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}
		Session.set('updateUser', this.params.id)

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('userVerificationSent', {
	path: '/verification/sent/user',
	template: 'userVerificationSent',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerUser': {to: 'footerOne'}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('userDelete', {
	path: '/delete/user/:id',
	template: 'userDelete',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerUserDelete': {to: 'footerOne'}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}
		Session.set('updateUser', this.params.id)

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('userInfo', {
	path: '/info/user/:id',
	template: 'userInfo',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerUser': {to: 'footerOne'}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}
		Session.set('updateUser', this.params.id)

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('userProfile', {
	path: '/profile/user/:id',
	template: 'userProfile',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerSaveProfile': {to: 'footerOne'}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}
		Session.set('updateUser', this.params.id)

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('userEmail', {
	path: '/email/user/:id',
	template: 'userEmail',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerSaveEmail': {to: 'footerOne'}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}
		Session.set('updateUser', this.params.id)

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('userTimezone', {
	path: '/timezone/user/:id',
	template: 'userTimezone',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerSaveTimezone': {to: 'footerOne'}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}
		Session.set('updateUser', this.params.id)

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
})

Router.route('userFields', {
	path: '/fields/user/:id',
	template: 'userFields',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerSaveFields': {to: 'footerOne'}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}
		Session.set('updateUser', this.params.id)

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('userDropdowns', {
	path: '/dropdowns/user/:id',
	template: 'userDropdowns',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerReturnDropdowns': {to: 'footerOne'}
	},
	waitOn: function() {
		return Meteor.subscribe('settingsData')
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}
		Session.set('updateUser', this.params.id)

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('userLabels', {
	path: '/labels/:type/user/:id',
	template: 'userLabels',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerSaveLabels': {to: 'footerOne'}
	},
	waitOn: function() { return [
			Meteor.subscribe('settingsData'),
			Meteor.subscribe('userLabels', this.params.type)
		]
	},
	onAfterAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}
		Session.set('updateUser', this.params.id)

		var labelMap = {
			phone_label: 'Phone Label',
			email_label: 'Email Label',
			url_label: 'Website Label',
			date_label: 'Date Label',
			related_label: 'Related Label',
			immp_label: 'IM Label',
			immp_service_label: 'IM Service Label',
			address_label: 'Address Label',
			conversation_label: 'Conversation Label'
		}
		var labelHeading = this.params.type
		Session.set('labelHeading', labelMap[labelHeading]);

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('userReturn', {
	onBeforeAction: function() {
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		}

		// if (Meteor.users.findOne(Meteor.userId()).role.administrator) {
			Router.go('/info/user/' + Session.get('updateUser'));
		// } else {
		// 	Router.go('settings');
		// }
	}
});



// Search Routes
Router.route('contactsSearch', {
	path: '/search/:searchText',
	template: 'search',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerToolbar': {to: 'footerOne'}
	},
	waitOn: function() {
		Meteor.subscribe('contactsSearch', this.params.searchText);
	},
	onAfterAction: function() {
		Session.set('searchText', this.params.searchText)
		if (!Session.get('currentTag')) {
			Session.set('currentTag', 'all_contacts_tag');
		};
		Session.set('currentTool', 'js_tool_dash');

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});



// Delete Routes
Router.route('deleteContacts', {
	path: '/delete/contacts',
	template: 'deleteRemove',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerDelete': {to: 'footerOne'}
	},
	waitOn: function() {
		if (Session.get('startUp')) {
			this.router.go('/info/tag/all_contacts_tag');
		}

		var contactIds = ContactSelect.find().map(function(p) { return p.contactId });
		Meteor.subscribe('deleteContacts', contactIds);
	},
	onAfterAction: function () {
		if (!Session.get('currentRoute')) {
			Session.set('currentRoute', '/info/tag/all_contacts_tag');
		};

		Session.set('deleteClass', 'js_delete_contact');

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('deleteConversations', {
	path: '/delete/conversations',
	template: 'deleteRemove',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerDelete': {to: 'footerOne'}
	},
	waitOn: function() {
		if (Session.get('startUp')) {
			this.router.go('/info/contact/' + Sesson.get('currentContact'));
		}
	},
	onAfterAction: function () {
		if (!Session.get('currentRoute')) {
			Session.set('currentRoute', '/info/tag/all_contacts_tag');
		};

		Session.set('deleteClass', 'js_delete_conversation');

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});

Router.route('deleteTags', {
	path: '/delete/tags',
	template: 'deleteRemove',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerDelete': {to: 'footerOne'}
	},
	waitOn: function() {
		if (Session.get('startUp')) {
			this.router.go('/list/tags');
		}
	},
	onAfterAction: function () {
		if (!Session.get('currentRoute')) {
			Session.set('currentRoute', '/info/tag/all_contacts_tag');
		};

		Session.set('deleteClass', 'js_delete_tag');

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});



//Fake Data Route
Router.route('fakeData', {
	path: '/fake/data',
	template: 'fakeData',
	yieldTemplates: {
		'data': {to: 'data'},
		'blankPlaceholderTwo':{to: 'contentTwo'},
		'blankPlaceholderThree':{to: 'contentThree'},
		'footerSaveFakeData': {to: 'footerOne'}
	},
	waitOn: function() {
		Meteor.subscribe('accountTagCount');
		Meteor.subscribe('accountContactCount');
		Meteor.subscribe('accountConversationCount');
	},
	onAfterAction: function () {
		if (!Session.get('currentRoute')) {
			Session.set('currentRoute', '/info/tag/all_contacts_tag');
		};

		Session.set({
			targetTotalTags: 0,
			targetTotalContacts: 0,
			targetTotalConversations: 0
		})

		var currentUser = Meteor.users.findOne(Meteor.userId())
		SEO.set({
      title: 'All Natural Contact: ' + currentUser.profile.first +" "+ currentUser.profile.last,
      meta: {
        description: 'All Natural Contact App'
      }
    });
	}
});
