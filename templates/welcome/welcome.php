<?php

	use CrewHRM\Helpers\Utilities;
	use CrewHRM\Main;

if ( ! defined( 'ABSPATH' ) ) { exit;
}

?><!DOCTYPE html>
<html lang="en">
	<head>
		<title><?php esc_html_e( 'Welcome to CrewHRM', 'crewhrm' ); ?></title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<style>
			@import url("https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css");
			@import url("https://fonts.googleapis.com/css?family=Figtree:400,500,700,600");
		</style>

		<script data-nowprocket>
			window.crew_data = {
				subscriber_host: "<?php echo 'development' === Main::$configs->mode ? 'http://localhost:10028' : 'https://getcrewhrm.com'; ?>/wp-admin/admin-ajax.php"
			}
		</script>

		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"/>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" />
		<link rel="stylesheet" href="<?php echo esc_url( Main::$configs->url ); ?>templates/welcome/css/style.css"/>
	</head>
	<body>
		<div class="wrapper">
			<header>
				<div class="container p-0 text-white">
					<!-- Navigation Bar -->
					<nav class="navbar navbar-expand-lg justify-content-between pb-lg-0 navbar-dark">
						<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
							<span class="navbar-toggler-icon"></span>
						</button>
						<div class="upgrade-list w-50 d-lg-none d-inline-flex align-items-center justify-content-center">
							<a href="https://getcrewhrm.com/" target="_blank" class="nav-link">
								<?php esc_html_e( 'Upgrade to Pro', 'crewhrm' ); ?>
							</a>
						</div>
						<a class="navbar-brand" href="<?php echo esc_sql( Utilities::getBackendPermalink( 'crewhrm' ) ); ?>">
							<img src="<?php echo esc_url( Main::$configs->url ); ?>templates/welcome/img/logo.svg" width="115" alt="Logo">
						</a>
						<div class="collapse navbar-collapse" id="navbarToggler">
							<ul class="navbar-nav mx-md-auto mr-auto mt-2 mt-lg-0">
								<li class="nav-item active">
									<a class="nav-link" href="#">
										<?php esc_html_e( 'Welcome', 'crewhrm' ); ?>
									</a>
								</li>
								<li class="nav-item">
									<a class="nav-link" target="_blank" href="<?php echo esc_url( Utilities::getBackendPermalink( 'crewhrm-settings#/settings/recruitment/careers/' ) ); ?>">
										<?php esc_html_e( 'Settings', 'crewhrm' ); ?>
									</a>
								</li>
								<li class="nav-item">
									<a class="nav-link" target="_blank" href="https://getcrewhrm.com/docs">
										<?php esc_html_e( 'Knowledge Base', 'crewhrm' ); ?>
									</a>
								</li>
								<li class="nav-item">
									<a class="nav-link" target="_blank" href="https://getcrewhrm.com/pricing">
										<?php esc_html_e( 'Pricing', 'crewhrm' ); ?>
									</a>
								</li>
							</ul>
						</div>
						<div class="upgrade-list d-lg-flex d-none">
							<a href="https://getcrewhrm.com/" target="_blank" class="nav-link">
								<?php esc_html_e( 'Upgrade to Pro', 'crewhrm' ); ?>
							</a>
						</div>
					</nav>
				</div>
			</header>

			<main class="container">
				<section class="welcome-secn">
					<div class="row align-items-center">
						<div class="col-md-6"  data-aos="fade-up" data-aos-delay="4s">
							<h1 class="heading-color main-title">
								<?php echo sprintf( esc_html__( 'WELCOME TO %s CREW HRM', 'crewhrm' ), '<br/>' ); ?>
							</h1>
						</div>

						<div class="col-md-6" data-aos="fade-up" data-aos-delay="5s">
							<p class="astra-is-fast-fully">
								Astra is fast, fully customizable &amp; beautiful WordPress theme
								suitable for blog, personal portfolio, business website and WooCommerce storefront.
							</p>
							<a href="<?php echo esc_sql( Utilities::getBackendPermalink( 'crewhrm' ) ); ?>" class="white-link">
								<?php esc_html_e( 'Go To Dashboard', 'crewhrm' ); ?>
							</a>
						</div>
					</div>
				</section>

				<section class="cards_group">
					<div class="row justify-content-center cols-container">
						<div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
							<div class="card">
								<!-- Card Body -->
								<div class="card-body">
									<h5 class="card-title">
										<?php esc_html_e( 'Subscribe', 'crewhrm' ); ?>
									</h5>
									<p class="card-text">
										<?php esc_html_e( 'Get notified about security updates and Tips & Tricks', 'crewhrm' ); ?>
									</p>
									<form class="subscribe-form" id="subscribe-form" action="#" method="post">
										<div class="form-group">
											<input class="form-control" type="text" id="name" name="name" placeholder="Your name" required>
										</div>
										<div class="form-group">
											<input class="form-control" type="email" id="email" name="email" placeholder="Email Address" required>
										</div>
										<div class="form-group mb-0">
											<button type="submit" class="btn" id="subscribe-button">
												<?php esc_html_e( 'Subscribe Now', 'crewhrm' ); ?>
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
						<div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="500">
							<div class="card" style="display: flex; flex-flow: column; justify-content: space-between;">
								<div class="card-body">
									<h5 class="card-title">
										<?php esc_html_e( 'Overview', 'crewhrm' ); ?>
									</h5>
									<p class="card-text">
										<?php esc_html_e( 'Watch the Quick starting guide', 'crewhrm' ); ?>
									</p>
								</div>
								<div class="video-container" style="background-image: url(<?php echo esc_url( Main::$configs->url ); ?>templates/welcome/img/video-thumbnail.png);">
									<div class="video-icon" id="video-player-icon">
										<img src="<?php echo esc_url( Main::$configs->url ); ?>templates/welcome/img/video-icon.svg" width="50" alt="video0-icon" />
									</div> <!-- Using Unicode Play symbol -->
								</div>
							</div>
						</div>
						<div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="600">
							<div class="card">
								<!-- Card Body -->
								<div class="card-body">
									<h5 class="card-title">Community</h5>
									<p class="card-text">Join our social platform</p>
									<a href="https://www.facebook.com/groups/crewhrm" target="_blank" class="plain-a">
										<button class="facebook-btn">
											<i class="fa-brands fa-facebook"></i> <?php esc_html_e( 'Join Our Facebook Group', 'crewhrm' ); ?>
										</button>
									</a>
								</div>
								<div class="social-buttons-container">
									<a class="facebook-col w-50 plain-a" href="https://www.facebook.com/crewhrm" target="_blank">
										<i class="fa-brands fa-facebook-f"></i>
									</a>

									<a class="twitter-col w-50 plain-a" href="https://twitter.com/crewhrm" target="_blank">
										<i class="fa-brands fa-x-twitter"></i>
									</a>

									<a class="linkedin-col w-100 plain-a" href="https://www.linkedin.com/company/crewhrm/" target="_blank">
										<i class="fa-brands fa-linkedin-in"></i>
									</a>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
		<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>		<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-Fy6S3B9q64WdZWQUiU+q4/2Lc9npb8tCaSX9FK7E8HnRr0Jz8D6OP9dO5Vg3Q9ct" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
		<script src="<?php echo esc_url( Main::$configs->url ); ?>templates/welcome/js/custom-script.js"></script>
	</body>
</html>
