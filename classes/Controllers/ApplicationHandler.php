<?php
/**
 * Application related request handlers
 *
 * @package crewhrm
 */

namespace CrewHRM\Controllers;

use CrewHRM\Helpers\Number;
use CrewHRM\Models\Application;
use CrewHRM\Models\Field;
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
		'uploadApplicationFile' => array(
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
		'searchUser'             => array(
			'role' => array(
				'administrator',
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
	public static function applyToJob( array $data ) {
		$application_id = Application::createApplication( $data['application'] );

		if ( empty( $application_id ) ) {
			wp_send_json_error(
				array( 
					'notice' => __( 'Application submission failed!', 'crewhrm' ) 
				)
			);
		} else {
			wp_send_json_success( 
				array( 
					'application_id' => $application_id,
					'message'        => __( 'Application has been created in draft mode. Watinging for file uploads.' ),
				)
			);
		}
	}

	/**
	 * Upload application attachment
	 *
	 * @param array $data Request Data
	 * @param array $file Request files
	 * @return void
	 */
	public static function uploadApplicationFile( array $data, array $file ) {
		$application_id = Number::getInt( $data['application_id'] ?? 0 );
		$field_name     = $data['field_name'] ?? null;
		$finalize       = $data['finalize'] ?? false;
		
		// Check if file is valid
		if ( ! is_array( $file['file'] ?? null ) || 0 !== ( $file['file']['error'] ?? null ) ) {
			wp_send_json_error( array( 'message' => __( 'Invalid file', 'crewhrm' ) ) );
		}

		// Check if application exists and the status is incomplete
		$is_complete = Field::applications()->getField( array( 'application_id' => $application_id ), 'is_complete' );
		if ( null === $is_complete || 0 !== $is_complete ) {
			wp_send_json_error( array( 'message' => __( 'Invalid request', 'crewhrm' ) ) );
		}

		// Process upload now
		Application::uploadApplicationFile( $application_id, $field_name, $file['file'] );

		// If file upload complete, mark the application as complete
		if ( $finalize === true ) {
			Field::applications()->updateField(
				array( 'is_complete' => 1 ),
				array( 'application_id' => $application_id )
			);
		}

		wp_send_json_success();
	}

	/**
	 * Get application list, ideally for the application view page sidebar.
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function getApplicationsList( array $data ) {
		$filter             = $data['filter'];
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
	 * @param array $data Request data
	 * @return void
	 */
	public static function getApplicationSingle( array $data ) {
		$application = Application::getSingleApplication( $data['job_id'], $data['application_id'] );

		if ( empty( $application ) ) {
			wp_send_json_error( array( 'message' => __( 'Application not found', 'crewhrm' ) ) );
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
	 * @param array $data Request data containing applications stage info
	 * @return void
	 */
	public static function moveApplicationStage( array $data ) {
		Application::changeApplicationStage( $data['job_id'], $data['application_id'], $data['stage_id'] );
		wp_send_json_success( array( 'message' => __( 'Application stage changed successfully!' ) ) );
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

	/**
	 * Search for usrs
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function searchUser( array $data ) {
		$keyword = $data['keyword'] ?? '';
		$exclude = $data['exclude'] ?? array();
		$users = User::searchUser( $keyword, is_array( $exclude ) ? $exclude : array() );

		wp_send_json_success( array( 'users' => $users ) );
	}
}
