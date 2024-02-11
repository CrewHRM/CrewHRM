<?php
/**
 * The app initiator class
 *
 * @package crewhrm
 */

namespace CrewHRM;

use CrewHRM\Helpers\_Array;
use CrewHRM\Setup\Addon;
use CrewHRM\Setup\Admin;
use CrewHRM\Setup\Blocks;
use CrewHRM\Setup\Careers;
use CrewHRM\Setup\CLI;
use CrewHRM\Setup\Database;
use CrewHRM\Setup\Dispatcher;
use CrewHRM\Setup\Employee;
use CrewHRM\Setup\Mails;
use CrewHRM\Setup\Media;
use CrewHRM\Setup\Scripts;
use CrewHRM\Setup\Shortcode;
use CrewHRM\Setup\Welcome;

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
		self::$configs              = $configs;
		self::$configs->dir         = dirname( $configs->file ) . '/';
		self::$configs->basename    = plugin_basename( $configs->file );
		self::$configs->has_pro     = false;
		self::$configs->current_url = ( is_ssl() ? 'https' : 'http' ) . '://' . sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ?? '' ) ) . sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ?? '' ) );

		// Loading Autoloader
		spl_autoload_register( array( $this, 'loader' ) );

		// Store configs in runtime static property
		$manifest      = _Array::getManifestArray( $configs->file, ARRAY_A );
		self::$configs = (object) array_merge( $manifest, (array) self::$configs );

		// Register Activation/Deactivation Hook
		register_activation_hook( self::$configs->file, array( $this, 'activate' ) );
		register_deactivation_hook( self::$configs->file, array( $this, 'deactivate' ) );

		// Load apps
		new Database();
		new CLI();
		new Addon();
		new Welcome();
		new Scripts();
		new Media();
		new Dispatcher();
		new Admin();
		new Careers();
		new Mails();
		new Blocks();
		new Shortcode();
		new Employee();

		// Set pro flag
		add_action(
			'crewhrm_pro_loaded',
			function() {
				self::$configs->has_pro = true;
			}
		);
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

		$class_path = preg_replace(
			array( '/([a-z])([A-Z])/', '/\\\/' ),
			array( '$1$2', '/' ),
			$class_name
		);

		if ( strpos( $class_path, 'CrewHRM/Addon/' ) === 0 ) {

			// Pro addon
			$addon_name = explode( '/', $class_path )[2];
			$class_path = str_replace( 'CrewHRM/Addon/' . $addon_name . '/', '', $class_path );
			$rel_path   = 'addons/' . $addon_name . '/classes/' . $class_path . '.php';

		} elseif ( strpos( $class_path, 'CrewHRM/' ) === 0 ) {
			// Pro core
			$rel_path = str_replace( 'CrewHRM/', 'classes/', $class_path ) . '.php';

		} else {
			// No CrewHRM class
			return;
		}

		$file_path = self::$configs->dir . $rel_path;
		$file_path = str_replace( '/', DIRECTORY_SEPARATOR, preg_replace( '#[\\\\/]+#', '/', $file_path ) );

		if ( file_exists( $file_path ) ) {
			require_once $file_path;
		}
	}

	/**
	 * Execute activation hook
	 *
	 * @return void
	 */
	public function activate() {
		do_action( 'crewhrm_activated' );
	}

	/**
	 * Execute deactivation hook
	 *
	 * @return void
	 */
	public function deactivate() {
		do_action( 'crewhrm_deactivated' );
	}
}
