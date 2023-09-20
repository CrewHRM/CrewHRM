<?php

namespace CrewHRM\Controllers;

use CrewHRM\Helpers\File;
use CrewHRM\Models\Application;
use CrewHRM\Models\Comment;
use CrewHRM\Models\Job;
use CrewHRM\Models\Mail;
use CrewHRM\Models\Pipeline;
use CrewHRM\Models\Settings;

class ApplicationHandler {
	const PREREQUISITES = array(
		'applyToJob'           => array(
			'nopriv' => true,
			'data' => array(
				'application' => 'type:array',
				'resume'      => 'type:file',
				'attachments' => 'type:array/file'
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
		'commentOnApplication' => array(
			'role' => array(
				'administrator',
				'editor',
			),
		),
		'getApplicationPipeline' => array(
			'role' => array(
				'administrator',
				'editor',
			),
		),
		'getCareersListing' => array(
			'nopriv' => true,
			'data' => array(
				'filters' => 'type:array',
			)
		)
	);

	/**
	 * Create application to job. 
	 * Note: There is no edit feature for job application. Just create on submission and retreieve in the application view.
	 *
	 * @param array $data
	 * @return void
	 */
	public static function applyToJob( array $data ) {
		$files          = File::organizeUploadedFiles( $_FILES['application'] ?? array() );
		$application_id = Application::createApplication( $data['application'], $files );

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
		// Mail array
		$mail = $data['mail'];

		// Prepare attachment
		if ( isset( $_FILES['attachment'] ) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK ) {
			$mail['attachment_path'] = $_FILES['attachment']['tmp_name'];
		}

		// To Do: Add attachment support
		$sent = (new Mail( $data['mail'] ))->send();

		if ( $sent ) {
			wp_send_json_success( array( 'message' => __( 'Email sent!', 'crewhrm' ) ) );
		} else {
			wp_send_json_error( array( 'message' => __( 'Failed to send mail!', 'crewhrm' ) ) );
		}
	}

	/**
	 * Create comment on application from single application view
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function commentOnApplication( array $data ) {
		// Create or update comment
		$comment_id = Comment::createUpdateComment( $data );

		if ( ! empty( $comment_id ) ) {
			wp_send_json_success( array( 'message' => __( 'Comment submitted successfully!', 'crewhrm' ) ) );
		} else {
			wp_send_json_error( array( 'message' => __( 'Failed to process comment!', 'crewhrm' ) ) );
		}
	}

	/**
	 * Provide application activity/pipeline
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function getApplicationPipeline( array $data ) {
		$pipeline = Pipeline::getPipeLine( $data['application_id'] );

		if ( ! empty( $pipeline ) ) {
			wp_send_json_success( array( 'pipeline' => $pipeline ) );
		} else {
			wp_send_json_error( array( 'message' => __( 'No activity', 'crewhrm' ) ) );
		}
	}

	/**
	 * Provide listing for careers page
	 *
	 * @param array $data
	 * @return void
	 */
	public static function getCareersListing( array $data ) {
		$jobs = Job::getCareersListing( $data['filters'] );

		// 
		wp_send_json_success(
			array(
				'jobs' => array_values( $jobs['jobs'] ),
				'departments' => $jobs['departments']
			)
		);
	}
}
