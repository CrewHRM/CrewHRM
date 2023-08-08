<?php

namespace CrewHRM\Setup;

use CrewHRM\Helpers\Utilities;
use CrewHRM\Main;

class Scripts extends Main {
	function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'adminScripts' ), 11 );
		add_action( 'wp_enqueue_scripts', array( $this, 'frontendScripts' ), 11 );
		add_action( 'admin_enqueue_scripts', array( $this, 'commonScripts' ), 11 );
		add_action( 'wp_enqueue_scripts', array( $this, 'commonScripts' ), 11 );

		// Color pallete
		add_action( 'wp_head', array( $this, 'loadVariables' ), 1000 );
		add_action( 'admin_head', array( $this, 'loadVariables' ), 1000 );
	}

	public function adminScripts() {
		if ( Utilities::isCrewDashboard()  ) {
			wp_enqueue_script( 'crewhrm-backend-dashboard-script', self::$configs->dist_url . 'backend-dashboard.js', array( 'jquery' ), self::$configs->version, true );
		}
	}

	public function frontendScripts() {

	}

	public function commonScripts() {

	}

	public function loadVariables() {
		// Check if it's our page and needs resources to load
		if ( ( is_admin() && ! Utilities::isCrewDashboard() ) ) {
			return;
		}

		// Load css variables. Ideally from dashboard settings. For now statically written though.
		$colors = array(
			'primary'         => '#1A1A1A',
			'reverse-primary' => '#FFFFFF',
		);

		$css = '';
		foreach ( $colors as $key => $color ) {
			$css .= '--crewhrm-color-' . $key . ':' . $color . ';';
		}
		echo '<style>:root{' . $css . '}</style>';

		// Load JS variables

		// Common data
		$data = array(
			'action_hooks' => array(),
			'filter_hooks' => array(),
			'ajaxurl'      => admin_url('admin-ajax.php'),
		);
		echo '<script>window.CrewHRM=' . json_encode( $data ) . '</script>';
	}
}