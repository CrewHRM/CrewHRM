<?php
	/**
	 * The main email wrapper
	 *
	 * @package crewhrm
	 */

use CrewHRM\Models\Settings;

if ( ! defined( 'ABSPATH' ) ) { exit;
}

$social_links = Settings::getSocialLinks();

?><!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
	</head>
	<body style="background: #F3F4F5;
		padding: 50px 20px; 
		font-family: 'Plus Jakarta Sans', Arial, sans-serif;
		box-sizing:border-box;"
	>
		<div style="display: block;
			background: white;
			max-width: 600px;
			margin: 0 auto;
			border-radius: 4px;
			padding: 40px;
			box-sizing:border-box;"
		>
			<div>{contents}</div>

			<?php if ( ! empty( $social_links ) ) : ?>
			
			<?php endif; ?>
		</div>
	</body>
</html>
