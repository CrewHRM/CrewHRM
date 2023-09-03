<?php

namespace CrewHRM;

use CrewHRM\Setup\Admin;
use CrewHRM\Setup\Careers;
use CrewHRM\Setup\Dispatcher;
use CrewHRM\Setup\Scripts;

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

		// Loading Autoloader
		spl_autoload_register( array( $this, 'loader' ) );

		// Load apps now
		new Scripts();
		new Dispatcher();
		new Admin();
		new Careers();
	}

	/**
	 * Autload classes
	 *
	 * @param string $className
	 * @return void
	 */
	public function loader( $className ) {
		if ( class_exists( $className ) ) {
			return;
		}

		$className = preg_replace(
			array( '/([a-z])([A-Z])/', '/\\\/' ),
			array( '$1$2', DIRECTORY_SEPARATOR ),
			$className
		);

		$className = str_replace( 'CrewHRM' . DIRECTORY_SEPARATOR, 'classes' . DIRECTORY_SEPARATOR, $className );
		$file_name = self::$configs->dir . $className . '.php';

		if ( file_exists( $file_name ) ) {
			require_once $file_name;
		}
	}
}
