<?php

namespace CrewHRM;

use CrewHRM\Setup\Admin;
use CrewHRM\Setup\Scripts;
use CrewHRM\Setup\Shortcode;

class Main {
	/**
	 * Configs array
	 *
	 * @var object
	 */
	public static $configs;

	/**
	 * Initialize Plugin
	 * 
	 * @param object $configs
	 * 
	 * @return void
	 */
	public function init( object $configs ) {

		// Store configs in runtime static property
		self::$configs = $configs;

		new Scripts();
		new Admin();
		new Shortcode();
	}
}
