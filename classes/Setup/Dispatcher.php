<?php

namespace CrewHRM\Setup;

use CrewHRM\Helpers\Validation;
use CrewHRM\Main;
use CrewHRM\Models\Settings;
use CrewHRM\Models\User;

class Dispatcher {
	
	// To Do: Secure all the endpoint after MVP implementation
	private static $endpoints = array(

		// Administrative endpoints
		'save_settings' => array(
			'role' => 'administrator',
		),
		'save_company_profile' => array(
			'role' => 'administrator',
			'required' => array(
				'settings' => array(
					'type' => 'array'
				)
			)
		),

		// End user endpoints
		'get_career_listings' => array(
			'nopriv' => true
		)
	);

	/**
	 * Dispatcher registration in constructor
	 */
	function __construct() {
		// Loop through handlers and register
		foreach ( self::$endpoints as $endpoint => $prerequisites ) {
			// Register logged in handler first
			add_action( 'wp_ajax_' . Main::$configs->app_name . '_' . $endpoint, function() use($endpoint) {
				$this->dispatch($endpoint);
			} );

			// Register public handlers too if defined so
			if ( ( $prerequisites['nopriv'] ?? false ) === true ) {
				add_action( 'wp_ajax_nopriv_' . Main::$configs->app_name . '_' . $endpoint, function() use($endpoint) {
					$this->dispatch($endpoint);
				} );
			}
		}
	}

	public function dispatch( $endpoint ) {
		// Determine data
		$is_post = strtolower( sanitize_text_field( $_SERVER['REQUEST_METHOD'] ) ) === 'post';
		$data    = $is_post ? $_POST : $_GET;

		// Verify nonce
		$nonce   = $data['nonce'] ?? null;
		$action  = $data['nonceAction'] ?? null;
		$matched = $nonce && $action && wp_verify_nonce( $nonce, $action );
		if ( ! $matched ) {
			wp_send_json_error( array( 'message' => __( 'Session Expired!', 'crewhrm' ) ) );
		}

		// Verify required user role
		if ( ! empty( $required_roles = self::$endpoints[ $endpoint ]['role'] ) ) {
			if ( ! User::validateRole( get_current_user_id(), $required_roles ) ) {
				wp_send_json_error( array( 'message' => __( 'Access Denied!', 'crewhrm' ) ) );
			}
		}

		// Check required data
		if ( ! empty( $required = self::$endpoints[ $endpoint ]['required'] ) ) {
			if ( ! Validation::validateData( $data, $required ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid Data!', 'crewhrm' ) ) );
			}
		}

		// Now pass to the action handler function
		if ( method_exists( $this, $endpoint ) ) {
			$this->$endpoint( $data );
		} else {
			wp_send_json_error( array( 'message' => __( 'Invalid Endpoint!', 'crewhrm' ) ) );
		}
	}

	/* ------------------------------------ Action Handlers ------------------------------------ */

	/**
	 * Save admin settings
	 *
	 * @return void
	 */
	public function save_settings() {
		wp_send_json_success(
			array(
				'message' => 'ok',
			)
		);
	}

	/**
	 * Save company settings
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public function save_company_profile( $data ) {
		
		// Update the settings now
		Settings::saveSettings( $data['settings'], Settings::KEY_COMPANY );

		wp_send_json_success();
	}
}