<?php
/**
 * Recaptcha credential settings
 *
 * @package creahrm
 */

namespace CrewHRM\Addon\Recaptcha\Controllers;

use CrewHRM\Addon\Recaptcha\Models\Google;
use CrewHRM\Helpers\Credential as HelpersCredential;
use CrewHRM\Models\User;

/**
 * The class
 */
class Credential {
	/**
	 * Controllers
	 */
	const PREREQUISITES = array(
		'saveRecaptchaKeys' => array(
			'role' => array(
				'administrator',
			),
		),
		'getRecaptchaKeys'  => array(
			'nopriv' => true,
		),
	);

	/**
	 * Credential save method
	 *
	 * @param array $data Request Data
	 * @return void
	 */
	public static function saveRecaptchaKeys( array $data ) {
		$site_key   = sanitize_text_field( wp_unslash( $data['site_key'] ?? '' ) );
		$secret_key = sanitize_text_field( wp_unslash( $data['secret_key'] ?? '' ) );

		if ( empty( $site_key ) || empty( $secret_key ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Invalid credential', 'hr-management' ) ) );
		} else {
			Google::saveKeys( $site_key, $secret_key );
			wp_send_json_success( array( 'message' => esc_html__( 'Credentials saved successfully', 'hr-management' ) ) );
		}
	}

	/**
	 * Get recaptcha site key for
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function getRecaptchaKeys( array $data ) {
		$keys = HelpersCredential::recaptcha()->getCredential();
		$keys = is_array( $keys ) ? $keys : array();

		if ( ! User::validateRole( get_current_user_id(), array( 'administrator', 'hr-manager' ) ) ) {
			if ( isset( $keys['secret_key'] ) ) {
				unset( $keys['secret_key'] );
			}
		}

		wp_send_json_success( $keys );
	}
}
