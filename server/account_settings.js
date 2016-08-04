import ElasticSearch from 'elasticsearch';

EsClient = new ElasticSearch.Client({
  host: Meteor.settings.private.esUrl,
  // log: 'trace'
});

Accounts.config ({
	loginExpirationInDays: 9999,
	sendVerificationEmail: true,
});

Meteor.startup(function () {
  Contacts._ensureIndex({groupId: 1, nameLast: 1, nameFirst: 1, company: 1});
  Tags._ensureIndex({groupId: 1, milestoneTagType: 1, personal: 1, tagName: 1});
  Conversations._ensureIndex({groupId: 1, belongs_to_contact: 1, conversation_date: -1});

  process.env.MAIL_URL = 'smtp://keynotestore.com:Vandalia6578@smtp.sendgrid.net:587';
  var email = Meteor.users.find({"emails.0.address": "admin@allnaturalapps.com"}).fetch()
  var group_id = new Mongo.ObjectID().toHexString();

  if (email.length === 0) {
    var group = {
      group_id: group_id,
      group_name: 'App Administration',
    }

		var profile = {
			first: 'Phillip',
			last: 'Gore',
      email_updates: false,
			remember_me: false,
			logout_time: moment().add(1, 'd').toISOString(),
			timezone: jstz.determine().name(),
      belongs_to_group: group_id,
		}

		var role = {
      app_administrator: true,
			administrator: false,
			user: false,
			inactive: false,
		}

		var fields = {
			prefix_field: false,
			middle_field: false,
			suffix_field: false,

			phonetic_field: false,
			nickname_field: false,
			maiden_field: false,

			job_title_field: true,
			department_field: true,
			company_field: true,

			phone_field: true,
			email_field: true,
			url_field: true,

			date_field: true,
			related_field: true,
			immp_field: true,
			address_field: true
		}

    var userId = Accounts.createUser({
      group: group,
      email: 'admin@allnaturalapps.com',
      password: '6578ayanal6578',
      profile: profile,
      role: role,
      fields: fields
    })

    Accounts.sendVerificationEmail(userId, 'admin@allnaturalapps.com');
  }

  var controls = Controls.findOne()
  if (!controls) {
    Controls.insert({freeTrial: 30, bugReporting: true, publicBeta: true})
  }
});

Accounts.emailTemplates = {
	from: 'All Natural Contact <no-reply@allnaturalcontact.com>',
	siteName: 'All Natural Contact',

	resetPassword: {
		subject: function(user, url) {
			return 'Reset your password for ' + Accounts.emailTemplates.siteName + '.';
		},
		text: function(user, url) {
			url = url.replace('#/reset-password/', 'reset/password/')
			first = user.profile.first
			return first + ',\n\n Sorry you forgot your password. Click the link below and we’ll help you get a new one.\n\n\t' + url + '\n\nIf you didn\'t request a password reset, please ignore this email. \n\nThanks.';
	    }
	},

	verifyEmail: {
		subject: function(user, url) {
			return 'Please verify email address for ' + Accounts.emailTemplates.siteName + '.';
		},
		text: function(user, url) {
			url = url.replace('#/verify-email/', 'verify/email/')
			first = user.profile.first
			return first + ',\n\n Welcome to All Natural Contact. We need to verify your email address to complete your signup. Please click the verification link below.\n\n\t' + url + ' \n\nIf you have not signed up for All Natural Contact, please ignore this email. \n\nThanks.';
		}
	}
};

Accounts.validateLoginAttempt(function(attempt) {
	if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified ) {
		return false;
	}
	return true;
});

Accounts.onLogin(function() {
  var userId = Meteor.userId();
  var groupId = Meteor.users.findOne({_id: userId}).profile.belongs_to_group;
  var labels = Labels.findOne({'user.userID': userId})
  if (!labels) {
    updateLabels(userId, groupId)
  }
})

