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
		'saveSettings'                 => array(
			'role' => 'administrator',
		),
		'addDepartment'                => array(
			'role' => array( 'administrator' ),
		),
		'getCareersSettings'           => array(
			'nopriv' => true,
		),
		'addSettingItem_business_type' => array(
			'role' => array( 'administrator' ),
		),
	);

	/**
	 * Add single department, ideally from job editor
	 *
	 * @param string $item_name The department name to add
	 * @return void
	 */
	public static function addDepartment( string $item_name ) {
		// Add first
		$new_id = Department::addDepartment( $item_name );
		if ( ! $new_id ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Something went wrong!', 'hr-management' ) ) );
		}

		// Get updated list
		$departments = Department::getDepartments();

		Settings::saveSettings( array( 'departments' => $departments ), true );

		wp_send_json_success(
			array(
				'id'      => $new_id,
				'items'   => $departments,
				'message' => esc_html__( 'New department added successfully', 'hr-management' ),
			)
		);
	}

	/**
	 * Save admin settings
	 *
	 * @param array $settings The settings array
	 * @return void
	 */
	public static function saveSettings( array $settings ) {

		// Update the settings now
		Settings::saveSettings( $settings );

		wp_send_json_success(
			array(
				'message'  => esc_html__( 'Settings updated!', 'hr-management' ),
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

	/**
	 * Add custom business type
	 *
	 * @param string $item_name The new name to add as business type
	 *
	 * @return void
	 */
	public static function addSettingItem_business_type( string $item_name ) {
		$id    = Settings::addBusinessType( $item_name );
		$items = Settings::getBusinessTypesDropdown();

		wp_send_json_success(
			array(
				'id'    => $id,
				'items' => $items,
			)
		);
	}
}
