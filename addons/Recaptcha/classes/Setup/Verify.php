<?php
/**
 * Captcha verifier
 * 
 * @package crewhrm
 */
namespace CrewHRM\Addon\Recaptcha\Setup;

use CrewHRM\Addon\Recaptcha\Models\Google;

/**
 * Captcha verifier class
 */
class Verify {
	public function __construct() {
		add_action( 'crewhrm_submit_application_before', array( $this, 'verifyToken' ) );
	}

	/**
	 * Verify captcha before proceeding application submission request
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public function verifyToken( array $data ) {
		// Get the captcha response
		$token = is_array( $data['application'] ?? null ) ? $data['application']['recaptcha_token'] ?? null : null;

		if ( empty( $token ) || ! is_string( $token ) ) {
			wp_send_json_error( array( 'notice' => __( 'Please verify captcha first', 'crewhrm' ) ) );
			exit;
		}

		if ( ! Google::verifyRecaptcha( $token ) ) {
			wp_send_json_error( array( 'notice' => __( 'Captcha validation failed', 'crewhrm' ) ) );
			exit;
		}
	}
}
