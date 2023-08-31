<?php

namespace CrewHRM\Models;

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
			'job_title'        => $job['job_title'] ?? '',
			'job_description'  => $job['job_description'] ?? '',
			'job_status'       => $job['job_status'] ?? 'draft',
			'job_code'         => $job['job_code'] ?? null,
			'department_id'    => ( ! empty( $job['department_id'] ) && is_numeric( $job['department_id'] ) ) ? $job['department_id'] : null,
			'address_id'       => $job['address_id'],
			'vacancy'          => ( ! empty( $job['vacancy'] ) && is_numeric( $job['vacancy'] ) ) ? $job['vacancy'] : null,
			'salary_a'         => is_numeric( $salary[0] ?? null ) ? $salary[0] : null,
			'salary_b'         => is_numeric( $salary[1] ?? null ) ? $salary[1] : null,
			'salary_basis'     => $job['salary_basis'] ?? null,
			'employment_type'  => $job['employment_type'] ?? null,
			'experience_level' => $job['experience_level'] ?? null,
			'attendance_type'  => $job['attendance_type'] ?? null,
			'attendance_type'  => $job['attendance_type'] ?? null,
			'deadline'         => $job['deadline'] ?? null,
			'application_form' => serialize( $job['application_form'] ),
			'job_status'       => $job['job_status'] ?? 'draft',
			'currency'         => $job['currency'] ?? null,
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
		$page         = $args['page'] ?? 1;
		$limit        = $args['limit'] ?? 15;
		$offset       = ( $page - 1 ) * $limit;
		$limit_clause = ' LIMIT ' . $limit . ' OFFSET ' . $offset;
		$where_clause = '1=1';

		if ( isset( $args['job_id'] ) ) {
			$where_clause .= " AND job_id={$args['job_id']}";
		}

		// To Do: Add more filters

		global $wpdb;
		$jobs = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM " . DB::jobs() . " WHERE " . $where_clause . ' ' . $limit_clause
			),
			ARRAY_A
		);

		// To Do: Assign meta data

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
		return $jobs[0] ?? null;
	}
}