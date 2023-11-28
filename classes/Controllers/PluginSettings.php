<?php
/**
 * Plugin settings related controller
 *
 * @package crewhrm
 */

namespace CrewHRM\Controllers;

use CrewHRM\Models\Department;
use CrewHRM\Models\Settings;

/**
 * The controller class to manage plugin settings
 */
class PluginSettings {
	const PREREQUISITES = array(
		'saveSettings'  => array(
			'role' => 'administrator',
		),
		'addDepartment' => array(
			'role' => array( 'administrator' ),
		),
	);

	/**
	 * Add single department, ideally from job editor
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function addDepartment( array $data ) {
		// Add first
		$new_id = Department::addDepartment( $data['department_name'] );
		if ( ! $new_id ) {
			wp_send_json_error( array( 'message' => __( 'Something went wrong!', 'crewhrm' ) ) );
		}

		// Get updated list
		$departments = Department::getDepartments();

		Settings::saveSettings( array( 'departments' => $departments ), true );

		wp_send_json_success(
			array(
				'id'          => $new_id,
				'departments' => $departments,
				'message'     => __( 'New department added successfully', 'crewhrm' ),
			)
		);
	}

	/**
	 * Save admin settings
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function saveSettings( $data ) {
		// Update the settings now
		Settings::saveSettings( $data['settings'] );

		wp_send_json_success(
			array(
				'message'  => 'Settings updated!',
				'settings' => Settings::getSettings(),
			)
		);
	}
}
