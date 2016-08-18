(function() {

	var scrollDelay = 1000;

	$(document).ready(function() {
		updateTopBar();
		$(document).scroll(function() {
			updateTopBar()
		});

		$('a[href*="#"]:not([href="#"])').click(function() {
			if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
				if (target.length) {
					scrollTo(target.offset().top);
					return false;
				}
			}
		});

		$('#go-to-top').click(function(event) {
			event.preventDefault();
			scrollTo(0);
		});
	});

	function scrollTo(top) {
		$('html, body').animate({
			scrollTop: top
		}, scrollDelay);
	}

	function updateTopBar() {
		var y = $(this).scrollTop();
		if (y > 693) {
			$('#topbar').removeClass('hidden');
		} else {
			$('#topbar').addClass('hidden');
		}
	}
})();
