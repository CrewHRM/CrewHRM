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
	 * @param string  $addon_id The addon ID string, it is not numeric
	 * @param boolean $new_state Boolean status of enabled or disabled
	 * @return void
	 */
	public static function toggleAddonState( string $addon_id, bool $new_state ) {
		AddonManager::toggleState( $addon_id, $new_state );
		wp_send_json_success();
	}
}
