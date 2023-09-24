<?php
/**
 * Plugin settings handler
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;
use CrewHRM\Helpers\File;

/**
 * Settings manager class
 */
class Settings {
	const KEY_COMPANY  = 'crewhrm_company_profile';
	const KEY_SETTINGS = 'crewhrm_plugins_settings';

	/**
	 * Commn method to get settings for both
	 *
	 * @param string $source The source to get settings. Settings or company profile
	 * @return array
	 */
	private static function get( string $source ) {
		$defaults = array(
			self::KEY_SETTINGS => array(
				'careers_search'  => true,
				'careers_sidebar' => true,
			),
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
	 * @param string $key     Optional specific settings name to get value. Otherwise returns whole settings.
	 * @param mixed  $default Default value to return if the setting not found. Empty array will be provided if it is not singular one.
	 * @return mixed
	 */
	public static function getCompanyProfile( $key = null, $default = null ) {
		$data = self::get( self::KEY_COMPANY );
		return null !== $key ? ( $data[ $key ] ?? $default ) : $data;
	}

	/**
	 * Get plugin settings
	 *
	 * @param string|null $name    Settings name
	 * @param mixed       $default Default return value
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

		return null !== $name ? ( $data[ $name ] ?? $default ) : $data;
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
	 * @param string $name    Get specific setting value
	 * @param mixed  $default Default return value
	 * @return mixed
	 */
	public static function getSetting( string $name, $default = null ) {
		return self::getSettings( $name, $default );
	}

	/**
	 * Save company profile data coming from ideally settings page
	 *
	 * @param array  $data        Settings to save
	 * @param string $option_name Option name to store the settings in
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
	 * @param array $data COmpany profile array to save
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
			$mail = get_option( 'admin_email' );
		}

		return empty( $mail ) ? null : $mail;
	}
}
