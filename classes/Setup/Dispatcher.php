<?php

namespace CrewHRM\Setup;

use CrewHRM\Helpers\Nonce;
use CrewHRM\Main;

class Dispatcher {
	
	// To Do: Secure all the endpoint after MVP implementation
	private static $endpoints = array(
		'save_settings',
	);

	// Mark some as nopriv
	private static $noprivs = array(
		'get_content_list'
	);

	function __construct() {
		// Loop through handlers and register
		foreach ( self::$endpoints as $endpoint ) {
			// Register logged in handler first
			add_action( 'wp_ajax_' . Main::$configs->app_name . '_' . $endpoint, function() use($endpoint) {
				$this->dispatch($endpoint);
			} );

			// Register public handlers too if defined so
			if( in_array( $endpoint, self::$noprivs ) ) {
				add_action( 'wp_ajax_nopriv_' . Main::$configs->app_name . '_' . $endpoint, function() use($endpoint) {
					$this->dispatch($endpoint);
				} );
			}
		}
	}

	public function dispatch( $endpoint ) {
		// Verify nonce
		Nonce::verify();

		// Remove action as it is not necessary anywhere else
		if ( isset( $_POST['action'] ) ) {
			unset( $_POST['action'] );
		}
		if ( isset( $_GET['action'] ) ) {
			unset( $_GET['action'] );
		}

		// Now pass to the controller
		if ( method_exists( $this, $endpoint ) ) {
			$this->$endpoint();
		} else {
			wp_send_json_error( array( 'message' => __( 'Invalid Endpoint!', 'crewhrm' ) ) );
			exit;
		}
	}

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
}