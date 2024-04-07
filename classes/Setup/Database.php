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

	const DB_VERSION_KEY = 'crewhrm_db_version';

	/**
	 * Constructor that registeres hook to deploy database on plugin activation
	 *
	 * @return void
	 */
	public function __construct() {
		$this->preloadTablesNames();
		add_action( 'crewhrm_activated', array( $this, 'importDB' ) );
		add_action( 'admin_init', array( $this, 'importDBOnUpdate' ), 0 );
	}

	/**
	 * Trigger import db function on plugin update
	 *
	 * @return void
	 */
	public function importDBOnUpdate() {

		$last_version = get_option( self::DB_VERSION_KEY );
		
		if ( empty( $last_version ) || version_compare( $last_version, Main::$configs->version, '<' ) ) {
			$this->importDB();
		}
	}

	/**
	 * Import database
	 *
	 * @return void
	 */
	public function importDB() {
		// Import Database SQL file
		$sql_path = Main::$configs->dir . 'dist/libraries/db.sql';
		DB::import( file_get_contents( $sql_path ) );

		// Import default business types
		Settings::importBusinessTypes();
	
		update_option( self::DB_VERSION_KEY, Main::$configs->version, true );
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
		$wpdb->crewhrm_employment_meta  = $prefix . 'employment_meta';
		$wpdb->crewhrm_employee_meta    = $prefix . 'employee_meta';
		$wpdb->crewhrm_weekly_schedules = $prefix . 'weekly_schedules';
		$wpdb->crewhrm_leaves           = $prefix . 'leaves';
	}
}
