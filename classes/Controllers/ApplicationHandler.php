<?php
/**
 * Application related request handlers
 *
 * @package crewhrm
 */

namespace CrewHRM\Controllers;

use CrewHRM\Helpers\File;
use CrewHRM\Models\Application;
use CrewHRM\Models\Comment;
use CrewHRM\Models\Job;
use CrewHRM\Models\Mail;
use CrewHRM\Models\Pipeline;
use CrewHRM\Models\Settings;

/**
 * Application request controller class
 */
class ApplicationHandler {
	const PREREQUISITES = array(
		'applyToJob'             => array(
			'nopriv' => true,
		),
		'getApplicationsList'    => array(
			'role' => array(
				'administrator',
				'editor',
			),
		),
		'getApplicationSingle'   => array(
			'role' => array(
				'administrator',
				'editor',
			),
		),
		'moveApplicationStage'   => array(
			'role' => array(
				'administrator',
				'editor',
			),
		),
		'mailToApplicant'        => array(
			'role' => array(
				'administrator',
				'editor',
			),
		),
		'commentOnApplication'   => array(
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
		'getCareersListing'      => array(
			'nopriv' => true,
		),
		'deleteApplication'      => array(
			'role' => array(
				'administrator',
				'editor',
			),
		),
	);

	/**
	 * Create application to job.
	 * Note: There is no edit feature for job application. Just create on submission and retreieve in the application view.
	 *
	 * @param array $data  Request data containing application informations
	 * @param array $files Request files
	 * @return void
	 */
	public static function applyToJob( array $data, array $files ) {
		$files          = File::organizeUploadedHierarchy( $files['application'] ?? array() );
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
		$filter             = $data['filter'];
		$is_qualified       = 'disqualified' !== $filter;
		$applications       = Application::getApplications( $filter );
		$qualified_count    = 0;
		$disqualified_count = 0;

		if ( $is_qualified ) {
			$qualified_count    = count( $applications );
			$disqualified_count = Application::getApplications( array_merge( $filter, array( 'qualification' => 'disqualified' ) ), true );
		} else {
			$qualified_count    = Application::getApplications( array_merge( $filter, array( 'qualification' => 'qualified' ) ), true );
			$disqualified_count = count( $applications );
		}

		wp_send_json_success(
			array(
				'applications'       => $applications,
				'qualified_count'    => $qualified_count,
				'disqualified_count' => $disqualified_count,
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
		$application                    = Application::getSingleApplication( $data['job_id'], $data['application_id'] );
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
	 * @param array $data Request data containing applications stage info
	 * @return void
	 */
	public static function moveApplicationStage( array $data ) {
		Application::changeApplicationStage( $data['job_id'], $data['application_id'], $data['stage_id'] );
		wp_send_json_success( array( 'message' => __( 'Application stage changed successfully!' ) ) );
	}

	/**
	 * Send mail to applicant from single application view interface
	 *
	 * @param array $data  Request datacontaining mail data
	 * @param array $files Request files
	 * @return void
	 */
	public static function mailToApplicant( array $data, array $files ) {

		// Prepare attachment
		$attachments = File::organizeUploadedHierarchy( $files['mail'] ?? array(), false );
		$tmp_names   = array_column( $attachments['attachments'] ?? array(), 'tmp_name' );

		// Prepare mailer arg
		$args = array_merge(
			$data['mail'],
			array( 'attachments' => $tmp_names )
		);

		$sent = ( new Mail( $args ) )->send();

		if ( $sent ) {
			wp_send_json_success( array( 'message' => __( 'Email sent!', 'crewhrm' ) ) );
		} else {
			wp_send_json_error( array( 'message' => __( 'Failed to send mail!', 'crewhrm' ) ) );
		}
	}

	/**
	 * Create comment on application from single application view
	 *
	 * @param array $data Request data containing comments
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
	 * @param array $data Request data containing careers filter arguments
	 * @return void
	 */
	public static function getCareersListing( array $data ) {
		$jobs = Job::getCareersListing( $data['filters'] );

				wp_send_json_success(
					array(
						'jobs'        => array_values( $jobs['jobs'] ),
						'departments' => $jobs['departments'],
					)
				);
	}

	/**
	 * Delete single application from single applicant view or maybe from application list.
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function deleteApplication( array $data ) {
		Application::deleteApplication( $data['application_id'] );
		wp_send_json_success( array( 'message' => __( 'Application deleted', 'crewhrm' ) ) );
	}
}
