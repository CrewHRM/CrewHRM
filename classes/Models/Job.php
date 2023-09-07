<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;
use CrewHRM\Helpers\Utilities;

/**
 * Job class to manage job related database interactions.
 * 
 * Note: The post data to create/update job, the autosave version in the meta and the return value of getEditableJob method must be the same structure. 
 */
class Job {

	/**
	 * Create or update a job
	 *
	 * @param array $job
	 * @return array
	 */
	public static function createUpdateJob( array $job ) {

		$salary = $job['salary'] ?? '';
		$salary = explode( '-', $salary );
		
		$_job = array(
			'job_title'            => $job['job_title'] ?? '',
			'job_description'      => $job['job_description'] ?? '',
			'job_status'           => $job['job_status'] ?? 'draft',
			'job_code'             => $job['job_code'] ?? null,
			'department_id'        => ( ! empty( $job['department_id'] ) && is_numeric( $job['department_id'] ) ) ? $job['department_id'] : null,
			'vacancy'              => ( ! empty( $job['vacancy'] ) && is_numeric( $job['vacancy'] ) ) ? $job['vacancy'] : null,
			'salary_a'             => is_numeric( $salary[0] ?? null ) ? $salary[0] : null,
			'salary_b'             => is_numeric( $salary[1] ?? null ) ? $salary[1] : null,
			'salary_basis'         => $job['salary_basis'] ?? null,
			'employment_type'      => $job['employment_type'] ?? null,
			'experience_years'     => $job['experience_years'] ?? null,
			'experience_level'     => $job['experience_level'] ?? null,
			'application_deadline' => $job['application_deadline'] ?? null,
			'application_form'     => maybe_serialize( $job['application_form'] ),
			'job_status'           => $job['job_status'] ?? 'draft',
			'currency'             => $job['currency'] ?? null,
		);

		global $wpdb;

		// Firstly Create/Update the address
		$job_id     = $job['job_id'] ?? null;
		$address_id = Address::createUpdateAddress( $job );
		if ( ! empty( $address_id ) ) {
			$_job['address_id'] = $address_id;
		}

		// Update the job now if it is present
		if ( ! empty( $job_id ) ) {
			$wpdb->update(
				DB::jobs(),
				$_job,
				array( 'job_id' => $job_id )
			);
		} else {
			// Insert new if the id empty
			$wpdb->insert(
				DB::jobs(),
				$_job
			);

			// Set the newly created ID
			$job_id = $wpdb->insert_id;
		}

		// Insert Job meta
		$to_store = [ 'attendance_type' ];
		foreach ( $to_store as $field_name ) {
			JobMeta::updateJobMeta( $job_id, $field_name, ( $job[ $field_name ] ?? null ) );
		}

		// Insert stages
		$stage_ids = Stage::createUpdateStages( $job_id, $job['hiring_flow'] ?? array() );
		
		return array(
			'job_id'     => $job_id,
			'address_id' => $address_id,
			'stage_ids'  => $stage_ids
		);
	}

