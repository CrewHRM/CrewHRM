<?php

namespace CrewHRM\Controllers;

use CrewHRM\Models\Application;
use CrewHRM\Models\Mail;
use CrewHRM\Models\Settings;

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
		'moveApplicationStage' => array(
			'role' => array(
				'administrator',
				'editor',
			),
			'data' => array(),
		),
		'mailToApplicant' => array(
			'role' => array(
				'administrator',
				'editor',
			),
			'data' => array(
				'mail' => 'type:array'
			),
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
		$application = Application::getSingleApplication( $data['job_id'], $data['application_id'] );
		$application['recruiter_email'] = Settings::getRecruiterEmail();

		wp_send_json_success(
			array(
				'application' => $application,
			)
		);
	}

	/**
	 * Move singular application stage
	 *
	 * @param array $data
	 * @return void
	 */
	public static function moveApplicationStage( array $data ) {
		Application::changeApplicationStage( $data['job_id'], $data['application_id'], $data['stage_id'] );
		wp_send_json_success( array( 'message' => __( 'Application stage changed successfully!' ) ) );
	}

	/**
	 * Send mail to applicant from single application view interface
	 *
	 * @param array $data
	 * @return void
	 */
	public static function mailToApplicant( array $data ) {
		// To Do: Add attachment support
		$sent = (new Mail( $data['mail'] ))->send();

		if ( $sent ) {
			wp_send_json_success( array( 'message' => __( 'Email sent!', 'crewhrm' ) ) );
		} else {
			wp_send_json_error( array( 'message' => __( 'Failed to send mail!', 'crewhrm' ) ) );
		}
	}
}
