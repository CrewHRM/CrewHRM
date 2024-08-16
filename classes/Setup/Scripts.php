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
use CrewHRM\Models\Department;
use CrewHRM\Models\Job;
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
		// Register scripts
		add_action( 'admin_enqueue_scripts', array( $this, 'adminScripts' ), 11 );
		add_action( 'wp_enqueue_scripts', array( $this, 'frontendScripts' ), 11 );

		// Register script translations
		add_action( 'admin_enqueue_scripts', array( $this, 'scriptTranslation' ), 9 );
		add_action( 'wp_enqueue_scripts', array( $this, 'scriptTranslation' ), 9 );

		// Color pallete
		add_action( 'wp_head', array( $this, 'loadVariables' ), 1000 );
		add_action( 'admin_head', array( $this, 'loadVariables' ), 1000 );

		// Load text domain
		add_action( 'init', array( $this, 'loadTextDomain' ) );
	}

	/**
	 * Load scripts in backend dashboard
	 *
	 * @return void
	 */
	public function adminScripts() {

		$hrm_js_for = array(
			Main::$configs->app_name,
			Admin::PAGE_SLUG_CALENDAR,
			Admin::PAGE_SLUG_ALL_JOBS,
			Admin::PAGE_SLUG_EMPLOYEE,
		);

		// Load script for the main hrm dashboard
		if ( Utilities::isCrewDashboard( $hrm_js_for ) ) {
			if ( current_user_can( 'upload_files' ) ) {
				wp_enqueue_media();
			}
			wp_enqueue_script( 'crewhrm-hrm', Main::$configs->dist_url . 'hrm.js', array( 'jquery', 'wp-i18n' ), Main::$configs->version, true );
		}

		// Load scripts for setting
		if ( Utilities::isCrewDashboard( array( Admin::SLUG_SETTINGS ) ) ) {
			if ( current_user_can( 'upload_files' ) ) {
				wp_enqueue_media();
			}
			wp_enqueue_script( 'crewhrm-settings', Main::$configs->dist_url . 'settings.js', array( 'jquery', 'wp-i18n' ), Main::$configs->version, true );
		}

		// Load script for only addons page. For enable/disabling.
		if ( Utilities::isCrewDashboard( Addon::PAGE_SLUG ) ) {
			wp_enqueue_script( 'crewhrm-addons-script', Main::$configs->dist_url . 'addons-page.js', array( 'jquery', 'wp-i18n' ), Main::$configs->version, true );
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

		wp_enqueue_script( 'crewhrm-blocks-viewer', Main::$configs->dist_url . 'blocks-viewer.js', array( 'jquery', 'wp-i18n' ), Main::$configs->version, true );
	}

	/**
	 * Load script translations
	 *
	 * @return void
	 */
	public function scriptTranslation() {

		$domain = Main::$configs->text_domain;
		$dir    = Main::$configs->dir . 'languages/';

		wp_enqueue_script( 'crewhrm-translations', Main::$configs->dist_url . 'libraries/translation-loader.js', array( 'jquery' ), Main::$configs->version, true );
		wp_set_script_translations( 'crewhrm-translations', $domain, $dir );
	}

	/**
	 * Load js and css variables
	 *
	 * @return void
	 */
	public function loadVariables() {
		// Check if it's our page and needs resources to load
		if ( is_admin() && ! Utilities::isCrewDashboard() && ! Utilities::isGutenbergEditor() ) {
			return;
		}

		// Load dynamic colors
		$dynamic_colors = Colors::getColors();
		$_colors        = '';
		foreach ( $dynamic_colors as $name => $code ) {
			$_colors .= "--crewmat-color-{$name}:{$code};";
		}
		?>
		<style>
			[id^="crewhrm_"],[id^="crewhrm-"],[data-cylector="root"]{
				<?php echo esc_html( $_colors ); ?>
			}
		</style>
		<?php

		// Prepare nonce
		$nonce_action = '_crewhrm_' . str_replace( '-', '_', gmdate( 'Y-m-d' ) );
		$nonce        = wp_create_nonce( $nonce_action );

		// Load JS variables
		$data = apply_filters(
			'crewhrm_frontend_data',
			array(
				'app_name'        => Main::$configs->app_name,
				'white_label'     => Utilities::getWhiteLabel(),
				'action_hooks'    => array(),
				'filter_hooks'    => array(),
				'mountpoints'     => ( object ) array(),
				'home_url'        => get_home_url(),
				'dist_url'        => Main::$configs->dist_url,
				'plugin_url'      => Main::$configs->url,
				'colors'          => $dynamic_colors,
				'reserved_stages' => array_keys( Stage::$reserved_stages ),
				'nonce_action'    => $nonce_action,
				'nonce'           => $nonce,
				'has_pro'         => Main::$configs->has_pro,
				'wp_max_size'     => Settings::getWpMaxUploadSize(),
				'date_format'     => get_option( 'date_format' ),
				'time_format'     => get_option( 'time_format' ),
				'admin_url'       => add_query_arg( array( 'page' => '' ), admin_url( 'admin.php' ) ),
				'is_admin'        => is_admin(),
				'is_frontend'     => ! is_admin(),
				'text_domain'     => Main::$configs->text_domain,
				'currency_code'   => Settings::getSetting( 'company_currency' ),
				'departments'     => Department::getDepartments(),
				'permalinks'      => array(
					'ajaxurl'           => admin_url( 'admin-ajax.php' ),
					'careers'           => Job::getCareersPageUrl(),
					'settings_employee' => add_query_arg( array( 'page' => Admin::SLUG_SETTINGS ), admin_url( 'admin.php' ) ) . '#/settings/recruitment/employee/'
				),
				'company_address' => array(
					'street_address' => Settings::getSetting( 'street_address', '' ),
					'city'           => Settings::getSetting( 'city', '' ),
					'province'       => Settings::getSetting( 'province', '' ),
					'zip_code'       => Settings::getSetting( 'zip_code', '' ),
					'country_code'   => Settings::getSetting( 'country_code', '' ),
				),
			)
		);

		// Determine data pointer
		$pattern = '/\/([^\/]+)\/wp-content\/(plugins|themes)\/([^\/]+)\/.*/';
		preg_match( $pattern, Main::$configs->url, $matches );

		// Prepare variable name
		$pointer = strtolower( "CrewMat_{$matches[1]}_{$matches[3]}" );
		$pointer = preg_replace( '/[^a-zA-Z0-9_]/', '', $pointer );

		?>
		<script data-nowprocket>
			window.<?php echo $pointer; ?> = <?php echo wp_json_encode( $data ); ?>;
			window.<?php echo $pointer; ?>pro = window.<?php echo $pointer; ?>;
		</script>
		<?php
	}

	/**
	 * Load text domain for translations
	 *
	 * @return void
	 */
	public function loadTextDomain() {
		load_plugin_textdomain( Main::$configs->text_domain, false, Main::$configs->dir . 'languages' );
	}
}
