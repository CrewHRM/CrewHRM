document.addEventListener('DOMContentLoaded', () => {
    function aosInit() {
        AOS.init({
            duration: 600,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
    window.addEventListener('load', aosInit);
});

window.jQuery(document).ready(function($){
	$('#video-player-icon').on(
		'click',
		function() {
			$(this).parent().prepend().replaceWith(
				`<iframe width="100%" height="100%" src="https://www.youtube.com/embed/FrDwzjwodwk?si=JnFvtD-mhL3awCIQ&amp;autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
			);
			
			$(this).remove();
		}
	);

	$('#subscribe-button').on(
		'click',
		function(e) {
			
			e.preventDefault();
			
			const btn   = $(this);
			const name  = ($('#name').val() || '').trim();
			const email = $('#email').val() || '';

			if( ! name ) {
				alert('Please enter your name');
				return;
			}

			if ( ! /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email) ) {
				alert('Please enter valid email address');
				return;
			}

			btn.prop("disabled", true);

			$.ajax({
				url: window.crew_data.subscriber_host,
				method: 'POST',
				data: {
					action: 'subscribeToNewsLetter',
					name: name,
					email: email
				},
				success: function(resp) {
					$('#subscribe-form').replaceWith(`
						<div 
							style="color: #00d600;
							margin-top: 60px;
							text-align: center;
							font-weight: 500;"
						>
							Thank You!
						</div>
					`);
				},
				error: function() {
					alert('Something went wrong!');
					btn.prop("disabled", false);
				}
			});
		}
	);
});
