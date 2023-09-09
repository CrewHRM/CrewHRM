<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

class Application {
	/**
	 * Create an application
	 *
	 * @param array $application
	 * @return bool
	 */
	public static function createApplication( array $application ) {
		$address_id = Address::createUpdateAddress( $application );

		$application = array(
			'job_id'         => $application['job_id'],
			'address_id'     => $address_id,
			'stage_id'       => null, // Initially no stage.
			'first_name'     => $application['first_name'] ?? '',
			'last_name'      => $application['last_name'] ?? '',
			'email'          => $application['email'] ?? '',
			'phone'          => $application['phone'] ?? '',
			'gender'         => $application['phone'] ?? null,
			'date_of_birth'  => $application['date_of_birth'] ?? null,
			'cover_letter'   => $application['cover_letter'] ?? null,
			'resume_file_id' => 0,
		);

		global $wpdb;
		$wpdb->insert(
			DB::applications(),
			$application
		);

		return $wpdb->insert_id;
	}

	/**
	 * Delete job applications by job ID
	 *
	 * @param [type] $job_id
	 * @return void
	 */
	public static function deleteApplicationByJobId( $job_id ) {
		$app_ids = self::getApplicationsIdsByJobId( $job_id );
		self::deleteApplication( $app_ids );
	}

	/**
	 * Delete job by ID
	 *
	 * @param int|array $application_id Application ID or array of IDs
	 * @return void
	 */
	public static function deleteApplication( $application_id ) {
		global $wpdb;

		$ids         = is_array( $application_id ) ? $application_id : array( $application_id );
		$ids_in      = implode( ',', $ids );
		$address_ids = $wpdb->get_col( "SELECT address_id FROM " . DB::applications() . " WHERE application_id IN ({$ids_in}) AND address_id>0" );

		// Delete associated address
		Address::deleteAddress( $address_ids );

		// Delete resume

		// Delete attachments

		// Delete pipelines
		$wpdb->query(
			"DELETE FROM " . DB::pipeline() . " WHERE application_id IN({$ids_in})"
		);

		// Delete application finally
		$wpdb->query(
			"DELETE FROM " . DB::applications() . " WHERE application_id IN({$ids_in})"
		);
	}

	/**
	 * Get application ids of a job post
	 *
	 * @param int $job_id
	 * @return array
	 */
	public static function getApplicationsIdsByJobId( $job_id ) {
		global $wpdb;

		return $wpdb->get_col(
			$wpdb->prepare(
				"SELECT application_id FROM " . DB::applications() . " WHERE job_id=%d",
				$job_id
			)
		);
	}

	/**
	 * Get total count of applications per stages.
	 *
	 * @param array $jobs
	 * @return array
	 */
	public static function appendApplicantCounts( array $jobs ) {
		// Prepare the jobs array
		$jobs    = _Array::appendArray( $jobs, 'stats', array( 'candidates' => 0, 'stages' => array() ) );
		$job_ids = array_column( $jobs, 'job_id' );

		// Get stats
		$stats      = Stage::getStageStatsByJobId( $job_ids );
		$candidates = $stats['candidates'] ?? 0;
		$stages     = $stats['stages'] ?? array();

		// Loop through total candidate counts per job regardless of stage
		foreach ( $candidates as $job_id => $total ) {

			// Assign the total candidate count per job
			$jobs[ $job_id ]['stats']['candidates'] = $total;

			// Loop thorugh the stages under the job
			foreach ( $stages[ $job_id ] as $stage ) {
				$jobs[ $job_id ]['stats']['stages'][ $stage['stage_id'] ] = $stage;
			}
		}

		return $jobs;
	}
}