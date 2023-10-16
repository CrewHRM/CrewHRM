<?php

namespace CrewHRM\Controllers;

use CrewHRM\Models\AddonManager;

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
		$new_state = $data['new_state'] ?? null;
		$addon_id = $data['addon_id'] ?? null;

		if ( ! empty( $addon_id ) &&  is_bool( $new_state ) ) {
			AddonManager::toggleState( $addon_id, $new_state );
			wp_send_json_success();

		} else {
			wp_send_json_error( array( 'message' => __( 'Invalid Request Data', 'crewhrm-pro' ) ) );
		}
	}
}