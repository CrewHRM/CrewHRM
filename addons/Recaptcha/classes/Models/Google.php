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
	 * @return array
	 */
	public static function getKeys( $key = null ) {
		return Credential::recaptcha()->getCredential( $key ) ?? '';
	}

	/**
	 * Save credential
	 *
	 * @param string $site_key
	 * @param string $secret_key
	 * @return void
	 */
	public static function saveKeys( string $site_key, string $secret_key ) {
		Credential::recaptcha()->addValue( 'site_key', $site_key );
		Credential::recaptcha()->addValue( 'secret_key', $secret_key );
	}

	public static function verifyRecaptcha( string $captchaResponse ) {
		
		// Data to be sent in the POST request
		$data = array(
			'secret'   => self::getKeys( 'secret_key' ),
			'response' => $captchaResponse,
		);

		// Use cURL to send a POST request
		$ch = curl_init( self::API_ENDPOINT );
		curl_setopt( $ch, CURLOPT_POST, 1 );
		curl_setopt( $ch, CURLOPT_POSTFIELDS, http_build_query( $data ) );
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );

		// Execute the request and decode the JSON response
		$response     = curl_exec( $ch );
		$responseData = json_decode( $response, true );

		// Close cURL session
		curl_close( $ch );

		// Check if reCAPTCHA verification was successful
		return $responseData['success'] ?? false;
	}
}
