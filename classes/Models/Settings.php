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
	const KEY_SETTINGS = 'crewhrm_plugins_settings';

	/**
	 * Commn method to get settings for both
	 *
	 * @return array
	 */
	private static function get() {

		$defaults = array(
			'careers_search'          => true,
			'careers_sidebar'         => true,
			'application_form_layout' => 'segmented_form',
			'job_post_per_page'       => 20,
			'outgoing_email_events'   => apply_filters(
				'crewhrm_email_events_default',
				array(
					'application-confirmation',
				)
			),
		);

		$_data = get_option( self::KEY_SETTINGS );
		$_data = _Array::getArray( $_data );
		$_data = array_merge( $defaults, $_data );
		$_data = File::applyDynamics( $_data );

		return $_data;
	}

	/**
	 * Get plugin settings
	 *
	 * @param string|null $name    Settings name
	 * @param mixed       $default Default return value
	 * @return mixed
	 */
	public static function getSettings( $name = null, $default = null ) {

		// Pass through fitlers for pro default options ideally
		$settings = apply_filters( 'crewhrm_settings', self::get() );

		return null !== $name ? ( $settings[ $name ] ?? $default ) : $settings;
	}

	/**
	 * Get WP max upload size in MB.
	 *
	 * @return int
	 */
	public static function getWpMaxUploadSize() {
		return floor( ( wp_max_upload_size() / 1024 ) / 1024 );
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
	 * @param array $data Settings to save
	 * @param bool  $merge Whether to merge with existing or not
	 * @return void
	 */
	public static function saveSettings( array $data, $merge = false ) {

		// In case you need to update only on option inside the array
		if ( true === $merge ) {
			$data = array_merge( self::get(), $data );
		}

		// Save general info
		update_option( self::KEY_SETTINGS, apply_filters( 'crewhrm_save_settings', $data ), true );

		// Flush rewrite rule to apply dashboard page change
		flush_rewrite_rules();
	}

	/**
	 * Return recruiter email to send on behalf of
	 *
	 * @return string|null
	 */
	public static function getRecruiterEmail() {
		// Get From company settings first
		$mail = self::getSettings( 'recruiter_email' );

		// Then from global settings
		if ( empty( $mail ) ) {
			$mail = get_option( 'admin_email' );
		}

		return empty( $mail ) ? null : $mail;
	}
}
