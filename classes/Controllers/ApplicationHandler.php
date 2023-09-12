<?php

namespace CrewHRM\Controllers;

use CrewHRM\Models\Application;

class ApplicationHandler {
	const PREREQUISITES = array(
		'applyToJob' => array(
			'data' => array(
				'application' => 'type:array'
			)
		),
		'getApplicantsList' => array(
			'role' => array(
				'administrator',
				'editor'
			),
			'data' => array(
			)
		),
		'getApplicantSingle' => array(
			'role' => array(
				'administrator',
				'editor'
			),
			'data' => array(
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

	/**
	 * Get applicant list, ideally for the applicant view page sidebar.
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function getApplicantsList( array $data ) {
		$applications = Application::getApplicants( $data['filter'] );

		wp_send_json_success(
			array(
				'applicants' => $applications,
			)
		);
	}

	/**
	 * Get single applicant profile
	 * 
	 * @param array $data Request data
	 * @return void
	 */
	public static function getApplicantSingle( array $data ) {
		wp_send_json_success(
			array(
				'applicant' => Application::getSingleApplicant( $data['job_id'], $data['applicant_id'] )
			)
		);
	}
}