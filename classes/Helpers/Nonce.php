<?php

namespace CrewHRM\Helpers;

class Nonce {
	
	/**
	 * Nonce name to generate
	 *
	 * @param string $name
	 * @return void
	 */
	public static function generate( string $action ) {
		return wp_create_nonce( $action );
	}

	/**
	 * Verify nonce
	 *
	 * @param string $request_method
	 * @return bool
	 */
	public static function verify( $request_method = null ) {
		if ( ! $request_method ) {
			$request_method = sanitize_text_field( $_SERVER['REQUEST_METHOD'] );
		}

		// Determine data source
		$is_post     = strtolower( $request_method ) === 'post';
		$data        = $is_post ? $_POST : $_GET;

		// Verify
		$nonce   = $data['nonce'] ?? null;
		$action  = $data['nonceAction'] ?? null;
		$matched = $nonce && $action && wp_verify_nonce( $nonce, $action );

		// Exit if not matched
		if ( ! $matched ) {
			wp_send_json_error(
				array(
					'message' => __( 'Session expired! Please reload the page and try again.', 'crewhrm' ),
				)
			);
			exit;
		}

		// Remove the nonce from data as it is not ncessary anywhere else
		if ( $is_post ) {
			unset( $_POST[ 'nonce' ] );
			unset( $_POST[ 'nonceAction' ] );
		} else {
			unset( $_GET[ 'nonce' ] );
			unset( $_GET[ 'nonceAction' ] );
		}
	}
}
