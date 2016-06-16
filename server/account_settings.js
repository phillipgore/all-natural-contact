import ElasticSearch from 'elasticsearch';

EsClient = new ElasticSearch.Client({
  host: Meteor.settings.private.esUrl,
});

Accounts.config ({
	loginExpirationInDays: 9999,
	sendVerificationEmail: true,
});

Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://keynotestore.com:Vandalia6578@smtp.sendgrid.net:587';
  var email = Meteor.users.find({"emails.0.address": "anc_admin@icloud.com"}).fetch()
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
      email: 'anc_admin@icloud.com',
      password: '6578ayanal6578',
      profile: profile,
      role: role,
      fields: fields
    })

    Accounts.sendVerificationEmail(userId, 'anc_admin@icloud.com');
  }

  var controls = Controls.findOne()
  if (!controls) {
    Controls.insert({freeTrial: 30, bugReporting: true, publicBeta: true})
  }
});

Accounts.emailTemplates = {
	from: 'All Natural Contact <phillipagore@me.com>',
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
  } else {

    var user_array = []
    user_array.push(user._id)
    var groupProperties = {
      _id: options.group.group_id,
      name: options.group.group_name,
      has_users: user_array,
    }
    Meteor.call('groupInsert', groupProperties);
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
