<?php
/**
 * Google captcha verifier
 *
 * @package crewhrm
 */

namespace CrewHRM\Addon\Recaptcha\Models;

use CrewHRM\Helpers\Credential;

/**
 * The verifier class for both v2 and v3
 */
class Google {
	/**
	 * The Google API endpoint
	 */
	const API_ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify';

	/**
	 * Get google site key and secret key
	 *
	 * @param string|null $key The key to get value of
	 * @return array
	 */
	public static function getKeys( $key = null ) {
		return Credential::recaptcha()->getCredential( $key ) ?? '';
	}

	/**
	 * Check if the recaptcha configured or not
	 *
	 * @return boolean
	 */
	public static function isConfigured() {
		$keys = self::getKeys();
		return is_array( $keys ) && ! empty( $keys['site_key'] ) && ! empty( $keys['secret_key'] );
	}

	/**
	 * Save credential
	 *
	 * @param string $site_key The site key
	 * @param string $secret_key The secret key
	 * @return void
	 */
	public static function saveKeys( string $site_key, string $secret_key ) {
		Credential::recaptcha()->addValue( 'site_key', $site_key );
		Credential::recaptcha()->addValue( 'secret_key', $secret_key );
	}

	/**
	 * Verify if the captcha is valid
	 *
	 * @param string $captcha_response The geenrated captcha response from frontend
	 * @return bool
	 */
	public static function verifyRecaptcha( string $captcha_response ) {

		$request_args = array(
			'body' => array(
				'secret'   => self::getKeys( 'secret_key' ),
				'response' => $captcha_response,
			),
		);

		$response = wp_remote_post( self::API_ENDPOINT, $request_args );
		if ( is_wp_error( $response ) ) {
			return $response->get_error_message();
		}

		// Get the response body
		$body = wp_remote_retrieve_body( $response );

		// Decode the JSON response
		$data = json_decode( $body, true );

		return $data['success'] ?? false;
	}
}