	/**
	 * Get editable job. Just the reverse version of the job that can be saved using createUpdateJob method.
	 *
	 * @param int $job_id
	 * @return array
	 */
	public static function getEditableJob( $job_id ) {
		global $wpdb;
		$job = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM " . DB::jobs() . " WHERE job_id=%d",
				$job_id
			),
			ARRAY_A
		);
		if ( empty( $job ) ) {
			return null;
		}

		$job = _Array::castRecursive( $job );

		// Unserialize application form 
		$application_form = maybe_unserialize( $job['application_form'] );
		$job['application_form'] = is_array( $application_form ) ? _Array::castRecursive( $application_form ) : null;
		$job['salary'] = ( $job['salary_a'] ?? '' ) . ( ( ! empty( $job['salary_a'] ) && ! empty( $job['salary_b'] ) ) ? '-' . $job['salary_b'] : '' );

		// Assign address
		if ( ! empty( $job['address_id'] ) ) {
			$address = Address::getAddressById( $job['address_id'] );
			if ( ! empty( $address ) ) {
				$job = array_merge( $job, $address );
			}
		}

		// Assign meta
		$meta = JobMeta::getJobMeta( $job_id );
		if ( ! empty( $meta ) && is_array( $meta ) ) {
			$job = array_merge( $job, $meta );
		}

		// Assign stages
		$job['hiring_flow'] = Stage::getStagesByJobId( $job_id );

		return $job;
	}

	/**
	 * Get specific field value of a job
	 *
	 * @param int $job_id
	 * @param string $field
	 * @return mixed
	 */
	public static function getJobFiled( $job_id, $field ) {
		global $wpdb;

		$field_value = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT " . $field . " FROM " . DB::jobs() . " WHERE job_id=%d",
				$job_id
			)
		);

		return $field_value;
	}

	/**
	 * Get jobs based on args
	 *
	 * @param array $args
	 * @return array
	 */
	public static function getJobs( $args = array(), $meta_data = array( 'application_count', 'stages' ) ) {
		// Prepare limit, offset, where conditions
		$page   = $args['page'] ?? 1;
		$limit  = $args['limit'] ?? 15;
		$offset = ( $page - 1 ) * $limit;

		// SQL parts
		$where_clause = '1=1';
		$order_by     = 'ORDER BY job.created_at DESC ';
		$limit_clause = 'LIMIT ' . $limit . ' OFFSET ' . $offset;

		// Apply query filters
		if ( isset( $args['job_id'] ) ) {
			$where_clause .= " AND job.job_id={$args['job_id']}";
		}

		// To Do: Add more filters

		global $wpdb;
		$jobs = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT job.*, department.department_name, address.*  FROM " . DB::jobs() . " job 
					LEFT JOIN " . DB::departments() ." department ON job.department_id=department.department_id
					LEFT JOIN " . DB::addresses() ." address ON job.address_id=address.address_id
				WHERE {$where_clause} {$order_by} {$limit_clause}"
			),
			ARRAY_A
		);

		// No need further data if it's empty
		if ( empty( $jobs ) ) {
			return array();
		}

		// Prepare row columns
		$jobs = _Array::castRecursive( $jobs );
		$jobs = _Array::indexify( $jobs, 'job_id' );

		// Assign meta
		$jobs = JobMeta::assignBulkJobMeta( $jobs );

		// Assign application count
		if ( ! empty( $meta_data ) && in_array( 'application_count', $meta_data ) ) {
			$jobs = Application::appendApplicantCounts( $jobs );
		}

		// Assign stages data
		if ( ! empty( $meta_data ) && in_array( 'stages', $meta_data ) ) {
			$jobs = Stage::appendApplicationStages( $jobs );
		}

		// Assign job permalink
		foreach ( $jobs as $index => $job ) {
			$jobs[ $index ]['job_permalink'] = self::getJobPermalink( $job['job_id'] );
		}

		return $jobs;
	}

	/**
	 * Get single job by job Id
	 *
	 * @param int $job_id
	 * @return array
	 */
	public static function getJobById( $job_id, $meta=null ) {
		$jobs = self::getJobs( array( 'job_id' => $job_id ), $meta );
		$jobs = array_values( $jobs );
		return $jobs[0] ?? null;
	}

	/**
	 * Get job permalink by ID
	 *
	 * @param int $job_id
	 * @return string
	 */
	public static function getJobPermalink( $job_id ) {
		static $careers_permalink = null;
		
		if ( $careers_permalink === null ) {
			$careers_id        = Utilities::getCareersPageId();
			$careers_permalink = ! empty( $careers_id ) ? get_permalink( $careers_id ) : '';
		}

		return $careers_permalink . $job_id . '/';
	}

	/**
	 * Toggle archive status of a job
	 *
	 * @param int $job_id
	 * @param bool $archive True to archive, otherwise unarchive.
	 * @return void
	 */
	public static function toggleArchiveState( $job_id, $archive ) {
		global $wpdb;
		$wpdb->update(
			DB::jobs(),
			array( 'job_status' => $archive ? 'archive' : 'draft' ),
			array( 'job_id' => $job_id )
		);
	}

	/**
	 * Delete a job permanently
	 *
	 * @param int $job_id
	 * @return void
	 */
	public static function deleteJob( $job_id ) {
		global $wpdb;

		// Delete stages
		$wpdb->delete(
			DB::stages(),
			array( 'job_id' => $job_id )
		);

		// Delete meta
		JobMeta::deleteJobMeta( $job_id );

		// Delete associated address
		$address_id = self::getJobFiled( $job_id, 'address_id' );
		if ( ! empty( $address_id ) ) {
			Address::deleteAddress( $address_id );
		}

		// Delete associated applications
		Application::deleteApplicationByJobId( $job_id );

		// Delete job
		$wpdb->delete(
			DB::jobs(),
			array( 'job_id' => $job_id )
		);
	}

	/**
	 * Duplicate a job
	 *
	 * @param int $job_id
	 * @return void
	 */
	public static function duplicateJob( $job_id ) {
		global $wpdb;

		// Get source job row
		$job = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM " . DB::jobs() . " WHERE job_id=%d",
				$job_id
			),
			ARRAY_A
		);
		if ( empty( $job ) ) {
			return false;
		}

		// ----------- Copy the address for the new job -----------
		$old_job_id     = $job['job_id'];
		$new_address_id = null;
		if ( ! empty( $job['address_id'] ) ) {
			$address = $wpdb->get_row(
				$wpdb->prepare(
					"SELECT * FROM " . DB::addresses() . " WHERE address_id=%d",
					$job['address_id']
				),
				ARRAY_A
			);

			unset( $address['address_id'] );
			$wpdb->insert(
				DB::addresses(),
				$address
			);

			$new_address_id = $wpdb->insert_id;
		}

		// -------------------- Insert New Job --------------------
		unset( $job['job_id'] );
		unset( $job['created_at'] );
		$job['job_status']           = 'draft';
		$job['job_title']            = $job['job_title'] . ' - ' . __( 'Draft', 'crewhrm' );
		$job['address_id']           = $new_address_id;
		$job['application_deadline'] = null;

		// Now insert the job as a new
		$wpdb->insert(
			DB::jobs(),
			$job
		);
		$new_job_id = $wpdb->insert_id;

		// Copy stages from old one to new
		Stage::copyStages( $old_job_id, $new_job_id );
		
		// Now copy the meta
		JobMeta::copyJobMeta( $old_job_id, $new_job_id );
		
		return $new_job_id;
	}
}
