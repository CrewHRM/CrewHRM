<?php

namespace CrewHRM\Setup;

use CrewHRM\Main;
use CrewHRM\Models\DB;
use WP_CLI;

class CLI {
	public function __construct() {
		if ( ! class_exists( 'WP_CLI' ) ) {
			return;
		}

		if ( Main::$configs->mode === 'development' ) {
			WP_CLI::add_command('crewhrm inspect', array( $this, 'inspect' ) );
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
		echo 'Nothing to inspect';
		exit;
	}
}