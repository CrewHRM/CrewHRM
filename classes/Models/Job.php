<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

class Job {

	/**
	 * Create or update a job
	 *
	 * @param array $job
	 * @return int Job ID
	 */
	public static function createUpdateJob( array $job ) {

		$salary   = $job['salary'] ?? '';
		$salary   = explode( '-', $salary );
		
		$_job = array(
			'job_title'            => $job['job_title'] ?? '',
			'job_description'      => $job['job_description'] ?? '',
			'job_status'           => $job['job_status'] ?? 'draft',
			'job_code'             => $job['job_code'] ?? null,
			'department_id'        => ( ! empty( $job['department_id'] ) && is_numeric( $job['department_id'] ) ) ? $job['department_id'] : null,
			'address_id'           => $job['address_id'],
			'vacancy'              => ( ! empty( $job['vacancy'] ) && is_numeric( $job['vacancy'] ) ) ? $job['vacancy'] : null,
			'salary_a'             => is_numeric( $salary[0] ?? null ) ? $salary[0] : null,
			'salary_b'             => is_numeric( $salary[1] ?? null ) ? $salary[1] : null,
			'salary_basis'         => $job['salary_basis'] ?? null,
			'employment_type'      => $job['employment_type'] ?? null,
			'experience_level'     => $job['experience_level'] ?? null,
			'attendance_type'      => $job['attendance_type'] ?? null,
			'attendance_type'      => $job['attendance_type'] ?? null,
			'application_deadline' => $job['application_deadline'] ?? null,
			'application_form'     => serialize( $job['application_form'] ),
			'job_status'           => $job['job_status'] ?? 'draft',
			'currency'             => $job['currency'] ?? null,
		);

		global $wpdb;
		if ( ! empty( $job['job_id'] ) ) {
			$wpdb->update(
				DB::jobs(),
				$_job,
				array( 'job_id' => $job['job_id'] )
			);
		} else {
			$wpdb->insert(
				DB::jobs(),
				$_job
			);

			$job['job_id'] = $wpdb->insert_id;
		}

		if ( ! empty( $job['job_id'] ) ) {

		}

		return $job['job_id'];
	}

	/**
	 * Job meta data
	 *
	 * @param array $job
	 * @return void
	 */
	private static function createUpdateJobMeta( array $job ) {
		$job_id = $job['job_id'];
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
	public static function getJobs( $args = array() ) {
		// Prepare limit, offset, where conditions
		$page         = $args['page'] ?? 1;
		$limit        = $args['limit'] ?? 15;
		$offset       = ( $page - 1 ) * $limit;
		$limit_clause = ' LIMIT ' . $limit . ' OFFSET ' . $offset;
		$where_clause = '1=1';

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
				WHERE " . $where_clause . ' ' . $limit_clause
			),
			ARRAY_A
		);

		// No need further data if it's empty
		if ( empty( $jobs ) ) {
			return array();
		}

		// Prepare row columns
		$jobs = _Array::castColumns( $jobs, 'intval' );
		$jobs = _Array::indexify( $jobs, 'job_id' );

		// Assign application stages data
		$jobs = self::appendApplicantCounts( $jobs );
		$jobs = self::appendApplicationStages( $jobs );

		return $jobs;
	}

	/**
	 * Get single job by job Id
	 *
	 * @param int $job_id
	 * @return array
	 */
	public static function getJobById( $job_id ) {
		$jobs = self::getJobs( array( 'job_id' => $job_id ) );
		$jobs = array_values( $jobs );
		return $jobs[0] ?? null;
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
		$jobs    = _Array::appendColumn( $jobs, 'stats', array( 'candidates' => 0, 'stages' => array() ) );
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

	/**
	 * Get all stages for multiple jobs using a single query.
	 * This method requires calling Job::appendApplicantCounts method first as it appends data to jobs>stats>stages.
	 *
	 * @param array $jobs
	 * @return array
	 */
	public static function appendApplicationStages( array $jobs ) {
		global $wpdb;

		// Prepare args 
		$job_ids = array_keys( $jobs );
		$ids_in  = implode( ',', $job_ids );
		$stages  = $wpdb->get_results(
			"SELECT * FROM " . DB::stages() . " WHERE job_id IN({$ids_in}) ORDER BY sequence",
			ARRAY_A
		);
		$stages = _Array::castColumns( $stages, 'intval' );

		// Assign the stages in jobs array
		foreach ( $stages as $stage ) {
			$job_id   = $stage['job_id'];
			$stage_id = $stage['stage_id'];

			$jobs[ $job_id ]['stats']['stages'][ $stage_id ]['stage_name'] = $stage['stage_name'];
			$jobs[ $job_id ]['stats']['stages'][ $stage_id ]['stage_id'] = $stage_id;
		}

		return $jobs;
	}
}
