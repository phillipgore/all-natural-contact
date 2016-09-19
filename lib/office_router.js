Router.route('officeStats', {
	path: '/office/stats',
	layoutTemplate: 'officeLayout',
	yieldTemplates: {
		'officeHeaderStats':{to: 'sidebar_header'},
		'officeStatsList':{to: 'sidebar_content'},
		'officeStats':{to: 'main_content'},
		'':{to: 'footer_content'}
	},
	waitOn: function() {
		return Meteor.subscribe('officeStats')
	},
	onAfterAction: function () {
		Session.set('currentSection', '');
	}
});

Router.route('officeControls', {
	path: '/office/controls',
	layoutTemplate: 'officeLayout',
	yieldTemplates: {
		'officeHeaderControls':{to: 'sidebar_header'},
		'officeControlsList':{to: 'sidebar_content'},
		'officeControls':{to: 'main_content'},
		'':{to: 'footer_content'}
	},
	waitOn: function() {
		return Meteor.subscribe('officeControls')
	},
	data: function() {
		return Controls.findOne();
	},
	onAfterAction: function () {
		Session.set('currentSection', '');
	}
});

Router.route('officeSupport', {
	path: '/office/support',
	layoutTemplate: 'officeLayout',
	yieldTemplates: {
		'officeHeaderSupport':{to: 'sidebar_header'},
		'officeSupportList':{to: 'sidebar_content'},
		'officeSupportNew':{to: 'main_content'},
		'officeFooterNewSupport':{to: 'footer_content'}
	},
	waitOn: function() {
		return Meteor.subscribe('supportTitles')
	},
	onAfterAction: function () {
		Session.set('currentSection', '');
	}
});

Router.route('updateSection', {
	path: '/office/update/:id',
	layoutTemplate: 'officeLayout',
	yieldTemplates: {
		'officeHeaderSupport':{to: 'sidebar_header'},
		'officeSupportList':{to: 'sidebar_content'},
		'officeSupportUpdate':{to: 'main_content'},
		'officeFooterUpdateSupport':{to: 'footer_content'}
	},
	waitOn: function() { return [
			Meteor.subscribe('supportCount'),
			Meteor.subscribe('supportTitles'),
			Meteor.subscribe('supportSection', this.params.id)
	]},
	onBeforeAction: function () {
		Session.set('currentSection', this.params.id);
		this.next();
	}
});

// Router.route('officeAccounts', {
// 	path: '/office/accounts',
// 	layoutTemplate: 'officeLayout',
// 	yieldTemplates: {
// 		'officeHeaderAccounts':{to: 'sidebar_header'},
// 		'officeAccountsList':{to: 'sidebar_content'},
// 		'officeAccounts':{to: 'main_content'},
// 		'':{to: 'footer_content'}
// 	},
// 	waitOn: function() {
// 		return Meteor.subscribe('allGroups')
// 	},
// 	onAfterAction: function () {
// 		Session.set('currentSection', '');
// 	}
// });
