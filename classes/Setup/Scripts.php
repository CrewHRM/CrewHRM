<?php

namespace CrewHRM\Setup;

use CrewHRM\Main;

class Scripts extends Main {
	function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'commonScripts' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'commonScripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'adminScripts' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'frontendScripts' ) );
	}

	public function commonScripts() {

	}
	
	public function adminScripts() {
		if ( get_admin_page_parent() == self::$configs->root_menu_slug  ) {
			wp_enqueue_script( 'crewhrm-backend-dashboard-script', self::$configs->dist_url . 'backend-dashboard.js', array( 'jquery' ), self::$configs->version, true );
		}
	}

	public function frontendScripts() {

	}
}