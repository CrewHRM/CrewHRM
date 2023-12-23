<?php
/**
 * Static built scripts provider
 *
 * @package crewhrm
 */

namespace CrewHRM\Addon\Recaptcha\Setup;

use CrewHRM\Helpers\Utilities;
use CrewHRM\Addon\Recaptcha\Main;

/**
 * Script handler class
 */
class Scripts {

	/**
	 * Script handler constructor
	 */
	public function __construct() {
		// Register scripts
		add_action( 'wp_enqueue_scripts', array( $this, 'frontendScripts' ), 10 );
	}

	/**
	 * Load scripts for frontend view
	 *
	 * @return void
	 */
	public function frontendScripts() {
		if ( Utilities::isCareersPage() ) {
			wp_enqueue_script( 'crewhrm-recapcha-careers', Main::$configs->dist_url . 'application-page.js', array( 'jquery', 'wp-i18n' ), Main::$configs->version, true );
		}
	}
}
