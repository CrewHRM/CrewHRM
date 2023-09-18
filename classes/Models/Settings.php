<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;
use CrewHRM\Helpers\File;

class Settings {
	const KEY_COMPANY  = 'crewhrm_company_profile';
	const KEY_SETTINGS = 'crewhrm_plugins_settings';

	/**
	 * Commn method to get settings for both
	 *
	 * @param string $source
	 * @return array
	 */
	private static function get( string $source ) {
		$defaults = array(
			self::KEY_SETTINGS => array(
				'careers_search'  => true,
				'careers_sidebar' => true
			)
		);

		$data = get_option( $source );
		$data = _Array::getArray( $data );
		$data = array_merge( $defaults[ $source ] ?? array(), $data );
		$data = File::applyDynamics( $data );

		return $data;
	}

	/**
	 * Get company profile from options and add dynamic meta data like image logo url
	 *
	 * @param string $name
	 * @param mixed  $default
	 * @return mixed
	 */
	public static function getCompanyProfile( $key = null, $default = null ) {
		$data = self::get( self::KEY_COMPANY ); 
		return $key !== null ? ( $data[ $key ] ?? $default ) : $data;
	}

	/**
	 * Get plugin settings
	 *
	 * @param string|null $name
	 * @return mixed
	 */
	public static function getSettings( $name = null, $default = null ) {
		$data = self::get( self::KEY_SETTINGS );
		
		// Convert to kilobyte
		$max_upload = self::getWpMaxUploadSize();

		// Safe max range
		if ( empty( $data['attachment_max_upload_size'] ) || $data['attachment_max_upload_size'] > $max_upload ) {
			$data['attachment_max_upload_size'] = $max_upload;
		}

		return $name !== null ? ( $data[ $name ] ?? $default ) : $data;
	}

	/**
	 * Get the max size in KB allowed for job application 
	 *
	 * @return int
	 */
	public static function getApplicationMaxSize() {
		return self::getSettings( 'attachment_max_upload_size' );
	}

	/**
	 * Get WP max upload size in KB.
	 *
	 * @return int
	 */
	public static function getWpMaxUploadSize() {
		return floor( wp_max_upload_size() / 1024 );
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
	public static function saveSettings( array $data, $option_name = self::KEY_SETTINGS ) {
		// Save general info
		update_option( $option_name, $data );

		// Flush rewrite rule to apply dashboard page change
		flush_rewrite_rules();
	}

	/**
	 * Save company profile
	 *
	 * @param array $data
	 * @return void
	 */
	public static function saveCompanyProfile( array $data ) {
		self::saveSettings( $data, self::KEY_COMPANY );
	}

	/**
	 * Return recruiter email to send on behalf of
	 *
	 * @return string|null
	 */
	public static function getRecruiterEmail() {
		// Get From company settings first
		$mail = self::getCompanyProfile( 'recruiter_email' );

		// Then from global settings
		if ( empty( $mail ) ) {
			$mail = get_option('admin_email');
		}

		return empty( $mail ) ? null : $mail;
	}
}
