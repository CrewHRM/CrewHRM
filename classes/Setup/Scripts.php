<?php

namespace CrewHRM\Setup;

use CrewHRM\Helpers\Colors;
use CrewHRM\Helpers\Utilities;
use CrewHRM\Main;

class Scripts extends Main {
	function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'adminScripts' ), 11 );
		add_action( 'wp_enqueue_scripts', array( $this, 'frontendScripts' ), 11 );

		// Color pallete
		add_action( 'wp_head', array( $this, 'loadVariables' ), 1000 );
		add_action( 'admin_head', array( $this, 'loadVariables' ), 1000 );
	}

	public function adminScripts() {
		// Load script for the main hrm dashboard
		if ( Utilities::isCrewDashboard( self::$configs->root_menu_slug )  ) {
			wp_enqueue_script( 'crewhrm-hrm', self::$configs->dist_url . 'hrm.js', array( 'jquery', 'wp-i18n' ), self::$configs->version, true );
		}

		// Load scripts for setting and company profile
		if ( Utilities::isCrewDashboard( array( Admin::SLUG_SETTINGS, Admin::SLUG_COMPANY_PROFILE ) ) ) {
			wp_enqueue_script( 'crewhrm-settings', self::$configs->dist_url . 'settings.js', array( 'jquery', 'wp-i18n' ), self::$configs->version, true );
		}
	}

	public function frontendScripts() {

	}

	public function loadVariables() {
		// Check if it's our page and needs resources to load
		if ( ( is_admin() && ! Utilities::isCrewDashboard() ) ) {
			return;
		}

		// Load dynamic colors
		$dynamic_colors = Colors::getColors();
		$_colors = '';
		foreach ( $dynamic_colors as $name => $code ) {
			$_colors .= '--crewhrm-color-' . $name . ':' . $code . ';';
		}
		echo '<style>:root{' . $_colors . '}</style>';

		// Load JS variables
		$data = array(
			'action_hooks' => array(),
			'filter_hooks' => array(),
			'ajaxurl'      => admin_url('admin-ajax.php'),
			'colors'       => $dynamic_colors
		);
		echo '<script>window.CrewHRM=' . json_encode( $data ) . '</script>';
	}
}