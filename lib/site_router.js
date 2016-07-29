Router.route('home', {
	path: '/',
	template: 'home',
	layoutTemplate: 'index',
	onAfterAction: function() {
		return SEO.set({
      title: 'All Natural Contact: Welcome',
      meta: {
        description: 'Home'
      }
    });
	}
});

Router.route('pricing', {
	path: '/pricing',
	template: 'pricing',
	layoutTemplate: 'index',
	onAfterAction: function() {
		return SEO.set({
      title: 'All Natural Contact: Pricing',
      meta: {
        description: 'Pricing'
      }
    });
	}
});

Router.route('contact', {
	path: '/contact',
	template: 'contact',
	layoutTemplate: 'index',
	onAfterAction: function() {
		return SEO.set({
      title: 'All Natural Contact: Contact',
      meta: {
        description: 'Contact'
      }
    });
	}
});

Router.route('facebook', {
	path: '/facebook',
	template: 'facebook',
	layoutTemplate: 'index',
	onAfterAction: function() {
		return SEO.set({
      title: 'All Natural Contact: Facebook',
      meta: {
        description: 'Facebook'
      }
    });
	}
});

Router.route('twitter', {
	path: '/twitter',
	template: 'twitter',
	layoutTemplate: 'index',
	onAfterAction: function() {
		return SEO.set({
      title: 'All Natural Contact: Twitter',
      meta: {
        description: 'Twitter'
      }
    });
	}
});

Router.route('linkedin', {
	path: '/linkedin',
	template: 'linkedin',
	layoutTemplate: 'index',
	onAfterAction: function() {
		return SEO.set({
      title: 'All Natural Contact: Linkedin',
      meta: {
        description: 'Linkedin'
      }
    });
	}
});
