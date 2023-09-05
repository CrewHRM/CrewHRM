<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

class Application {
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
		global $wpdb;

		// Prepare the jobs array
		$jobs    = _Array::appendArray( $jobs, 'stats', array( 'candidates' => 0 ) );
		$job_ids = array_column( $jobs, 'job_id' );
		$ids_in  = implode( ',', $job_ids );

		// Get the candidates counts per stages
		$counts  = $wpdb->get_results(
			"SELECT job_id, stage_id, COUNT(application_id) as count FROM " . DB::applications() . " WHERE job_id IN ({$ids_in}) GROUP BY job_id, stage_id",
			ARRAY_A
		);
		$counts = _Array::castColumns( $counts, 'intval' );

		// Loop through the rows and gather counts
		foreach ( $counts as $count ) {
			$job_id = $count['job_id'];
			$stage_id = $count['stage_id'];

			// Add the number to total candidate count
			$jobs[ $job_id ]['stats']['candidates'] += $count['count'];

			// Add the number to per stage count
			$jobs[ $job_id ]['stats']['stages'][ $stage_id ] = array( 
				'candidates' => $count['count']
			);
		}

		return $jobs;
	}
}