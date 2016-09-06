Template.home.onRendered(function() {
	$('.js_startup_loader, .loader_overlay').hide();
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		var videoReady = 1
	} else {
		var videoReady = 4
	}

	var video = $('video')[0];

	var checkVideoStatus = setInterval(function() {
		var video = $('video')[0];

		if (video.readyState === videoReady) {
			clearInterval(checkVideoStatus);
			$('.zig_zag_video_container').addClass('ready');
			$('.zig_zag_poster').show();
		}
	}, 100);

	$(video).on('pause', function() {
		$('.zig_zag_video').removeClass('active')
	});

	$(video).on('ended', function() {
		video.currentTime = 0;
		$('.zig_zag_video').removeClass('active').attr('controls', false)
		$('.zig_zag_poster').show()
	});
});

Template.home.events({
	'click .zig_zag_poster': function(e) {
		e.preventDefault();
		var video = $('video')[0];
		video.play()
		$('.zig_zag_video').addClass('active').attr('controls', true)
		$('.zig_zag_poster').fadeOut()
	}
});
