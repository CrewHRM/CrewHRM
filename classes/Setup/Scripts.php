<?php
/**
 * Static built scripts provider
 * 
 * @package crewhrm
 */

namespace CrewHRM\Setup;

use CrewHRM\Helpers\Colors;
use CrewHRM\Helpers\Utilities;
use CrewHRM\Main;

/**
 * Script handler class
 */
class Scripts extends Main {

	/**
	 * Script handler constructor
	 */
	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'adminScripts' ), 11 );
		add_action( 'careers_page_shortcode', array( $this, 'frontendScripts' ), 11 );

		// Color pallete
		add_action( 'wp_head', array( $this, 'loadVariables' ), 1000 );
		add_action( 'admin_head', array( $this, 'loadVariables' ), 1000 );
	}

	/**
	 * Load scripts in backend dashboard
	 *
	 * @return void
	 */
	public function adminScripts() {
		// Load script for the main hrm dashboard
		if ( Utilities::isCrewDashboard( self::$configs->root_menu_slug ) ) {
			if ( current_user_can( 'upload_files' ) ) {
				wp_enqueue_media();
			}
			wp_enqueue_script( 'crewhrm-hrm', self::$configs->dist_url . 'hrm.js', array( 'jquery', 'wp-i18n' ), self::$configs->version, true );
		}

		// Load scripts for setting and company profile
		if ( Utilities::isCrewDashboard( array( Admin::SLUG_SETTINGS, Admin::SLUG_COMPANY_PROFILE ) ) ) {
			if ( current_user_can( 'upload_files' ) ) {
				wp_enqueue_media();
			}
			wp_enqueue_script( 'crewhrm-settings', self::$configs->dist_url . 'settings.js', array( 'jquery', 'wp-i18n' ), self::$configs->version, true );
		}
	}

	/**
	 * Load scripts for frontend view
	 *
	 * @return void
	 */
	public function frontendScripts() {
		if ( ! is_admin() ) {
			wp_enqueue_script( 'crewhrm-careers', self::$configs->dist_url . 'careers.js', array( 'jquery', 'wp-i18n' ), self::$configs->version, true );
		}
	}

	/**
	 * Load js and css variables
	 *
	 * @return void
	 */
	public function loadVariables() {
		// Check if it's our page and needs resources to load
		if ( ! Utilities::isCrewDashboard() && ! ( is_singular() && strpos( get_the_content(), '[' . Shortcode::SHORTCODE ) !== false ) ) {
			return;
		}

		// Load dynamic colors
		$dynamic_colors = Colors::getColors();
		$_colors        = '';
		foreach ( $dynamic_colors as $name => $code ) {
			$_colors .= '--crewhrm-color-' . esc_attr( $name ) . ':' . esc_attr( $code ) . ';';
		}
		echo '<style>:root{' . $_colors . '}</style>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

		// Load JS variables
		$data = array(
			'app_name'     => self::$configs->app_name,
			'action_hooks' => array(),
			'filter_hooks' => array(),
			'home_url'     => get_home_url(),
			'dist_url'     => self::$configs->dist_url,
			'plugin_url'   => self::$configs->url,
			'ajaxurl'      => admin_url( 'admin-ajax.php' ),
			'colors'       => $dynamic_colors,
		);

		echo '<script>window.CrewHRM=' . wp_json_encode( $data ) . '</script>';
	}
}
