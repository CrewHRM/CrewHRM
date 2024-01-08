<?php
/**
 * reCaptcha integration addon
 *
 * @package crewhrm
 */

namespace CrewHRM\Addon\Recaptcha;

use CrewHRM\Addon\Recaptcha\Setup\Dispatcher;
use CrewHRM\Addon\Recaptcha\Setup\Scripts;
use CrewHRM\Addon\Recaptcha\Setup\Verify;
use CrewHRM\Setup\Addon;

/**
 * Initiator class
 */
class Main {

	/**
	 * Addon configuration
	 *
	 * @var object
	 */
	public static $configs;

	/**
	 * The addon main index file
	 *
	 * @var string
	 */
	private $index_file;

	/**
	 * Initialize recpatcha addon
	 *
	 * @param string $file The main file
	 * @return void
	 */
	public function init( string $file ) {
		$this->index_file = $file;
		add_action( 'plugins_loaded', array( $this, 'loadSelf' ) );
	}

	/**
	 * Load addon using helper wrapper
	 *
	 * @return void
	 */
	public function loadSelf() {
		Addon::initAddon(
			$this->index_file,
			function( object $configs ) {
				self::$configs = $configs;

				// Load recapcha addon objects
				new Scripts();
				new Dispatcher();
				new Verify();
			}
		);
	}
}
