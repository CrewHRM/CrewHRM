<?php
/**
 * Addon hooks setup
 *
 * @package crewhrm
 */

namespace CrewHRM\Setup;

use CrewHRM\Helpers\_Array;
use CrewHRM\Main;
use CrewHRM\Models\AddonManager;
use CrewHRM\Models\User;

/**
 * Addon registry class
 */
class Addon {
	/**
	 * Addons admin dashboard page slug
	 */
	const PAGE_SLUG = 'crewhrm-addons';

	/**
	 * Addons list
	 *
	 * @var array
	 */
	private static $addons = array();

	/**
	 * Addon registrar contructore
	 */
	public function __construct() {
		// Load internal addons
		self::loadAddons();

		// Register page to show addons list
		add_action( 'admin_menu', array( $this, 'registerAddonsPage' ), 11 );
	}

	/**
	 * Include addons index file, so they can request to load themselves from their own.
	 * They are not supposed to be initiated directly from here, because some add on might be external some may be disabled.
	 * We can indentify the disable state only for internal if we load them directly here.
	 * But external ones as plugins is out of control until they request to load.
	 * So both external and internal should go in a syncronized flow.
	 *
	 * @param string|null $addons_dir The addons directory to load addons from. Default will be from free version.
	 *
	 * @return void
	 */
	public static function loadAddons( $addons_dir = null ) {
		// Null means it is requested to load addons bundled in free itself
		$addons_dir = $addons_dir ? $addons_dir : Main::$configs->dir . 'addons' . DIRECTORY_SEPARATOR;
		$addons     = array_filter( glob( $addons_dir . '*' ), 'is_dir' );

		// Loop through add
		foreach ( $addons as $value ) {
			$addon_dir_name = str_replace( dirname( $value ) . DIRECTORY_SEPARATOR, '', $value );
			$file_name      = $addons_dir . $addon_dir_name . DIRECTORY_SEPARATOR . 'index.php';

			if ( file_exists( $file_name ) ) {
				include_once $file_name;
			}
		}
	}

	/**
	 * Load individual addons upon request
	 *
	 * @param string   $index_path The index file path of the addon
	 * @param callable $callback   The initiator callback to call if addon is enabled
	 *
	 * @return void
	 */
	public static function initAddon( string $index_path, callable $callback ) {

		// Enable states settings
		$addon_states = AddonManager::getAddonsStates();

		// Parse individual addon configs
		$configs                              = _Array::getManifestArray( $index_path );
		$configs->thumbnail_url               = $configs->url . 'thumbnail.png';
		self::$addons[ $configs->crewhrm_id ] = $configs;

		// Call addon initiator if it is enabled or must use one.
		$enabled      = $addon_states[ $configs->crewhrm_id ] ?? false;
		$uncontrolled = ! $configs->crewhrm_controlled; // Must use if not controlled. And it will not appear in addons page.
		if ( $uncontrolled || ( ! $uncontrolled && $enabled ) ) {
			$callback( $configs );
		}
	}

	/**
	 * Register a page for addons
	 *
	 * @return void
	 */
	public function registerAddonsPage() {

		// Setting page
		add_submenu_page(
			Main::$configs->app_name,
			esc_html__( 'Addons', 'hr-management' ),
			esc_html__( 'Addons', 'hr-management' ),
			User::getAdminMenuRole( get_current_user_id() ),
			self::PAGE_SLUG,
			array( $this, 'addOnPage' )
		);
	}

	/**
	 * Get pro addons list to promote when pro is not active
	 *
	 * @return array
	 */
	private function getProAddons() {
		$json_path = Main::$configs->dir . 'dist/libraries/pro/addons.json';
		$thumb_url = Main::$configs->url . 'dist/libraries/pro/thumbnails/';
		$addons    = file_exists( $json_path ) ? json_decode( file_get_contents( $json_path ), true ) : array();
		$addons    = _Array::appendColumn( $addons, 'locked', true );
		$addons    = _Array::indexify( $addons, 'crewhrm_id' );

		// Assign addon thumbnail urls
		foreach ( $addons as $id => $addon ) {
			$addons[ $id ]['thumbnail_url'] = $thumb_url . $id . '.png';
		}

		return apply_filters( 'crewhrm_pro_locked_addons', $addons );
	}

	/**
	 * Contents for the addons page
	 */
	public function addOnPage() {
		// Remove sensitive data like file paths from the array
		$addons = self::$addons;
		foreach ( $addons as $index => $addon ) {
			unset( $addon->dir );
			unset( $addon->file );
			$addons[ $index ] = $addon;
		}

		// Include pro addon list too to show when pro is not installed
		$addons        = array_merge( $addons, $this->getProAddons() );
		$enable_states = (object) AddonManager::getAddonsStates();

		echo '<div 
				id="crewhrm_addons_page"
				data-addon-states="' . esc_attr( wp_json_encode( $enable_states ) ) . '"
				data-addons="' . esc_attr( wp_json_encode( $addons ) ) . '"></div>';
	}
}
