<?php
/**
 * Welcome page after plugin activation
 *
 * @package crewhrm
 */

namespace CrewHRM\Setup;

use CrewHRM\Main;

/**
 * The welcome class
 */
class Welcome {

	/**
	 * The identifier to show welcome screen once in a lifetime of a website.
	 */
	const FLAG_NAME = 'crewhrm-first-activated-time';

	/**
	 * The admin page slug to show welcome screen under
	 */
	const PAGE_SLUG = 'welcome-to-crewhrm';

	/**
	 * Register welcome page caller
	 */
	public function __construct() {
		add_action( 'activated_plugin', array( $this, 'showWelcome' ), 10, 2 );
		add_action( 'init', array( $this, 'welcomePage' ) );
	}

	/**
	 * Redirect to welcome page if this plugin has just been activated
	 *
	 * @return void
	 */
	public function showWelcome( $plugin, $network_wide = null ) {
		if ( Main::$configs->basename === $plugin && ! get_option( self::FLAG_NAME ) ) {
			update_option( self::FLAG_NAME, time() );
			wp_safe_redirect( admin_url( 'admin.php?page=' . self::PAGE_SLUG ) );
			exit;
		}
	}

	/**
	 * Show welcome page after plugin install
	 *
	 * @return void
	 */
	public function welcomePage() {
		if ( is_admin() && self::PAGE_SLUG === ( $_GET['page'] ?? '' ) ) {
			require Main::$configs->dir . 'templates/welcome/welcome.php';
			exit;
		}
	}
}
