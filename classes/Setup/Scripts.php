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
use CrewHRM\Models\Settings;
use CrewHRM\Models\Stage;

/**
 * Script handler class
 */
class Scripts {

	/**
	 * Script handler constructor
	 */
	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'adminScripts' ), 11 );
		add_action( 'wp_enqueue_scripts', array( $this, 'frontendScripts' ), 11 );

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
		if ( Utilities::isCrewDashboard() ) {
			if ( current_user_can( 'upload_files' ) ) {
				wp_enqueue_media();
			}
			wp_enqueue_script( 'crewhrm-hrm', Main::$configs->dist_url . 'hrm.js', array( 'jquery', 'wp-i18n' ), Main::$configs->version, true );
		}

		// Load scripts for setting and company profile
		if ( Utilities::isCrewDashboard( array( Admin::SLUG_SETTINGS ) ) ) {
			if ( current_user_can( 'upload_files' ) ) {
				wp_enqueue_media();
			}
			wp_enqueue_script( 'crewhrm-settings', Main::$configs->dist_url . 'settings.js', array( 'jquery', 'wp-i18n' ), Main::$configs->version, true );
		}
	}

	/**
	 * Load scripts for frontend view
	 *
	 * @return void
	 */
	public function frontendScripts() {
		if ( Utilities::isCareersPage() ) {
			wp_enqueue_script( 'crewhrm-careers', Main::$configs->dist_url . 'careers.js', array( 'jquery', 'wp-i18n' ), Main::$configs->version, true );
		}
	}

	/**
	 * Load js and css variables
	 *
	 * @return void
	 */
	public function loadVariables() {
		// Check if it's our page and needs resources to load
		if ( ! Utilities::isCrewDashboard() && ! Utilities::isCareersPage() ) {
			return;
		}

		// Load dynamic colors
		$dynamic_colors = Colors::getColors();
		$_colors        = '';
		foreach ( $dynamic_colors as $name => $code ) {
			$_colors .= '--crewhrm-color-' . esc_attr( $name ) . ':' . esc_attr( $code ) . ';';
		}
		echo '<style>:root{' . $_colors . '}</style>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

		// Prepare nonce
		$nonce_action = '_crewhrm_' . str_replace( '-', '_', date( 'Y-m-d' ) );
		$nonce        = wp_create_nonce( $nonce_action );

		// Load JS variables
		$data = apply_filters(
			'crewhrm_frontend_data',
			array(
				'app_name'                 => Main::$configs->app_name,
				'action_hooks'             => array(),
				'filter_hooks'             => array(),
				'home_url'                 => get_home_url(),
				'dist_url'                 => Main::$configs->dist_url,
				'plugin_url'               => Main::$configs->url,
				'ajaxurl'                  => admin_url( 'admin-ajax.php' ),
				'colors'                   => $dynamic_colors,
				'reserved_stages'          => Stage::$reserved_stages,
				'timeouts'                 => (object) array(),
				'nonce_action'             => $nonce_action,
				'nonce'                    => $nonce,
				'wp_max_size'              => Settings::getWpMaxUploadSize(),
				'application_max_size_mb'  => Settings::getApplicationMaxSize(),
				'application_file_formats' => Settings::getApplicationAttachmentFormats(),
				'date_format'              => get_option( 'date_format' ),
				'time_format'              => get_option( 'time_format' ),
				'timezone_offset'          => get_option( 'gmt_offset' ),
				'timezone_string'          => get_option( 'timezone_string' ),
			)
		);

		echo '<script>window.CrewHRM=' . wp_json_encode( $data ) . '</script>';
	}
}
