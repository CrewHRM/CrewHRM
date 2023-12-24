<?php
/**
 * Google reCAPTCHA addon
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

	public static $configs;
	private $index_file;

	public function init( string $file ) {
		$this->index_file = $file;
		add_action( 'crewhrm_loaded', array( $this, 'loadSelf' ) );
	}

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
