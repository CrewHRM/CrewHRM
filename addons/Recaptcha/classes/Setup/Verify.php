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
	/**
	 * Register verify functionalities
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'crewhrm_submit_application_before', array( $this, 'verifyToken' ) );
	}

	/**
	 * Verify captcha before proceeding application submission request
	 *
	 * @param array $application The application data array
	 * @return void
	 */
	public function verifyToken( array $application ) {

		// No need to  verify if the recaptcha cofniguration keys not set yet
		if ( ! Google::isConfigured() ) {
			return;
		}

		// Get the captcha response
		$token = $application['recaptcha_token'] ?? null;

		if ( empty( $token ) || ! is_string( $token ) ) {
			wp_send_json_error( array( 'notice' => esc_html__( 'Please verify captcha first', 'hr-management' ) ) );
			exit;
		}

		$verify = Google::verifyRecaptcha( $token );
		if ( true !== $verify ) {
			$message = ( ! empty( $verify ) && is_string( $verify ) ) ? $verify : esc_html__( 'Captcha validation failed', 'hr-management' );
			wp_send_json_error( array( 'notice' => $message ) );
			exit;
		}
	}
}
