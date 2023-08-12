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
			wp_enqueue_script( 'crewhrm-backend-dashboard-script', self::$configs->dist_url . 'backend-dashboard.js', array( 'jquery', 'wp-i18n' ), self::$configs->version, true );
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
			'background-color-primary'   => '#1A1A1A', // Active state
			'background-color-secondary' => '#BBBFC3', // Disabled state

			'foreground-color-primary'   => '#FFFFFF', // Primary text with a primary background
			'foreground-color-secondary' => '#BBBFC3', // Scondary text with a primary background
			'foreground-color-tertiary'  => '#72777B', // Tertiary text with a primary background

			'text-color-primary'         => '#1A1A1A', // Primary text color with a white background ideally
			'text-color-secondary'       => '#72777B', // Secondary text color with a white backogrund ideally
			'text-color-tertiary'        => '#BBBFC3', // Secondary text color with a white backogrund ideally
			'text-color-danger'          => 'rgb(252, 82, 118)',

			'border-color-secondary'     => '#72777B', // Border color with a white background ideally
			'border-color-tertiary'      => '#E3E5E8', // Border color with a white background ideally
		);

		$css = '';
		foreach ( $colors as $key => $color ) {
			$css .= '--crewhrm-' . $key . ':' . $color . ';';
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