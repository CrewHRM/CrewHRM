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
			'role' => array( 'administrator', 'editor' ),
		),
		'getJobsDashboard'    => array(),
		'singleJobAction'     => array(),
		'getSingleJobView'    => array(
			'nopriv' => true,
		),
		'getSingleJobEdit'    => array(
			'role' => array( 'administrator', 'editor' ),
		),
		'deleteHiringStage'   => array(
			'role' => array( 'administrator', 'editor' ),
		),
		'getJobViewDashboard' => array(
			'role' => 'administrator',
		),
	);

	/**
	 * Create or update a job
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function updateJob( array $data ) {
		// Can access job directly as it is checked by dispatcher already using prerequisities array
		$data       = _Array::sanitizeRecursive( _Array::getArray( $data['job'] ), array( 'job_description' ) );
		$new_status = $data['job_status'];
		$is_publish = 'publish' === $new_status;

		// If it is autosave while there is a published version, put it in meta instead to avoid conflict between edited and published version.
		// Editor will show prompt in next opening that there's a cached autosaved version.
		if ( ! empty( $data['job_id'] ) ) {

			$_status = Job::getFiled( $data['job_id'], 'job_status' );

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
			wp_send_json_error( array( 'message' => __( 'Failed to save job', 'crewhrm' ) ) );
		} else {
			// Delete meta cache as the job saved in job table directly, no matter the job status.
			Meta::job( $job['job_id'] )->deleteMeta( 'autosaved_job' );
		}

		wp_send_json_success(
			array(
				'message'    => $is_publish ? __( 'Job published', 'crewhrm' ) : __( 'Job saved', 'crewhrm' ),
				'address_id' => $job['address_id'],
				'stage_ids'  => $job['stage_ids'],
				'job_id'     => $job['job_id'],
			)
		);
	}

	/**
	 * Get job list to render in dashboard
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function getJobsDashboard( array $data ) {
		// Get Initial job list
		$jobs         = Job::getJobs( $data['filters'] );
		$segmentation = Job::getJobs( $data['filters'], array(), true );

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
	 * @param array $data Request data
	 * @return void
	 */
	public static function singleJobAction( $data ) {
		$job_id = $data['job_id'];
		$action = $data['job_action'];

		switch ( $action ) {
			case 'archive':
			case 'unarchive':
				$do_archive = 'archive' === $action;
				Job::toggleArchiveState( $job_id, $do_archive );
				wp_send_json_success(
					array(
						'message' => $do_archive ? __( 'Job archived', 'crewhrm' ) : __( 'Job removed from archived' ),
					)
				);
				break;

			case 'delete':
				Job::deleteJob( $job_id );
				wp_send_json_success( array( 'message' => __( 'Job deleted', 'crewhrm' ) ) );
				break;

			case 'duplicate':
				$new_job_id = Job::duplicateJob( $job_id );
				if ( ! empty( $new_job_id ) ) {
					wp_send_json_success( array( 'message' => __( 'Job duplicated', 'crewhrm' ) ) );
				} else {
					wp_send_json_error( array( 'message' => 'Failed to duplicate' ) );
				}
				break;
		}
	}

	/**
	 * Get the job for single view and application process
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function getSingleJobView( array $data ) {
		$job_id = $data['job_id'];
		$job    = Job::getJobById( $job_id );

		// Determine if the current user can visit the job
		$can_visit  = ! empty( $job );
		$privileged = User::validateRole( get_current_user_id(), array( 'administrator', 'editor' ) );

		// Only admin and editor can visit the job even if not published
		if ( $can_visit && 'publish' !== $job['job_status'] ) {
			// If not published yet, then only privieleged users can see the job.
			$can_visit = $privileged;
		}

		// Provide preview content for admin and editor
		// Only the privileged users can see preview content which is not in the main job yet.
		if ( $can_visit && (int) ( $data['preview'] ?? 0 ) === 1 && $privileged ) {
			$autosaved = Meta::job( $job_id )->getMeta( 'autosaved_job' );
			if ( ! empty( $autosaved ) ) {
				$job = $autosaved;
			}
		}

		// Assign acceptable attachment formats
		$documents        = &$job['application_form']['documents']['fields'];
		$attachment_index = _Array::findIndex( $documents, 'id', 'file_attachment' );
		if ( isset( $documents[ $attachment_index ] ) ) {
			$documents[ $attachment_index ]['accept'] = Settings::getApplicationAttachmentFormats();
		}

		if ( ! $can_visit ) {
			wp_send_json_error( array( 'message' => __( 'Job not found' ) ) );
		} else {
			wp_send_json_success(
				array(
					'job'           => $job,
					'about_company' => Settings::getCompanyProfile( 'about_company' ),
				)
			);
		}
	}

	/**
	 * Get job for edit purpose
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function getSingleJobEdit( array $data ) {
		$job_id = $data['job_id'];
		$job    = Job::getEditableJob( $job_id );

		if ( empty( $job ) ) {
			wp_send_json_error( array( 'message' => __( 'Job not found to edit', 'crewhrm' ) ) );
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
	 * @param array $data Request data
	 * @return void
	 */
	public static function deleteHiringStage( array $data ) {

		// Run delete
		$deletion = Stage::deleteStage(
			$data['job_id'],
			$data['stage_id'],
			$data['move_to'] ?? null
		);

		if ( true === $deletion ) {
			// Deleted successfully as there are no application in the stage
			wp_send_json_success();

		} elseif ( is_array( $deletion ) ) {
			// There are applications in the stage
			wp_send_json_error( array( 'overview' => $deletion ) );

		} else {
			$message = false === $deletion ? __( 'Stage not found to move to', 'crewhrm' ) : __( 'Something went wrong!' );
			wp_send_json_error( array( 'message' => $message ) );
		}
	}

	/**
	 * Return job data for single view
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function getJobViewDashboard( array $data ) {
		$stats = Stage::getStageStatsByJobId( $data['job_id'] );

		wp_send_json_success(
			array(
				'job_list'   => Job::getJobsMinimal(),
				'stages'     => $stats['stages'] ?? array(),
				'candidates' => $stats['candidates'] ?? 0,
				'job'        => Job::getJobById( $data['job_id'] ),
			)
		);
	}
}
