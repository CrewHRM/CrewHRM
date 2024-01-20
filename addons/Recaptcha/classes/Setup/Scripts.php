<?php
/**
 * Static built scripts provider
 *
 * @package crewhrm
 */

namespace CrewHRM\Addon\Recaptcha\Setup;

use CrewHRM\Helpers\Utilities;
use CrewHRM\Addon\Recaptcha\Main;
use CrewHRM\Addon\Recaptcha\Models\Google;
use CrewHRM\Setup\Admin;

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
		add_action( 'admin_enqueue_scripts', array( $this, 'adminScripts' ), 10 );
	}

	/**
	 * Load scripts for frontend view
	 *
	 * @return void
	 */
	public function frontendScripts() {
		// Load the recaptcha component script if it careers page and configuration keys are set
		if ( Utilities::isCareersPage() && Google::isConfigured() ) {
			wp_enqueue_script( 'crewhrm-recapcha-careers', Main::$configs->dist_url . 'application-page.js', array( 'jquery', 'wp-i18n' ), Main::$configs->version, true );
		}
	}

	/**
	 * Admin dashboard scripts
	 *
	 * @return void
	 */
	public function adminScripts() {
		if ( Utilities::isCrewDashboard( Admin::SLUG_SETTINGS ) ) {
			wp_enqueue_script( 'crewhrm-recaptcha-settings', Main::$configs->dist_url . 'settings-page.js', array( 'jquery', 'wp-i18n' ), Main::$configs->version, true );
		}
	}
}
