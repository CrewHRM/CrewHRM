<?php
/**
 * Addon states management
 *
 * @package crewhrm
 */

namespace CrewHRM\Controllers;

use CrewHRM\Helpers\_String;
use CrewHRM\Models\AddonManager;

/**
 * Controller methods
 */
class AddonController {
	const PREREQUISITES = array(
		'toggleAddonState' => array(
			'role' => array(
				'administrator',
			),
		),
	);

	/**
	 * Enable or disable individual addon, ideally from addons page in backend dashboard.
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function toggleAddonState( array $data ) {
		$new_state = _String::castValue( wp_unslash( $data['new_state'] ?? '' ) );
		$addon_id  = _String::castValue( wp_unslash( $data['addon_id'] ?? '' ) );

		if ( ! empty( $addon_id ) && is_bool( $new_state ) ) {
			AddonManager::toggleState( $addon_id, $new_state );
			wp_send_json_success();

		} else {
			wp_send_json_error( array( 'message' => esc_html__( 'Invalid Request Data', 'hr-management' ) ) );
		}
	}
}
