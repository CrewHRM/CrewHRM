<?php
/**
 * Database importer for CrewHRM
 *
 * @package crewhrm
 */

namespace CrewHRM\Setup;

use CrewHRM\Main;
use CrewHRM\Models\DB;
use CrewHRM\Models\Settings;

/**
 * The database manager class
 */
class Database {

	/**
	 * Constructor that registeres hook to deploy database on plugin activation
	 *
	 * @return void
	 */
	public function __construct() {
		$this->preloadTablesNames();
		add_action( 'crewhrm_activated', array( $this, 'importDB' ) );
	}

	/**
	 * Import database
	 *
	 * @return void
	 */
	public function importDB() {
		// Import Database SQL file
		$sql_path = Main::$configs->dir . 'dist' . DIRECTORY_SEPARATOR . 'libraries' . DIRECTORY_SEPARATOR . 'db.sql';
		DB::import( file_get_contents( $sql_path ) );

		// Import default business types
		Settings::importBusinessTypes();
	}

	/**
	 * Add prefixed table names to use across the plugin
	 *
	 * @return void
	 */
	public function preloadTablesNames() {
		global $wpdb;

		// WP and Plugin prefix
		$prefix = $wpdb->prefix . Main::$configs->db_prefix;

		// Add the table names to wpdb object
		$wpdb->crewhrm_addresses        = $prefix . 'addresses';
		$wpdb->crewhrm_applications     = $prefix . 'applications';
		$wpdb->crewhrm_appmeta          = $prefix . 'appmeta';
		$wpdb->crewhrm_comments         = $prefix . 'comments';
		$wpdb->crewhrm_departments      = $prefix . 'departments';
		$wpdb->crewhrm_events           = $prefix . 'events';
		$wpdb->crewhrm_event_attendees  = $prefix . 'event_attendees';
		$wpdb->crewhrm_jobmeta          = $prefix . 'jobmeta';
		$wpdb->crewhrm_jobs             = $prefix . 'jobs';
		$wpdb->crewhrm_pipeline         = $prefix . 'pipeline';
		$wpdb->crewhrm_stages           = $prefix . 'stages';
		$wpdb->crewhrm_employments      = $prefix . 'employments';
		$wpdb->crewhrm_employee_meta    = $prefix . 'employee_meta';
		$wpdb->crewhrm_weekly_schedules = $prefix . 'weekly_schedules';
	}
}
