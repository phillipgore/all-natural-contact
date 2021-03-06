Router.route('support', {
	path: '/support',
	template: 'support',
	layoutTemplate: 'supportLayout',
  yieldTemplates: {
		'supportList':{to: 'sidebar_content'},
		'supportWelcome':{to: 'main_content'},
	},
	waitOn: function() { return [
		Meteor.subscribe('supportCount'),
		Meteor.subscribe('supportTitles')
	]},
	onAfterAction: function () {
		Session.set('currentPermaSection', 'welcome');
		return SEO.set({
      title: 'All Natural Contact: Support',
      meta: {
        description: 'Welcome'
      }
    });
	}
});

Router.route('supportSection', {
	path: '/support/section/:permalink',
	layoutTemplate: 'supportLayout',
	yieldTemplates: {
		'supportList':{to: 'sidebar_content'},
		'supportSection':{to: 'main_content'},
	},
	waitOn: function() { return [
		Meteor.subscribe('supportCount'),
		Meteor.subscribe('supportTitles'),
		Meteor.subscribe('supportPermaSection', this.params.permalink)
	]},
	onBeforeAction: function () {
		Session.set('currentPermaSection', this.params.permalink);
		this.next();
	},
	onAfterAction: function() {
		SEO.set({
			title: '****'
		});
		var perma = this.params.permalink
		var checkMeta = setInterval(function() {
			if (Support.find().count() > 0) {
				clearInterval(checkMeta);
				var section = Support.findOne({section_perma_link: perma})
				SEO.set({
		      title: 'All Natural Contact: Support: ' + section.section_meta_title,
		      meta: {
		        description: section.section_meta_description
		      }
		    });
			}
		}, 300);
	}
});

Router.route('supportSearch', {
	path: '/support/search/:supportSearchText',
	layoutTemplate: 'supportLayout',
	yieldTemplates: {
		'supportSearchListItem':{to: 'sidebar_content'},
		'supportSearch':{to: 'main_content'},
	},
	waitOn: function() {
		// if (Session.get('startUp')) {
		// 	this.router.go('/support');
		// }
		Meteor.subscribe('supportSearch', this.params.supportSearchText);
	},
	onAfterAction: function() {
		Session.set('supportSearchText', this.params.supportSearchText)
		return SEO.set({
      title: 'All Natural Contact: Support: Search',
      meta: {
        description: 'Support Search'
      }
    });
	}
});