Accounts.onCreateUser(function(options, user) {
	user.profile = options.profile || {};
	user.role = options.role || {};
	user.fields = options.fields || {};

  var current_group = Groups.findOne({_id: options.group.group_id})
  if (current_group) {

    var user_array = current_group.has_users
    user_array.push(user._id)

    var groupProperties = {
      has_users: user_array,
    }
    Meteor.call('groupUpdate', options.group.group_id, groupProperties);
    updateLabels(user._id, options.group.group_id)
  } else {

    var user_array = []
    user_array.push(user._id)
    var groupProperties = {
      _id: options.group.group_id,
      name: options.group.group_name,
      has_users: user_array,
    }
    Meteor.call('groupInsert', groupProperties);
    initiateLabels(user._id, options.group.group_id)
  }
	return user;
});

Meteor.methods({
	resendAuthentication: function(userId, email) {
		if (Meteor.user().role.administrator) {
			Meteor.users.update(userId, {$set: {"emails.0.address": email}});
			Accounts.sendVerificationEmail(userId, email);
		}
	},
});

function initiateLabels(userId, groupId) {
  var labelProperties = [
    //Address
      {
        labelName: 'Work',
        labelType: 'address_label',
        user: [{
          userId: userId,
          labelOrder: 1,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Home',
        labelType: 'address_label',
        user: [{
          userId: userId,
          labelOrder: 2,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Other',
        labelType: 'address_label',
        user: [{
          userId: userId,
          labelOrder: 3,
          labelVisible: true,
        }],
        groupId: groupId,
      },

    //Conversation
      {
        labelName: 'Phone',
        labelType: 'conversation_label',
        user: [{
          userId: userId,
          labelOrder: 1,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Voicemail',
        labelType: 'conversation_label',
        user: [{
          userId: userId,
          labelOrder: 2,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Email',
        labelType: 'conversation_label',
        user: [{
          userId: userId,
          labelOrder: 3,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Text',
        labelType: 'conversation_label',
        user: [{
          userId: userId,
          labelOrder: 4,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Meeting',
        labelType: 'conversation_label',
        user: [{
          userId: userId,
          labelOrder: 5,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Video Chat',
        labelType: 'conversation_label',
        user: [{
          userId: userId,
          labelOrder: 6,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Conference Call',
        labelType: 'conversation_label',
        user: [{
          userId: userId,
          labelOrder: 7,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Newsletter',
        labelType: 'conversation_label',
        user: [{
          userId: userId,
          labelOrder: 8,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Fax',
        labelType: 'conversation_label',
        user: [{
          userId: userId,
          labelOrder: 9,
          labelVisible: true,
        }],
        groupId: groupId,
      },

    //Dates
      {
        labelName: 'Birthday',
        labelType: 'date_label',
        user: [{
          userId: userId,
          labelOrder: 1,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Anniversary',
        labelType: 'date_label',
        user: [{
          userId: userId,
          labelOrder: 2,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Other',
        labelType: 'date_label',
        user: [{
          userId: userId,
          labelOrder: 3,
          labelVisible: true,
        }],
        groupId: groupId,
      },

    //Email
      {
        labelName: 'Work',
        labelType: 'email_label',
        user: [{
          userId: userId,
          labelOrder: 1,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Home',
        labelType: 'email_label',
        user: [{
          userId: userId,
          labelOrder: 2,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Other',
        labelType: 'email_label',
        user: [{
          userId: userId,
          labelOrder: 3,
          labelVisible: true,
        }],
        groupId: groupId,
      },

    //Messaging
      {
        labelName: 'Work',
        labelType: 'immp_label',
        user: [{
          userId: userId,
          labelOrder: 1,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Home',
        labelType: 'immp_label',
        user: [{
          userId: userId,
          labelOrder: 2,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Other',
        labelType: 'immp_label',
        user: [{
          userId: userId,
          labelOrder: 3,
          labelVisible: true,
        }],
        groupId: groupId,
      },

    //Messaging Service
      {
        labelName: 'AIM',
        labelType: 'immp_service_label',
        user: [{
          userId: userId,
          labelOrder: 1,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Facebook',
        labelType: 'immp_service_label',
        user: [{
          userId: userId,
          labelOrder: 2,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Gadu-Gadu',
        labelType: 'immp_service_label',
        user: [{
          userId: userId,
          labelOrder: 3,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Google',
        labelType: 'immp_service_label',
        user: [{
          userId: userId,
          labelOrder: 4,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'ICQ',
        labelType: 'immp_service_label',
        user: [{
          userId: userId,
          labelOrder: 5,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Jabber',
        labelType: 'immp_service_label',
        user: [{
          userId: userId,
          labelOrder: 6,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'MSN',
        labelType: 'immp_service_label',
        user: [{
          userId: userId,
          labelOrder: 7,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'QQ',
        labelType: 'immp_service_label',
        user: [{
          userId: userId,
          labelOrder: 8,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Skype',
        labelType: 'immp_service_label',
        user: [{
          userId: userId,
          labelOrder: 9,
          labelVisible: true,
        }],
        groupId: groupId,
      },

    //Phone
      {
        labelName: 'Mobile',
        labelType: 'phone_label',
        user: [{
          userId: userId,
          labelOrder: 1,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Work',
        labelType: 'phone_label',
        user: [{
          userId: userId,
          labelOrder: 2,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Home',
        labelType: 'phone_label',
        user: [{
          userId: userId,
          labelOrder: 3,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Main',
        labelType: 'phone_label',
        user: [{
          userId: userId,
          labelOrder: 4,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Fax',
        labelType: 'phone_label',
        user: [{
          userId: userId,
          labelOrder: 5,
          labelVisible: true,
        }],
        groupId: groupId,
      },

    //Related
      {
        labelName: 'Mother',
        labelType: 'related_label',
        user: [{
          userId: userId,
          labelOrder: 1,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Father',
        labelType: 'related_label',
        user: [{
          userId: userId,
          labelOrder: 2,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Parent',
        labelType: 'related_label',
        user: [{
          userId: userId,
          labelOrder: 3,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Brother',
        labelType: 'related_label',
        user: [{
          userId: userId,
          labelOrder: 4,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Sister',
        labelType: 'related_label',
        user: [{
          userId: userId,
          labelOrder: 5,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Child',
        labelType: 'related_label',
        user: [{
          userId: userId,
          labelOrder: 6,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Friend',
        labelType: 'related_label',
        user: [{
          userId: userId,
          labelOrder: 7,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Spouse',
        labelType: 'related_label',
        user: [{
          userId: userId,
          labelOrder: 8,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Partner',
        labelType: 'related_label',
        user: [{
          userId: userId,
          labelOrder: 9,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Assistant',
        labelType: 'related_label',
        user: [{
          userId: userId,
          labelOrder: 10,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Manager',
        labelType: 'related_label',
        user: [{
          userId: userId,
          labelOrder: 11,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Other',
        labelType: 'related_label',
        user: [{
          userId: userId,
          labelOrder: 12,
          labelVisible: true,
        }],
        groupId: groupId,
      },

    //URL
      {
        labelName: 'Facebook',
        labelType: 'url_label',
        user: [{
          userId: userId,
          labelOrder: 1,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Twitter',
        labelType: 'url_label',
        user: [{
          userId: userId,
          labelOrder: 2,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Linkedin',
        labelType: 'url_label',
        user: [{
          userId: userId,
          labelOrder: 3,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Work',
        labelType: 'url_label',
        user: [{
          userId: userId,
          labelOrder: 4,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Home',
        labelType: 'url_label',
        user: [{
          userId: userId,
          labelOrder: 5,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Blog',
        labelType: 'url_label',
        user: [{
          userId: userId,
          labelOrder: 6,
          labelVisible: true,
        }],
        groupId: groupId,
      },
      {
        labelName: 'Other',
        labelType: 'url_label',
        user: [{
          userId: userId,
          labelOrder: 7,
          labelVisible: true,
        }],
        groupId: groupId,
      },

  ]

  for (var i = 0; i < labelProperties.length; i++) {
    Labels.insert(labelProperties[i]);
  }
};

function updateLabels(userId, groupId) {
  var addressLabels = Labels.find({groupId: groupId, labelType: 'address_label'}, {sort: {created_on: 1}});
  addressLabels.forEach(function(label, index) {
    var order = index + 1;
    var users = label.user
    users.push(
      {
        userId: userId,
        labelOrder: order,
        labelVisible: true,
      }
    )
    var properties = {
      labelName: label.labelName,
      labelType: label.labelType,
      user: users,
      groupId: label.groupId,
    }
    Labels.update(label._id, {$set: properties});
  });

  var conversationLabels = Labels.find({groupId: groupId, labelType: 'conversation_label'}, {sort: {created_on: 1}});
  conversationLabels.forEach(function(label, index) {
    var order = index + 1;
    var users = label.user
    users.push(
      {
        userId: userId,
        labelOrder: order,
        labelVisible: true,
      }
    )
    var properties = {
      labelName: label.labelName,
      labelType: label.labelType,
      user: users,
      groupId: label.groupId,
    }
    Labels.update(label._id, {$set: properties});
  });

  var dateLabels = Labels.find({groupId: groupId, labelType: 'date_label'}, {sort: {created_on: 1}});
  dateLabels.forEach(function(label, index) {
    var order = index + 1;
    var users = label.user
    users.push(
      {
        userId: userId,
        labelOrder: order,
        labelVisible: true,
      }
    )
    var properties = {
      labelName: label.labelName,
      labelType: label.labelType,
      user: users,
      groupId: label.groupId,
    }
    Labels.update(label._id, {$set: properties});
  });

  var emailLabels = Labels.find({groupId: groupId, labelType: 'email_label'}, {sort: {created_on: 1}});
  emailLabels.forEach(function(label, index) {
    var order = index + 1;
    var users = label.user
    users.push(
      {
        userId: userId,
        labelOrder: order,
        labelVisible: true,
      }
    )
    var properties = {
      labelName: label.labelName,
      labelType: label.labelType,
      user: users,
      groupId: label.groupId,
    }
    Labels.update(label._id, {$set: properties});
  });

  var immpLabels = Labels.find({groupId: groupId, labelType: 'immp_label'}, {sort: {created_on: 1}});
  immpLabels.forEach(function(label, index) {
    var order = index + 1;
    var users = label.user
    users.push(
      {
        userId: userId,
        labelOrder: order,
        labelVisible: true,
      }
    )
    var properties = {
      labelName: label.labelName,
      labelType: label.labelType,
      user: users,
      groupId: label.groupId,
    }
    Labels.update(label._id, {$set: properties});
  });

  var immpServiceLabels = Labels.find({groupId: groupId, labelType: 'immp_service_label'}, {sort: {created_on: 1}});
  immpServiceLabels.forEach(function(label, index) {
    var order = index + 1;
    var users = label.user
    users.push(
      {
        userId: userId,
        labelOrder: order,
        labelVisible: true,
      }
    )
    var properties = {
      labelName: label.labelName,
      labelType: label.labelType,
      user: users,
      groupId: label.groupId,
    }
    Labels.update(label._id, {$set: properties});
  });

  var phoneLabels = Labels.find({groupId: groupId, labelType: 'phone_label'}, {sort: {created_on: 1}});
  phoneLabels.forEach(function(label, index) {
    var order = index + 1;
    var users = label.user
    users.push(
      {
        userId: userId,
        labelOrder: order,
        labelVisible: true,
      }
    )
    var properties = {
      labelName: label.labelName,
      labelType: label.labelType,
      user: users,
      groupId: label.groupId,
    }
    Labels.update(label._id, {$set: properties});
  });

  var relatedLabels = Labels.find({groupId: groupId, labelType: 'related_label'}, {sort: {created_on: 1}});
  relatedLabels.forEach(function(label, index) {
    var order = index + 1;
    var users = label.user
    users.push(
      {
        userId: userId,
        labelOrder: order,
        labelVisible: true,
      }
    )
    var properties = {
      labelName: label.labelName,
      labelType: label.labelType,
      user: users,
      groupId: label.groupId,
    }
    Labels.update(label._id, {$set: properties});
  });

  var urlLabels = Labels.find({groupId: groupId, labelType: 'url_label'}, {sort: {created_on: 1}});
  urlLabels.forEach(function(label, index) {
    var order = index + 1;
    var users = label.user
    users.push(
      {
        userId: userId,
        labelOrder: order,
        labelVisible: true,
      }
    )
    var properties = {
      labelName: label.labelName,
      labelType: label.labelType,
      user: users,
      groupId: label.groupId,
    }
    Labels.update(label._id, {$set: properties});
  });

}
