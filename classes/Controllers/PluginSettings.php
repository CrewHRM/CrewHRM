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
		'saveSettings'       => array(
			'role' => 'administrator',
		),
		'addDepartment'      => array(
			'role' => array( 'administrator' ),
		),
		'getCareersSettings' => array(
			'nopriv' => true,
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
			wp_send_json_error( array( 'message' => esc_html__( 'Something went wrong!', 'hr-management' ) ) );
		}

		// Get updated list
		$departments = Department::getDepartments();

		Settings::saveSettings( array( 'departments' => $departments ), true );

		wp_send_json_success(
			array(
				'id'          => $new_id,
				'departments' => $departments,
				'message'     => esc_html__( 'New department added successfully', 'hr-management' ),
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

	/**
	 * Get careers page settings especially for rendering through block
	 *
	 * @return void
	 */
	public static function getCareersSettings() {
		wp_send_json_success(
			array(
				'settings' => Settings::getCareersListSettings(),
			)
		);
	}
}
