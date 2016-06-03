Template.siteHeader.onRendered(function() {
	$(window).resize(function() {
		if ($(window).width() > 768) {
			$('.js_nav_drop').removeAttr('style');
			$('.js_menu_btn').removeClass('open');
		}
	});
});

Template.siteHeader.events({
	'click .js_menu_btn': function(e) {
		e.preventDefault();
		$('.js_nav_drop').slideToggle('fast');
    $('.js_menu_btn').toggleClass('open');
	},

	'click .js_support': function(e) {
		e.preventDefault();

		if ($(window).width() < 768) {
			$('.js_nav_drop').slideToggle('fast');
			$('.js_menu_btn').toggleClass('open');
		}

		if ($(e.target).hasClass('txt_nav')) {
			var href = $(e.target).parent().attr('href')
		} else {
			var href = $(e.target).attr('href')
		}
		window.open(href, '_blank');
	},

	'click .js_nav_item': function(e) {
		e.preventDefault();
		$('.js_nav_drop').slideToggle('fast');
		$('.js_menu_btn').toggleClass('open');

		if (!$(e.target).hasClass('js_support')) {
			var goTo = $(e.target).attr('href');

			if (!goTo) {
				var goTo = $(e.target).parentsUntil('li').attr('href');
			}

			Router.go(goTo);
		}
	},

	'click .js_sign_out': function(e) {
		e.preventDefault()
		Meteor.logout();
	},
});
