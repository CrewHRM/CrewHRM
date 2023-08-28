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
		return _Array::getArray( get_option( self::KEY_COMPANY ) ); 
	}

	/**
	 * Save company profile data coming from ideally settings page
	 *
	 * @param [type] $data
	 * @return void
	 */
	public static function saveCompanyProfile( $data ) {
		update_option( self::KEY_COMPANY, $data );
	}
}