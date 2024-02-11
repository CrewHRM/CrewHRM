<?php
/**
 * Application related request handlers
 *
 * @package crewhrm
 */

namespace CrewHRM\Controllers;

use CrewHRM\Models\Application;
use CrewHRM\Models\Field;
use CrewHRM\Models\FileManager;
use CrewHRM\Models\Job;
use CrewHRM\Models\Pipeline;
use CrewHRM\Models\Settings;
use CrewHRM\Models\User;

/**
 * Application request controller class
 */
class ApplicationHandler {
	const PREREQUISITES = array(
		'getCareersListing'      => array(
			'nopriv' => true,
		),
		'applyToJob'             => array(
			'nopriv' => true,
		),
		'uploadApplicationFile'  => array(
			'nopriv' => true,
		),
		'getApplicationsList'    => array(
			'role' => array(
				'administrator',
			),
		),
		'getApplicationSingle'   => array(
			'role' => array(
				'administrator',
			),
		),
		'moveApplicationStage'   => array(
			'role' => array(
				'administrator',
			),
		),
		'getApplicationPipeline' => array(
			'role' => array(
				'administrator',
			),
		),
		'deleteApplication'      => array(
			'role' => array(
				'administrator',
			),
		),
		'instantSearch'          => array(
			'role' => array(
				'administrator',
			),
		),
	);

	/**
	 * Create application to job.
	 * Note: There is no edit feature for job application. Just create on submission and retreieve in the application view.
	 *
	 * @param array $application Application data array
	 * @param bool  $finalize Whether to mark application as completed, which means no file to upload
	 * @return void
	 */
	public static function applyToJob( array $application, bool $finalize ) {

		do_action( 'crewhrm_submit_application_before', $application );

		$application_id = Application::createApplication( $application );

		if ( empty( $application_id ) ) {
			wp_send_json_error(
				array(
					'notice' => esc_html__( 'Application submission failed!', 'hr-management' ),
				)
			);
			exit;
		}

		// When there's no file to submit, it needs to be finalized right from here as file uploader will not be called.
		if ( true === $finalize ) {
			Application::finalizeApplication( $application_id );
		}

		wp_send_json_success(
			array(
				'application_id' => $application_id,
				'message'        => esc_html__( 'Application has been created.' ),
			)
		);
	}

	/**
	 * Upload application attachment
	 *
	 * @param integer $application_id The application ID to upload file for
	 * @param string  $field_name The file field name like resume or something else
	 * @param boolean $finalize Whether to mark the application is complete when no more file to upload
	 * @param array   $file The file array
	 * @return void
	 */
	public static function uploadApplicationFile( int $application_id, string $field_name, bool $finalize, array $file ) {

		// Check if file is valid
		if ( 0 !== ( $file['error'] ?? null ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Invalid file', 'hr-management' ) ) );
		}

		// Check if application exists and the status is incomplete
		$is_complete = Field::applications()->getField( array( 'application_id' => $application_id ), 'is_complete' );
		if ( null === $is_complete || 0 !== $is_complete ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Invalid request', 'hr-management' ) ) );
		}

		// Process upload now
		Application::uploadApplicationFile( $application_id, $field_name, $file );

		// If file upload complete, mark the application as complete
		if ( true === $finalize ) {
			Application::finalizeApplication( $application_id );
		}

		wp_send_json_success();
	}

	/**
	 * Get application list, ideally for the application view page sidebar.
	 *
	 * @param array $filter Filter args
	 * @return void
	 */
	public static function getApplicationsList( array $filter ) {

		$is_qualified       = 'disqualified' !== ( $filter['qualification'] ?? 'qualified' );
		$applications       = Application::getApplications( $filter );
		$qualified_count    = 0;
		$disqualified_count = 0;

		if ( $is_qualified ) {
			$qualified_count         = count( $applications );
			$filter['qualification'] = 'disqualified';
			$disqualified_count      = Application::getApplications( $filter, true );

		} else {
			$filter['qualification'] = 'qualified';
			$qualified_count         = Application::getApplications( $filter, true );
			$disqualified_count      = count( $applications );
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
	 * @param integer $job_id The job ID to get applications for
	 * @param integer $application_id The application ID to get
	 * @return void
	 */
	public static function getApplicationSingle( int $job_id, int $application_id ) {

		$application = Application::getSingleApplication( $job_id, $application_id );

		if ( empty( $application ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Application not found', 'hr-management' ) ) );
			return;
		}

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
	 * @param integer $job_id The job ID
	 * @param integer $application_id Application ID to move
	 * @param integer $stage_id Stage ID to move to. Zero means to disqualify.
	 * @return void
	 */
	public static function moveApplicationStage( int $job_id, int $application_id, int $stage_id ) {
		Application::changeApplicationStage( $job_id, $application_id, $stage_id );
		wp_send_json_success(
			array(
				'message' => esc_html__( 'Application stage changed successfully!' ),
			)
		);
	}

	/**
	 * Provide application activity/pipeline
	 *
	 * @param int $application_id The application ID to get pipeline of
	 * @return void
	 */
	public static function getApplicationPipeline( int $application_id ) {
		$pipeline = Pipeline::getPipeLine( $application_id );

		if ( ! empty( $pipeline ) ) {
			wp_send_json_success( array( 'pipeline' => $pipeline ) );
		} else {
			wp_send_json_error( array( 'message' => esc_html__( 'No activity', 'hr-management' ) ) );
		}
	}

	/**
	 * Provide listing for careers page
	 *
	 * @param array $filters Filters array
	 * @return void
	 */
	public static function getCareersListing( array $filters ) {

		$jobs = Job::getCareersListing( $filters );

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
	 * @param int $application_id The application ID to delete
	 * @return void
	 */
	public static function deleteApplication( int $application_id ) {
		Application::deleteApplication( $application_id );
		wp_send_json_success(
			array(
				'message' => esc_html__( 'Application deleted', 'hr-management' ),
			)
		);
	}

	/**
	 * Search for usre
	 *
	 * @param array $args Data filter arguments
	 *
	 * @return void
	 */
	public static function instantSearch( array $args ) {

		$exclude = array_filter( ( $args['exclude'] ?? array() ), 'is_numeric' );

		if ( 'users' === $args['source'] ) {
			wp_send_json_success(
				array(
					'results' => User::searchUser( ( $args['keyword'] ?? '' ), ( $args['role'] ?? '' ), $exclude ),
				)
			);
		}

		if ( 'media' === $args['source'] ) {
			wp_send_json_success(
				array(
					'results' => FileManager::searchMedia( ( $args['keyword'] ?? '' ), ( $args['mime_type'] ?? '' ), $exclude ),
				)
			);
		}

		wp_send_json_error( array( 'message' => __( 'Invalid access', 'crewhrm' ) ) );
	}
}
