<?php

namespace CrewHRM\Setup;

use CrewHRM\Main;

class Admin extends Main {
	const SLUG_COMPANY_PROFILE = 'crewhrm-settings';
	const SLUG_SETTINGS        = 'crewhrm-company';

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

		// Company profile
		add_submenu_page( 
			self::$configs->root_menu_slug, 
			__( 'Company', 'crewhrm' ),
			 __( 'Company', 'crewhrm' ), 
			 'administrator', 
			 self::SLUG_COMPANY_PROFILE, 
			 array( $this, 'companyProfilePage' ) 
		);

		// Setting page
		add_submenu_page( 
			self::$configs->root_menu_slug, 
			__( 'Settings', 'crewhrm' ),
			 __( 'Settings', 'crewhrm' ), 
			 'administrator', 
			 self::SLUG_SETTINGS, 
			 array( $this, 'settingPage' ) 
		);
	}

	/**
	 * Main page content
	 *
	 * @return void
	 */
	public function mainPage() {
		echo '<div id="crewhrm_dashboard"></div>';
	}
	
	/**
	 * Setting page content
	 *
	 * @return void
	 */
	public function companyProfilePage() {
		echo '<div id="crewhrm_company_profile"></div>';
	}
	
	/**
	 * Setting page content
	 *
	 * @return void
	 */
	public function settingPage() {
		echo '<div id="crewhrm_settings"></div>';
	}
}