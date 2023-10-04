<?php
/**
 * The app initiator class
 *
 * @package crewhrm
 */

namespace CrewHRM;

use CrewHRM\Helpers\_Array;
use CrewHRM\Setup\Admin;
use CrewHRM\Setup\Careers;
use CrewHRM\Setup\CLI;
use CrewHRM\Setup\Database;
use CrewHRM\Setup\Dispatcher;
use CrewHRM\Setup\Media;
use CrewHRM\Setup\Scripts;

/**
 * The main class to initiate app
 */
class Main {
	/**
	 * Configs array
	 *
	 * @var object
	 * @property string $plugin_name
	 * @property string $description
	 * @property string $version
	 * @property string $author
	 * @property string $file
	 * @property string $dir
	 * @property string $url
	 * @property string $dist_url
	 */
	public static $configs;

	/**
	 * Initialize Plugin
	 *
	 * @param object $configs Plugin configurations
	 *
	 * @return void
	 */
	public function init( object $configs ) {

		// Store configs in runtime static property
		self::$configs = $configs;

		// Loading Autoloader
		spl_autoload_register( array( $this, 'loader' ) );

		// Store configs in runtime static property
		$manifest = _Array::getManifestArray( $configs->dir . 'index.php', ARRAY_A );
		self::$configs = (object) array_merge( $manifest, (array) self::$configs );

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

		do_action( 'crewhrm_loaded' );
	}

	/**
	 * Autload classes
	 *
	 * @param string $class_name The class name to load file for
	 * @return void
	 */
	public function loader( $class_name ) {
		if ( class_exists( $class_name ) ) {
			return;
		}

		$class_name = preg_replace(
			array( '/([a-z])([A-Z])/', '/\\\/' ),
			array( '$1$2', '/' ),
			$class_name
		);

		if ( strpos( $class_name, 'CrewHRM/' ) === 0 ) {
			$class_name = str_replace( 'CrewHRM/', 'classes/', $class_name );
			$file_path  = self::$configs->dir . $class_name . '.php';
			$file_path  = str_replace( '/', DIRECTORY_SEPARATOR, preg_replace( '#[\\\\/]+#', '/', $file_path ) );

			if ( file_exists( $file_path ) ) {
				require_once $file_path;
			}
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
