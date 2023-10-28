<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;
use CrewHRM\Models\Settings;

class AddonManager {
	
	/**
	 * The array key to store addon settings under crewhrm settings
	 */
	const SETTING_NAME = 'crewhrm_addons_states';

	/**
	 * Return addon enable/disable states with id => bool paired data.
	 *
	 * @return object
	 */
	public static function getAddonsStates() {
		$states   = _Array::getArray( Settings::getSetting( self::SETTING_NAME ) );
		$defaults = array(
			'assessment' => true,
			'attachment' => true,
			'email'      => true
		);

		return array_merge( $defaults, $states );
	}

	/**
	 * Toggle individual addon enable state
	 *
	 * @param string $addon_id
	 * @param boolean $new_state
	 * @return void
	 */
	public static function toggleState( string $addon_id, bool $new_state ) {
		$addons_settings              = self::getAddonsStates();
		$addons_settings[ $addon_id ] = $new_state;
		Settings::saveSettings( array( self::SETTING_NAME => $addons_settings ), true );
	}
}
