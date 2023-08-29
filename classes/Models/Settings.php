<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

class Settings {
	const KEY_COMPANY  = 'crewhrm_company_profile';
	const KEY_SETTINGS = 'crewhrm_plugins_settings';

	/**
	 * Get company profile from options and add dynamic meta data like image logo url
	 *
	 * @return array
	 */
	public static function getCompanyProfile() {
		$data = _Array::getArray( get_option( self::KEY_COMPANY ) ); 

		// Assign dynamic meta data
		if ( ! empty( $data['logo_id'] ) ) {
			$data['logo_url'] = wp_get_attachment_url( $data['logo_id'] );
		}

		return $data;
	}

	/**
	 * Get plugin settings
	 *
	 * @return array
	 */
	public static function getSettings() {
		$data = _Array::getArray( get_option( self::KEY_SETTINGS ) );

		$max_upload = wp_max_upload_size() / 1024;

		if ( empty( $data['attachment_max_upload_size'] ) || $data['attachment_max_upload_size'] > $max_upload ) {
			$data['attachment_max_upload_size'] = $max_upload;
		}

		if ( empty( $data['attachment_max_upload_count'] ) ) {
			$data['attachment_max_upload_count'] = 3;
		}
		
		return $data;
	}

	/**
	 * Save company profile data coming from ideally settings page
	 *
	 * @param array  $data  Text type settings
	 * @param string $name Option name to save under as it is used for both general settings and company profile
	 * 
	 * @return void
	 */
	public static function saveSettings( array $data, $option_name ) {
		// Save general info
		update_option( $option_name, $data );
	}
}
