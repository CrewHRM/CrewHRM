<?php

namespace CrewHRM\Controllers;

use CrewHRM\Models\Application;

class ApplicationHandler {
	const PREREQUISITES = array(
		'applyToJob' => array(
			'data' => array(
				'application' => 'type:array'
			)
		)
	);

	/**
	 * Create application to job. 
	 * Note: There is no edit feature for job application. Just create on submission and retreieve in the applicant view.
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
}