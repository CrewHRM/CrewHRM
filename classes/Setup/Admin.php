<?php

namespace CrewHRM\Setup;

use CrewHRM\Main;

class Admin extends Main {
	function __construct() {
		add_action( 'admin_menu', array( $this, 'registerMenu' ) );
	}
	
	/**
	 * Register admin menu pages
	 *
	 * @return void
	 */
	public function registerMenu() {
		// Main page
		add_menu_page(
			__( 'Crew HRM', 'crewhrm' ),
			__( 'Crew HRM', 'crewhrm' ),
			'administrator',
			self::$configs->root_menu_slug,
			array( $this, 'mainPage' )
		);

		// Setting page
		add_submenu_page( 
			self::$configs->root_menu_slug, 
			__( 'Settings', 'root_menu_slug' ),
			 __( 'Settings', 'root_menu_slug' ), 
			 'administrator', 
			 'settings', 
			 array( $this, 'settingPage' ) 
		);
	}

	/**
	 * Main page content
	 *
	 * @return void
	 */
	public function mainPage() {
		echo '<div id="crewhrm_backend_main_page"></div>';
	}
	
	/**
	 * Setting page content
	 *
	 * @return void
	 */
	public function settingPage() {
		echo '<div id="crewhrm_backend_settings_page"></div>';
	}
}