<?php
/**
 * Plugin settings related controller
 *
 * @package crewhrm
 */

namespace CrewHRM\Controllers;

use CrewHRM\Models\Settings;

/**
 * The controller class to manage plugin settings
 */
class PluginSettings {
	const PREREQUISITES = array(
		'saveSettings' => array(
			'role' => 'administrator',
		),
	);

	/**
	 * Save admin settings
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function saveSettings( $data ) {
		// Update the settings now
		Settings::saveSettings( $data['settings'] );

		wp_send_json_success( array( 'message' => 'Settings updated!' ) );
	}

}
