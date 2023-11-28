<?php
/**
 * Job management logics
 *
 * @package crewhrm
 */

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
	 * @param array $job Job data array
	 * @return array
	 */
	public static function createUpdateJob( array $job ) {

		// Prepare salary field
		$salary = $job['salary'] ?? '';
		$salary = explode( '-', $salary );

		// Prepare deadline field
		$deadline = null;
		if ( ! empty( $job['application_deadline'] ) ) {
			$deadline = $job['application_deadline'];
			$deadline = ! is_numeric( $deadline ) ? strtotime( $deadline ) : (int) $deadline;
			$deadline = gmdate( 'Y-m-d\TH:i:s', $deadline );
		}

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
			'attendance_type'      => maybe_serialize( $job['attendance_type'] ?? array() ),
			'experience_years'     => $job['experience_years'] ?? null,
			'experience_level'     => $job['experience_level'] ?? null,
			'application_deadline' => $deadline,
			'application_form'     => maybe_serialize( $job['application_form'] ?? array() ),
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

			$_job['updated_at'] = gmdate( 'Y-m-d H:i:s' );

			$wpdb->update(
				DB::jobs(),
				$_job,
				array( 'job_id' => $job_id )
			);

			// Execute update hook no matter the status
			do_action( 'crewhrm_job_updated', $job_id, $_job, $job );

		} else {
			// Insert new if the id empty

			$_job['created_at'] = gmdate( 'Y-m-d H:i:s' );

			$wpdb->insert(
				DB::jobs(),
				$_job
			);

			// Set the newly created ID
			$job_id = $wpdb->insert_id;

			// Execute created hook no matter the status
			do_action( 'crewhrm_job_created', $job_id, $_job, $job );
		}

		if ( empty( $job_id ) ) {
			return null;
		}

		// Insert Job meta
		$to_store = array();
		foreach ( $to_store as $field_name ) {
			Meta::job( $job_id )->updateMeta( $field_name, ( $job[ $field_name ] ?? null ) );
		}

		// Insert stages
		$stage_ids = Stage::createUpdateStages( $job_id, $job['hiring_flow'] ?? array() );

		return array(
			'job_id'     => $job_id,
			'address_id' => $address_id,
			'stage_ids'  => $stage_ids,
		);
	}

	/**
	 * Get editable job. Just the reverse version of the job that can be saved using createUpdateJob method.
	 *
	 * @param int $job_id Job ID
	 * @return array
	 */
	public static function getEditableJob( $job_id ) {
		global $wpdb;
		$job = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . DB::jobs() . ' WHERE job_id=%d',
				$job_id
			),
			ARRAY_A
		);
		if ( empty( $job ) ) {
			return null;
		}

		$job = _Array::castRecursive( $job );

		// Unserialize application form
		$job['application_form'] = _Array::getArray( maybe_unserialize( $job['application_form'] ) );
		$job['salary']           = ( $job['salary_a'] ?? '' ) . ( ( ! empty( $job['salary_a'] ) && ! empty( $job['salary_b'] ) ) ? '-' . $job['salary_b'] : '' );

		// Assign address
		if ( ! empty( $job['address_id'] ) ) {
			$address = Address::getAddressById( $job['address_id'] );
			if ( ! empty( $address ) ) {
				$job = array_merge( $job, $address );
			}
		}

		// Assign meta
		$meta = Meta::job( $job_id )->getMeta();
		if ( ! empty( $meta ) && is_array( $meta ) ) {
			$job = array_merge( $job, $meta );
		}

		// Assign stages
		$job['hiring_flow'] = Stage::getStagesByJobId( $job_id );

		// Permalink
		$job['job_permalink'] = self::getJobPermalink( $job_id );

		return $job;
	}

	/**
	 * Get specific field value of a job
	 *
	 * @param int    $job_id Job ID
	 * @param string $field  Field name/column
	 * @return mixed
	 */
	public static function getFiled( $job_id, $field ) {
		global $wpdb;

		$field_value = $wpdb->get_var(
			$wpdb->prepare(
				'SELECT ' . $field . ' FROM ' . DB::jobs() . ' WHERE job_id=%d',
				$job_id
			)
		);

		return maybe_unserialize( $field_value );
	}

	/**
	 * Get jobs based on args
	 *
	 * @param array $args         Jobs args
	 * @param array $meta_data    Meta data to include int the return array
	 * @param bool  $segmentation Whether to need segmentation/pagination data
	 * @return array
	 */
	public static function getJobs( $args = array(), $meta_data = array( 'application_count', 'stages' ), $segmentation = false ) {
		// Prepare limit, offset, where conditions
		$page   = (int) ( $args['page'] ?? 1 );
		$limit  = $args['limit'] ?? Settings::getSetting( 'job_post_per_page', 20 );
		$offset = ( $page - 1 ) * $limit;

		// SQL parts
		$where_clause = '1=1';
		$order_by     = 'ORDER BY job.created_at DESC ';
		$limit_clause = 'LIMIT ' . $limit . ' OFFSET ' . $offset;

		// Apply query filters
		if ( isset( $args['job_id'] ) ) {
			$where_clause .= " AND job.job_id={$args['job_id']}";
		}

		// Apply department filter
		if ( ! empty( $args['department_id'] ) ) {
			$dep           = esc_sql( $args['department_id'] );
			$where_clause .= " AND job.department_id={$dep}";
		}

		// Apply job status
		if ( ! empty( $args['job_status'] ) ) {
			$status        = esc_sql( $args['job_status'] );
			$where_clause .= " AND job.job_status='{$status}'";
		}

		// Apply search
		if ( ! empty( $args['search'] ) ) {
			$keyword       = esc_sql( $args['search'] );
			$where_clause .= " AND job.job_title LIKE '%{$keyword}%'";
		}

		// Determine what to select
		if ( $segmentation ) {
			$selects = 'COUNT(job.job_id)';
		} else {
			$selects = '
				job.job_id,
				job.job_code,
				job.job_title,
				job.job_description,
				job.job_status,
				job.department_id,
				job.vacancy,
				job.address_id,
				job.currency,
				job.salary_a,
				job.salary_b,
				job.salary_basis,
				job.employment_type,
				job.attendance_type,
				job.experience_level,
				job.experience_years,
				job.application_form,
				UNIX_TIMESTAMP(job.application_deadline) AS application_deadline,
				UNIX_TIMESTAMP(job.created_at) AS created_at,
				UNIX_TIMESTAMP(job.updated_at) AS updated_at,
				department.department_name, 
				address.*';
		}

		// Build the query
		$query = "SELECT {$selects} 
				  FROM " . DB::jobs() . ' job 
					LEFT JOIN ' . DB::departments() . ' department ON job.department_id=department.department_id
					LEFT JOIN ' . DB::addresses() . " address ON job.address_id=address.address_id
				  WHERE {$where_clause} " . ( $segmentation ? '' : "{$order_by} {$limit_clause}" );

		global $wpdb;
		if ( $segmentation ) {
			$total_count = (int) $wpdb->get_var( $query );
			$page_count  = ceil( $total_count / $limit );

			return array(
				'total_count' => $total_count,
				'page_count'  => $page_count,
				'page'        => $page,
				'limit'       => $limit,
			);

		} else {
			$jobs = $wpdb->get_results( $query, ARRAY_A );
		}

		// No need further data if it's empty
		if ( empty( $jobs ) ) {
			return array();
		}

		// Prepare row columns
		$jobs = _Array::castRecursive( $jobs );
		$jobs = _Array::indexify( $jobs, 'job_id' );

		// Assign meta
		$jobs = Meta::job( null )->assignBulkMeta( $jobs );

		// Assign application count
		if ( ! empty( $meta_data ) && in_array( 'application_count', $meta_data, true ) ) {
			$jobs = Application::appendApplicationCounts( $jobs );
		}

		// Assign job permalink
		foreach ( $jobs as $index => $job ) {

			// Add permalink
			$jobs[ $index ]['job_permalink'] = self::getJobPermalink( $job['job_id'] );

			// Prepare application form
			$jobs[ $index ]['application_form'] = _Array::getArray( maybe_unserialize( $job['application_form'] ) );
		}

		return $jobs;
	}

	/**
	 * Job list with minimal data and filters. Ideally for dropdowns.
	 *
	 * @return array
	 */
	public static function getJobsMinimal() {
		global $wpdb;
		$jobs = $wpdb->get_results(
			'SELECT job_id, job_title FROM ' . DB::jobs() . ' ORDER BY created_at',
			ARRAY_A
		);

		$jobs = _Array::castRecursive( $jobs );

		return $jobs;
	}

	/**
	 * Get job listing ideally for careers page that is publicly accessible.
	 *
	 * @param array $args Careers args
	 * @return array
	 */
	public static function getCareersListing( array $args ) {
		$selects           = 'job.job_id, job.job_title, job.employment_type, address.*';
		$limit             = Utilities::getInt( $args['limit'] ?? Settings::getSetting( 'job_post_per_page', 20 ), 1, 20 );
		$offset            = ( Utilities::getInt( $args['page'] ?? 1, 1 ) - 1 ) * $limit;
		$limit_clause      = " LIMIT {$limit} OFFSET {$offset}";
		$where_clause      = "job.job_status='publish'";
		$department_clause = '';

		// Add department filter
		if ( ! empty( $args['department_id'] ) ) {
			// Keep it in different clause in favour of group by query later.
			$dep                = esc_sql( $args['department_id'] );
			$department_clause .= " AND job.department_id={$dep}";
		}

		// Add search filter
		if ( ! empty( $args['search'] ) ) {
			$keyword       = esc_sql( $args['search'] );
			$where_clause .= " AND job.job_title LIKE '%{$keyword}%'";
		}

		// Add country filter
		if ( ! empty( $args['country_code'] ) ) {
			$country_code  = esc_sql( $args['country_code'] );
			$where_clause .= " AND address.country_code='{$country_code}'";
		}

		// Add employment_type filter
		if ( ! empty( $args['employment_type'] ) ) {
			// Escape
			$employment_type = esc_sql( $args['employment_type'] );

			// Like operator because multiple types get stored as serialized array.
			$where_clause .= " AND job.employment_type LIKE '%{$employment_type}%'";
		}

		global $wpdb;

		// Otherwise prepare other meta data
		$jobs = $wpdb->get_results(
			"SELECT DISTINCT {$selects}
			FROM " . DB::jobs() . ' job
				LEFT JOIN ' . DB::addresses() . " address ON job.address_id=address.address_id 
			WHERE {$where_clause} {$department_clause} {$limit_clause}",
			ARRAY_A
		);
		$jobs = _Array::getArray( $jobs );
		$jobs = _Array::indexify( $jobs, 'job_id' );
		$jobs = Meta::job( null )->assignBulkMeta( $jobs );

		// Get departments
		$departments = $wpdb->get_results(
			'SELECT job.department_id, d.department_name, COUNT(job.job_id) AS job_count
			FROM ' . DB::jobs() . ' job
				LEFT JOIN ' . DB::addresses() . ' address ON job.address_id=address.address_id 
				INNER JOIN ' . DB::departments() . " d ON d.department_id=job.department_id
			WHERE {$where_clause} GROUP BY d.department_id ORDER BY d.sequence",
			ARRAY_A
		);
		$departments = _Array::getArray( $departments );

		return array(
			'jobs'        => $jobs,
			'departments' => $departments,
		);
	}

	/**
	 * Get single job by job Id
	 *
	 * @param int   $job_id Job ID
	 * @param array $meta   Meta data to include in the job
	 * @return array
	 */
	public static function getJobById( $job_id, $meta = null ) {
		$jobs = self::getJobs( array( 'job_id' => $job_id ), $meta );
		$jobs = array_values( $jobs );
		return $jobs[0] ?? null;
	}

	/**
	 * Retrieve job by application id
	 *
	 * @param int $application_id The application ID to get job by
	 * @return array
	 */
	public static function getJobByApplicationId( $application_id ) {
		$job_id = Field::applications()->getField( array( 'application_id' => $application_id ), 'job_id' );
		return self::getJobById( $job_id );
	}

	/**
	 * Get job permalink by ID
	 *
	 * @param int $job_id Job ID to get permalink for
	 * @return string
	 */
	public static function getJobPermalink( $job_id ) {
		static $careers_permalink = null;

		if ( null === $careers_permalink ) {
			$careers_id        = Utilities::getCareersPageId();
			$careers_permalink = ! empty( $careers_id ) ? get_permalink( $careers_id ) : '';
		}

		return $careers_permalink . $job_id . '/';
	}

	/**
	 * Get pemalink to edit job screen
	 *
	 * @param int $job_id The job ID to get permalink for
	 * @return string
	 */
	public static function getJobEditPermalink( $job_id ) {
		return Utilities::getDashboardPermalink( "#/dashboard/jobs/editor/{$job_id}/" );
	}

	/**
	 * Toggle archive status of a job
	 *
	 * @param int  $job_id  Job ID
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
	 * @param int $job_id Job ID to delete job by
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
		Meta::job( $job_id )->deleteMeta();

		// Delete associated address
		$address_id = self::getFiled( $job_id, 'address_id' );
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
	 * @param int $job_id Job ID
	 * @return bool
	 */
	public static function duplicateJob( $job_id ) {
		global $wpdb;

		// Get source job row
		$job = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . DB::jobs() . ' WHERE job_id=%d',
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
					'SELECT * FROM ' . DB::addresses() . ' WHERE address_id=%d',
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
		Meta::job( $old_job_id )->copyMeta( $new_job_id );

		return $new_job_id;
	}
}
