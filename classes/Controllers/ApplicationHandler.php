<?php

namespace CrewHRM\Controllers;

use CrewHRM\Models\Application;

class ApplicationHandler {
	const PREREQUISITES = array(
		'applyToJob'           => array(
			'data' => array(
				'application' => 'type:array',
			),
		),
		'getApplicationsList'  => array(
			'role' => array(
				'administrator',
				'editor',
			),
			'data' => array(),
		),
		'getApplicationSingle' => array(
			'role' => array(
				'administrator',
				'editor',
			),
			'data' => array(),
		),
	);

	/**
	 * Create application to job. 
	 * Note: There is no edit feature for job application. Just create on submission and retreieve in the application view.
	 *
	 * @param array $data
	 * @return void
	 */
	public static function applyToJob( array $data ) {
		$application_id = Application::createApplication( $data['application'] );

		if ( empty( $application_id ) ) {
			wp_send_json_error( array( 'notice' => __( 'Application submission failed!', 'crewhrm' ) ) );
		} else {
			wp_send_json_success( array( 'message' => __( 'Application submitted successfully' ) ) );
		}
	}

	/**
	 * Get application list, ideally for the application view page sidebar.
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function getApplicationsList( array $data ) {
		$applications = Application::getApplications( $data['filter'] );

		wp_send_json_success(
			array(
				'applications' => $applications,
			)
		);
	}

	/**
	 * Get single application profile
	 * 
	 * @param array $data Request data
	 * @return void
	 */
	public static function getApplicationSingle( array $data ) {
		wp_send_json_success(
			array(
				'application' => Application::getSingleApplication( $data['job_id'], $data['application_id'] ),
			)
		);
	}
}
