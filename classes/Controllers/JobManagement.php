<?php

namespace CrewHRM\Controllers;

use CrewHRM\Models\Address;
use CrewHRM\Models\Job;
use CrewHRM\Models\Meta;

class JobManagement {
	const PREREQUISITES = array(
		'updateJob' => array(
			'role' => array( 'administrator', 'editor' ),
			'data' => array(
				'job' => 'type:array'
			)
		),
		'getJobsDashboard' => array(),
		'singleJobAction' => array()
	);

	/**
	 * Create or update a job
	 *
	 * @param array $data
	 * @return void
	 */
	public static function updateJob( array $data ) {
		// Can access directly as it is checked by dispatcher already usning prerequisities array
		$data = $data['job'];

		// If it is autosave while there is a published version, put it in meta instead to avoid conflict between edited and published version.
		// Editor will show prompt in next opening that there's a cached autosaved version. 
		if ( ! empty( $data['job_id'] ) ) {
			$status = Job::getJobFiled( $data['job_id'], 'job_status' );
			if ( $status !== 'draft' ) {
				Meta::updateJobMeta( $data['job_id'], 'autosaved_job', $data );
				wp_send_json_success();
				return;
			}
		}

		// Firstly Create/Update the address
		$data['address_id'] = Address::createUpdateAddress( $data );
		$is_auto    = ( $data['auto_save'] ?? false ) == true;
		
		// Create or update job
		$job_id  = Job::createUpdateJob( $data );
		if ( empty( $job_id ) ) {
			$message = $is_auto ? __( 'Auto save failed', 'crewhrm' ) :  __( 'Failed to publish job', 'crewhrm' );
			wp_send_json_error( array( 'message' => $message ) );
		}

		wp_send_json_success(
			array(
				'message'    => $is_auto ? __( 'Saved job automatically' ) : __( 'Job published' ),
				'address_id' => $data['address_id'],
				'job_id'     => $job_id
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
			case 'archive' :
			case 'unarchive' :
				$do_archive = $action === 'archive';
				Job::toggleArchiveState( $job_id, $do_archive );
				wp_send_json_success(
					array(
						'message' => $do_archive ? __( 'Job archived', 'crewhrm' ) : __( 'Job removed from archived' ),
					)
				);
				break;

			case 'delete' :
				Job::deleteJob( $job_id );
				wp_send_json_success( array( 'message' => __( 'Job deleted', 'crewhrm' ) ) );
				break;

			case 'duplicate' :
				$new_job_id = Job::duplicateJob( $job_id );
				if ( ! empty( $new_job_id ) ) {
					wp_send_json_success( array( 'message' => __( 'Job duplicated', 'crewhrm' ) ) );
				} else {
					wp_send_json_error( array( 'message' => 'Failed to duplicate' ) );
				}
				break;
		}
	}
}
