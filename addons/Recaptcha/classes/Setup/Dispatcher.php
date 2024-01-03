<?php
/**
 * Recaptcha functionality dispatcher
 *
 * @package crewhrm
 */

namespace CrewHRM\Addon\Recaptcha\Setup;

use CrewHRM\Addon\Recaptcha\Controllers\Credential;

/**
 * The dispatcher class
 */
class Dispatcher {

	/**
	 * Dispatcher constructor
	 *
	 * @return void
	 */
	public function __construct() {
		add_filter( 'crewhrm_controllers', array( $this, 'addControllers' ) );
	}

	/**
	 * Register ajax request handler controllers.
	 *
	 * @param array $controllers The controllers registration
	 * @return array
	 */
	public function addControllers( array $controllers ) {
		$pro_controllers = array(
			Credential::class,
		);

		return array_merge( $controllers, $pro_controllers );
	}
}
