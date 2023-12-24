<?php

namespace CrewHRM\Addon\Recaptcha\Setup;

use CrewHRM\Addon\Recaptcha\Controllers\Credential;

class Dispatcher {
	public function __construct() {
		add_filter( 'crewhrm_controllers', array( $this, 'addControllers' ) );
	}

	/**
	 * Register ajax request handler controllers.
	 *
	 * @param array $controllers
	 * @return void
	 */
	public function addControllers( array $controllers ) {
		$pro_controllers = array(
			Credential::class
		);

		return array_merge( $controllers, $pro_controllers );
	}
}
