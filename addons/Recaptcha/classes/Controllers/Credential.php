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
	 * @param string $site_key Site Key
	 * @param string $secret_key Secret Key
	 * @return void
	 */
	public static function saveRecaptchaKeys( string $site_key, string $secret_key ) {

		Google::saveKeys( $site_key, $secret_key );

		wp_send_json_success(
			array(
				'message' => esc_html__( 'Credentials saved successfully', 'hr-management' ),
			)
		);
	}

	/**
	 * Get recaptcha site key for
	 *
	 * @return void
	 */
	public static function getRecaptchaKeys() {
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
