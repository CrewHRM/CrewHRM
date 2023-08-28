<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

class Settings {
	const KEY_COMPANY  = 'crewhrm_company_profile';
	const KEY_SETTINGS = 'crewhrm_general_settings';

	/**
	 * Get company profile from options and add dynamic meta data like image logo url
	 *
	 * @return array
	 */
	public static function getCompanyProfile() {
		$data = _Array::getArray( get_option( self::KEY_COMPANY ) ); 

		if ( ! empty( $data['logo_id'] ) ) {
			$data['logo_url'] = wp_get_attachment_url( $data['logo_id'] );
		}

		return $data;
	}

	/**
	 * Save company profile data coming from ideally settings page
	 *
	 * @param array $data  Text type settings
	 * @param string $name Option name to save under as it is used for both general settings and company profile
	 * 
	 * @return void
	 */
	public static function saveSettings( array $data, $option_name ) {
		// Save general info
		update_option( $option_name, $data );
	}
}