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
		static $data = array();
		
		if ( ! isset( $data[ $source ] )) {
			$defaults = array(
				self::KEY_SETTINGS => array(
					'careers_search'  => true,
					'careers_sidebar' => true,
				),
			);

			$_data           = get_option( $source );
			$_data           = _Array::getArray( $_data );
			$_data           = array_merge( $defaults[ $source ] ?? array(), $_data );
			$data[ $source ] = File::applyDynamics( $_data );
		}
		
		return $data[ $source ];
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
		return null !== $name ? ( $data[ $name ] ?? $default ) : $data;
	}

	/**
	 * Get the max size in KB allowed for job application
	 *
	 * @return int
	 */
	public static function getApplicationMaxSize() {
		$size = self::getSettings( 'attachment_max_upload_size' );

		// Convert to kilobyte
		$max_upload = self::getWpMaxUploadSize();

		// Safe max range
		if ( empty( $size ) || ! is_numeric( $size ) || $size > $max_upload || $size <= 0 ) {
			$size = $max_upload;
		}

		return $size;
	}

	/**
	 * Get date format
	 *
	 * @return string
	 */
	public static function getDateFormat() {
		$format = self::getSettings( 'date_format' );
		if ( empty( $format ) ) {
			$format = get_option('date_format');
		}

		return $format;
	}

	/**
	 * Get time format
	 *
	 * @return void
	 */
	public static function getTimeFormat() {
		$format = self::getSettings( 'time_format' );
		if ( empty( $format ) ) {
			$format = get_option('time_format');
		}

		return $format;
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
