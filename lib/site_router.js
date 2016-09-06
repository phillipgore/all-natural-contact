Router.route('home', {
	path: '/',
	template: 'home',
	layoutTemplate: 'index',
	onAfterAction: function() {
		return SEO.set({
      title: 'All Natural Contact: The naturally intuative CRM',
      meta: {
        description: 'A CRM featureing reminder tags that create instant contact follow-up lists, a log to track client interactions, and powerful search to find customers.'
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
      title: 'All Natural Contact: One simple plan. One simple price.',
      meta: {
        description: 'Keeping up with customers is as simple and straighforward as our picing.'
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
      title: 'All Natural Contact: Contact us about keeping up with your clients.',
      meta: {
        description: 'Need some help keeping up with your customers? Send your quesiton to, help@allnaturalcontact.com. Have a suggestion? Drop us a line, feedback@allnaturalcontact.com.'
      }
    });
	}
});

// Router.route('facebook', {
// 	path: '/facebook',
// 	template: 'facebook',
// 	layoutTemplate: 'index',
// 	onAfterAction: function() {
// 		return SEO.set({
//       title: 'All Natural Contact: Facebook',
//       meta: {
//         description: 'Facebook'
//       }
//     });
// 	}
// });
//
// Router.route('twitter', {
// 	path: '/twitter',
// 	template: 'twitter',
// 	layoutTemplate: 'index',
// 	onAfterAction: function() {
// 		return SEO.set({
//       title: 'All Natural Contact: Twitter',
//       meta: {
//         description: 'Twitter'
//       }
//     });
// 	}
// });
//
// Router.route('linkedin', {
// 	path: '/linkedin',
// 	template: 'linkedin',
// 	layoutTemplate: 'index',
// 	onAfterAction: function() {
// 		return SEO.set({
//       title: 'All Natural Contact: Linkedin',
//       meta: {
//         description: 'Linkedin'
//       }
//     });
// 	}
// });
