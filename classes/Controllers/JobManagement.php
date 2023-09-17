<?php

namespace CrewHRM\Controllers;

use CrewHRM\Models\Address;
use CrewHRM\Models\Job;
use CrewHRM\Models\Meta;
use CrewHRM\Models\Settings;
use CrewHRM\Models\Stage;

class JobManagement {
	const PREREQUISITES = array(
		'updateJob'           => array(
			'role' => array( 'administrator', 'editor' ),
			'data' => array(
				'job' => 'type:array',
			),
		),
		'getJobsDashboard'    => array(),
		'singleJobAction'     => array(),
		'getSingleJobView'    => array(),
		'getSingleJobEdit'    => array(
			'role' => array( 'administrator', 'editor' ),
			'data' => array(
				'job_id' => 'type:numeric',
			),
		),
		'deleteHiringStage'   => array(
			'role' => array( 'administrator', 'editor' ),
			'data' => array(
				'job_id'   => 'type:numeric',
				'stage_id' => 'type:numeric',
				'move_to'  => 'type:numeric|optional:true',
			),
		),
		'getJobViewDashboard' => array(
			'role' => 'administrator',
			'data' => array(
				'job_id' => 'type:numeric',
			),
		),
	);

	/**
	 * Create or update a job
	 *
	 * @param array $data
	 * @return void
	 */
	public static function updateJob( array $data ) {
		// Can access job directly as it is checked by dispatcher already using prerequisities array
		$data       = $data['job'];
		$new_status = $data['job_status'];
		$is_publish = $new_status === 'publish';

		// If it is autosave while there is a published version, put it in meta instead to avoid conflict between edited and published version.
		// Editor will show prompt in next opening that there's a cached autosaved version. 
		if ( ! empty( $data['job_id'] ) ) {

			$_status = Job::getFiled( $data['job_id'], 'job_status' );

			// Auto save
			if ( $_status === 'publish' && ! $is_publish ) {
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
			error_log('Here');
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
	 * Get job list to render in dashboard and careers page
	 *
	 * @return void
	 */
	public static function getJobsDashboard() {
		// Get Initial job list
		$jobs = Job::getJobs();

		wp_send_json_success( array( 'jobs' => array_values( $jobs ) ) );
	}

	public static function singleJobAction( $data ) {
		$job_id = $data['job_id'];
		$action = $data['job_action'];
		
		switch ( $action ) {
			case 'archive':
			case 'unarchive':
				$do_archive = $action === 'archive';
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

		if ( empty( $job ) ) {
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
	 * @param array $data
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
				'job'            => $job,
				'autosaved_job' => Meta::job( $job_id )->getMeta( 'autosaved_job' )
			)
		);
	}

	/**
	 * Delete hiring stage from individual job
	 *
	 * @param array $data
	 * @return void
	 */
	public static function deleteHiringStage( array $data ) {

		// Run delete
		$deletion = Stage::deleteStage(
			$data['job_id'],
			$data['stage_id'], 
			$data['move_to'] ?? null
		);

		if ( $deletion === true ) {
			// Deleted successfully as there are no application in the stage
			wp_send_json_success();

		} elseif ( is_array( $deletion ) ) {
			// There are applications in the stage
			wp_send_json_error( array( 'overview' => $deletion ) );
			
		} else {
			$message = $deletion === false ? __( 'Stage not found to move to', 'crewhrm' ) : __( 'Something went wrong!' );
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
