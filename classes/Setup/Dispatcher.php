<?php

namespace CrewHRM\Setup;

use CrewHRM\Controllers\ApplicationHandler;
use CrewHRM\Helpers\_String;
use CrewHRM\Helpers\Validation;
use CrewHRM\Main;
use CrewHRM\Models\User;

use CrewHRM\Controllers\CompanyProfile;
use CrewHRM\Controllers\JobManagement;
use CrewHRM\Controllers\PluginSettings;

class Dispatcher {
	
	/**
	 * Ajax request endpoints
	 *
	 * @var array
	 */
	private static $endpoints = array(
		'save_settings'            => PluginSettings::class,

		'save_company_profile'     => CompanyProfile::class,
		'save_company_departments' => CompanyProfile::class,
		'add_department'           => CompanyProfile::class,

		'update_job'               => JobManagement::class,
		'get_jobs_dashboard'       => JobManagement::class,
		'single_job_action'        => JobManagement::class,
		'get_single_job_view'      => JobManagement::class,
		'get_job_view_dashboard'   => JobManagement::class,
		'get_single_job_edit'      => JobManagement::class,
		'delete_hiring_stage'      => JobManagement::class,

		'apply_to_job'             => ApplicationHandler::class,
		'get_applications_list'    => ApplicationHandler::class,
		'get_application_single'   => ApplicationHandler::class,
	);

	/**
	 * Dispatcher registration in constructor
	 */
	public function __construct() {

		// Loop through handlers and register
		foreach ( self::$endpoints as $endpoint => $class ) {
			// Retrieve prerequisities from controller class
			$prerequisites = $this->getPrerequisites( $class, $endpoint );

			// Determine ajax handler types
			$handlers    = [];
			$handlers [] = 'wp_ajax_' . Main::$configs->app_name . '_' . $endpoint;

			// Check if norpriv necessary
			if ( ( $prerequisites['nopriv'] ?? false ) === true ) {
				$handlers[] = 'wp_ajax_nopriv_' . Main::$configs->app_name . '_' . $endpoint;
			}

			// Loop through the handlers and register
			foreach ( $handlers as $handler ) {
				add_action(
					$handler,
					function() use ( $endpoint, $prerequisites ) {
						$this->dispatch( $endpoint, $prerequisites );
					} 
				);
			}
		}
	}

	/**
	 * Get prerequisities for a controller
	 *
	 * @param string $class Controller class
	 * @param string $handler Ajax handler
	 * @return array
	 */
	private function getPrerequisites( $class, $endpoint ) {

		$method = _String::snakeToCamel( $endpoint );

		if ( defined( $class . '::PREREQUISITES' ) && is_array( $class::PREREQUISITES ) && ! empty( $class::PREREQUISITES[ $method ] ) ) {
			return $class::PREREQUISITES[ $method ];
		}

		return array();
	}

	/**
	 * Dispatch request to target handler after some verification
	 *
	 * @param string $endpoint
	 * @return void
	 */
	public function dispatch( $endpoint, $prerequisites ) {
		// Determine post/get data
		$is_post = isset( $_SERVER['REQUEST_METHOD'] ) ? strtolower( sanitize_text_field( $_SERVER['REQUEST_METHOD'] ) ) === 'post' : null;
		$data    = $is_post ? $_POST : $_GET; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		// Verify nonce first of all
		$nonce   = $data['nonce'] ?? null;
		$action  = $data['nonceAction'] ?? null;
		$matched = $nonce && $action && wp_verify_nonce( $nonce, $action );
		if ( ! $matched ) {
			wp_send_json_error( array( 'message' => __( 'Session Expired! Reloading the page might help resolve.', 'crewhrm' ) ) );
		}

		// Verify required user role
		if ( ! empty( $required_roles = $prerequisites['role'] ?? array() ) ) {
			if ( ! User::validateRole( get_current_user_id(), $required_roles ) ) {
				wp_send_json_error( array( 'message' => __( 'Access Denied!', 'crewhrm' ) ) );
			}
		}

		// Check required data
		if ( ! empty( $required_data_role = $prerequisites['data'] ?? array() ) ) {
			if ( ! Validation::validateData( $data, $required_data_role ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid Data!', 'crewhrm' ) ) );
			}
		}

		// Now pass to the action handler function
		$method = _String::snakeToCamel( $endpoint );
		$class  = self::$endpoints[ $endpoint ];
		if ( class_exists( $class ) && method_exists( $class, $method ) ) {
			$class::$method( $data );
		} else {
			wp_send_json_error( array( 'message' => __( 'Invalid Endpoint!', 'crewhrm' ) ) );
		}
	}
}
