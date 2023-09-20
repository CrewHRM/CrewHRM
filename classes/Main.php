<?php

namespace CrewHRM;

use CrewHRM\Setup\Admin;
use CrewHRM\Setup\Careers;
use CrewHRM\Setup\CLI;
use CrewHRM\Setup\Database;
use CrewHRM\Setup\Dispatcher;
use CrewHRM\Setup\Media;
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

		// Register Activation/Deactivation Hook
		register_activation_hook( self::$configs->file, array( $this, 'activate' ) );
		register_deactivation_hook( self::$configs->file, array( $this, 'deactivate' ) );

		// Core
		new Database();
		new CLI();

		// Load apps now
		new Scripts();
		new Media();
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

	/**
	 * Execute activation hook
	 *
	 * @return void
	 */
	public static function activate() {
		do_action( 'crewhrm_activated' );
	}

	/**
	 * Execute deactivation hook
	 *
	 * @return void
	 */
	public static function deactivate() {
		do_action( 'crewhrm_deactivated' );
	}
}
