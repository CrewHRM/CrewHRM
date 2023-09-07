<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

class Settings {
	const KEY_COMPANY  = 'crewhrm_company_profile';
	const KEY_SETTINGS = 'crewhrm_plugins_settings';

	/**
	 * Get company profile from options and add dynamic meta data like image logo url
	 *
	 * @param string $name
	 * @param mixed $default
	 * @return mixed
	 */
	public static function getCompanyProfile( $key = null, $default = null ) {
		$data = _Array::getArray( get_option( self::KEY_COMPANY ) ); 

		// Assign dynamic meta data
		if ( ! empty( $data['logo_id'] ) ) {
			$data['logo_url'] = wp_get_attachment_url( $data['logo_id'] );
		}

		return $key !== null ? ( $data[ $key ] ?? $default ) : $data;
	}

	/**
	 * Get plugin settings
	 *
	 * @param string|null $name
	 * @return mixed
	 */
	public static function getSettings( $name = null, $default = null ) {
		$data = _Array::getArray( get_option( self::KEY_SETTINGS ) );

		$max_upload = wp_max_upload_size() / 1024;

		if ( empty( $data['attachment_max_upload_size'] ) || $data['attachment_max_upload_size'] > $max_upload ) {
			$data['attachment_max_upload_size'] = $max_upload;
		}

		if ( empty( $data['attachment_max_upload_count'] ) ) {
			$data['attachment_max_upload_count'] = 3;
		}
		
		$options = _Array::castRecursive( $data );

		return $name !== null ? ( $options[ $name ] ?? $default ) : $options;
	}

	/**
	 * Get specific settings
	 *
	 * @param string $name
	 * @return mixed
	 */
	public static function getSetting( string $name, $default = null ) {
		return self::getSettings( $name, $default );
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

		// Flush rewrite rule to apply dashboard page change
		flush_rewrite_rules();
	}
}
