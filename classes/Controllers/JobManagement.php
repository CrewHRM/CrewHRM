<?php
/**
 * Job controller
 *
 * @package crewhrm
 */

namespace CrewHRM\Controllers;

use CrewHRM\Helpers\_Array;
use CrewHRM\Models\Job;
use CrewHRM\Models\Meta;
use CrewHRM\Models\Settings;
use CrewHRM\Models\Stage;
use CrewHRM\Models\User;

/**
 * Teh controller class
 */
class JobManagement {
	const PREREQUISITES = array(
		'updateJob'           => array(
			'role' => array( 'administrator' ),
		),
		'getJobsDashboard'    => array(),
		'singleJobAction'     => array(),
		'getSingleJobView'    => array(
			'nopriv' => true,
		),
		'getSingleJobEdit'    => array(
			'role' => array( 'administrator' ),
		),
		'deleteHiringStage'   => array(
			'role' => array( 'administrator' ),
		),
		'getJobViewDashboard' => array(
			'role' => 'administrator',
		),
	);

	/**
	 * Create or update a job
	 *
	 * @param array $job Job data array
	 * @return void
	 */
	public static function updateJob( array $job ) {
		// Can access job directly as it is checked by dispatcher already using prerequisities array
		$data       = _Array::sanitizeRecursive( _Array::getArray( $job ), array( 'job_description' ) );
		$new_status = $data['job_status'];
		$is_publish = 'publish' === $new_status;

		// If it is autosave while there is a published version, put it in meta instead to avoid conflict between edited and published version.
		// Editor will show prompt in next opening that there's a cached autosaved version.
		if ( ! empty( $data['job_id'] ) ) {

			$_status = Job::getJobField( $data['job_id'], 'job_status' );

			// Auto save
			if ( 'publish' === $_status && ! $is_publish ) {
				Meta::job( $data['job_id'] )->updateMeta( 'autosaved_job', $data );
				wp_send_json_success();
				return;
			}
		}

		// Create or update job
		$job = Job::createUpdateJob( $data );

		if ( empty( $job ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Failed to save job', 'hr-management' ) ) );
		} else {
			// Delete meta cache as the job saved in job table directly, no matter the job status.
			Meta::job( $job['job_id'] )->deleteMeta( 'autosaved_job' );
		}

		wp_send_json_success(
			array(
				'message'       => $is_publish ? esc_html__( 'Job published', 'hr-management' ) : esc_html__( 'Job saved', 'hr-management' ),
				'job_permalink' => Job::getJobPermalink( $job['job_id'] ),
				'address_id'    => $job['address_id'],
				'stage_ids'     => $job['stage_ids'],
				'job_id'        => $job['job_id'],
			)
		);
	}

	/**
	 * Get job list to render in dashboard
	 *
	 * @param array $filters Job filter args
	 * @return void
	 */
	public static function getJobsDashboard( array $filters ) {
		// Get Initial job list
		$jobs         = Job::getJobs( $filters );
		$segmentation = Job::getJobs( $filters, true );

		wp_send_json_success(
			array(
				'jobs'         => array_values( $jobs ),
				'segmentation' => $segmentation,
			)
		);
	}

	/**
	 * Single job actions like duplicate, delete etc.
	 *
	 * @param integer $job_id Job ID to apply action
	 * @param string  $job_action The action
	 * @return void
	 */
	public static function singleJobAction( int $job_id, string $job_action ) {

		switch ( $job_action ) {
			case 'archive':
			case 'unarchive':
				$do_archive = 'archive' === $job_action;
				Job::toggleArchiveState( $job_id, $do_archive );
				wp_send_json_success(
					array(
						'message' => $do_archive ? esc_html__( 'Job archived', 'hr-management' ) : esc_html__( 'Job removed from archived' ),
					)
				);
				break;

			case 'delete':
				Job::deleteJob( $job_id );
				wp_send_json_success( array( 'message' => esc_html__( 'Job deleted', 'hr-management' ) ) );
				break;

			case 'duplicate':
				$new_job_id = Job::duplicateJob( $job_id );
				if ( ! empty( $new_job_id ) ) {
					wp_send_json_success( array( 'message' => esc_html__( 'Job duplicated', 'hr-management' ) ) );
				} else {
					wp_send_json_error( array( 'message' => 'Failed to duplicate' ) );
				}
				break;
		}
	}

	/**
	 * Get the job for single view and application process
	 *
	 * @param integer $job_id The job ID to get data
	 * @param integer $preview Whether it is preview mode
	 * @return void
	 */
	public static function getSingleJobView( int $job_id, int $preview = 0 ) {

		$job = Job::getJobById( $job_id );

		// Determine if the current user can visit the job
		$can_visit  = ! empty( $job );
		$privileged = User::validateRole( get_current_user_id(), apply_filters( 'crewhrm_hr_roles', array( 'administrator' ) ) );

		// Only admin and hr manager(pro) can visit the job even if not published
		if ( $can_visit && 'publish' !== $job['job_status'] ) {
			// If not published yet, then only privieleged users can see the job.
			$can_visit = $privileged;
		}

		// Provide preview content for admin and editor
		// Only the privileged users can see preview content which is not in the main job yet.
		if ( $can_visit && 1 === $preview && $privileged ) {
			$autosaved = Meta::job( $job_id )->getMeta( 'autosaved_job' );
			if ( ! empty( $autosaved ) ) {
				$job = $autosaved;
			}
		}

		// Set accept pdf for resume
		$fields       = &$job['application_form']['documents']['fields'];
		$resume_index = _Array::findIndex( $fields, 'id', 'resume' );
		if ( isset( $fields[ $resume_index ] ) ) {
			$fields[ $resume_index ]['accept'] = '.pdf';
		}

		// Pass through hooks to add features from pro
		$job = apply_filters( 'crewhrm_single_job_view', $job );

		if ( ! $can_visit ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Job not found' ) ) );
		} else {
			wp_send_json_success(
				array(
					'job'           => $job,
					'about_company' => Settings::getSettings( 'about_company' ),
				)
			);
		}
	}

	/**
	 * Get job for edit purpose
	 *
	 * @param integer $job_id The job ID to get edit data
	 * @return void
	 */
	public static function getSingleJobEdit( int $job_id ) {

		$job = Job::getEditableJob( $job_id );

		if ( empty( $job ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Job not found to edit', 'hr-management' ) ) );
		}

		wp_send_json_success(
			array(
				'job'           => $job,
				'autosaved_job' => Meta::job( $job_id )->getMeta( 'autosaved_job' ),
			)
		);
	}

	/**
	 * Delete hiring stage from individual job
	 *
	 * @param integer $job_id The job ID to delete stage from
	 * @param integer $stage_id The stage ID to delete
	 * @param integer $move_to The stage ID to move existing applications
	 * @return void
	 */
	public static function deleteHiringStage( int $job_id, int $stage_id, int $move_to = null ) {

		// Run delete
		$deletion = Stage::deleteStage(
			$job_id,
			$stage_id,
			$move_to
		);

		if ( true === $deletion ) {
			// Deleted successfully as there are no application in the stage
			wp_send_json_success();

		} elseif ( is_array( $deletion ) ) {
			// There are applications in the stage
			wp_send_json_error( array( 'overview' => $deletion ) );

		} else {
			$message = false === $deletion ? esc_html__( 'Stage not found to move to', 'hr-management' ) : esc_html__( 'Something went wrong!', 'hr-management' );
			wp_send_json_error( array( 'message' => $message ) );
		}
	}

	/**
	 * Return job data for single view
	 *
	 * @param integer $job_id The job ID
	 * @return void
	 */
	public static function getJobViewDashboard( int $job_id ) {
		$stats = Stage::getStageStatsByJobId( $job_id );

		wp_send_json_success(
			array(
				'job_list'   => Job::getJobsMinimal(),
				'stages'     => $stats['stages'] ?? array(),
				'candidates' => $stats['candidates'] ?? 0,
				'job'        => Job::getJobById( $job_id ),
			)
		);
	}
}
