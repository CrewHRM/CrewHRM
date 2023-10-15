<?php
/**
 * CLI tools for CrewHRM
 *
 * @package crewhrm
 */

namespace CrewHRM\Setup;

use CrewHRM\Main;
use WP_CLI;

/**
 * The class
 */
class CLI {
	/**
	 * Register commands in constructor
	 *
	 * @return void
	 */
	public function __construct() {
		if ( ! class_exists( 'WP_CLI' ) ) {
			return;
		}

		if ( 'development' === Main::$configs->mode ) {
			WP_CLI::add_command( 'crewhrm inspect', array( $this, 'inspect' ) );
		}
	}

	/**
	 * Custom function to inspect things. Not intended be used in production.
	 *
	 * ## EXAMPLES
	 *
	 * wp crewhrm inspect
	 *
	 * @param array $args Command arguments.
	 * @param array $assoc_args Command associative arguments.
	 */
	public function inspect( $args, $assoc_args ) {
		exit;
	}
}
