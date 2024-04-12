<?php
/**
 * Application stage management business logics
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;
use CrewHRM\Helpers\_String;

/**
 * Hiring Flow/Application stage manager class
 */
class Stage {
	/**
	 * Reserved stages
	 *
	 * @var array
	 */
	public static $reserved_stages = array(
		'_disqualified_' => 'Disqualified',
		'_hired_'        => 'Hired',
	);

	/**
	 * Copy stages from one to another job
	 *
	 * @param int $job_from_id The job ID to copy stages from
	 * @param int $job_to_id   The job ID to copy stages to
	 * @return void
	 */
	public static function copyStages( $job_from_id, $job_to_id ) {
		global $wpdb;

		$stages = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT stage_name, sequence FROM {$wpdb->crewhrm_stages} WHERE job_id=%d",
				$job_from_id
			),
			ARRAY_A
		);

		// Insert the stages for new job
		foreach ( $stages as $stage ) {
			$wpdb->insert(
				$wpdb->crewhrm_stages,
				array(
					'stage_name' => $stage['stage_name'],
					'sequence'   => $stage['sequence'],
					'job_id'     => $job_to_id,
				)
			);
		}
	}

	/**
	 * Create/update stages for job editor
	 *
	 * @param int   $job_id The job ID to create or updated stage for
	 * @param array $stages Stages array to create or update
	 * @return array
	 */
	public static function createUpdateStages( $job_id, $stages ) {
		global $wpdb;

		// Exclude reserved from the input array
		$stages = array_filter(
			$stages,
			function( $stage ) {
				return ! in_array( $stage['stage_name'], array_keys( self::$reserved_stages ), true );
			}
		);

		// Apply sequence as per the current order now and insert/update based on stage ID
		$sequence   = 0;
		$id_mapping = array();
		foreach ( $stages as $stage ) {
			$stage_id = $stage['stage_id'] ?? null;

			$payload = array(
				'job_id'     => $job_id,
				'stage_name' => $stage['stage_name'],
				'sequence'   => ++$sequence,
			);

			// Update if id is numeric which means not temp ID. React app assigns a non numeric string as ID temporary.
			if ( ! empty( $stage_id ) && is_numeric( $stage_id ) ) {
				$wpdb->update(
					$wpdb->crewhrm_stages,
					$payload,
					array(
						'stage_id' => $stage_id,
						'job_id'   => $job_id,
					)
				);
			} else {
				$wpdb->insert(
					$wpdb->crewhrm_stages,
					$payload
				);

				$id_mapping[ $stage_id ] = $wpdb->insert_id;
			}
		}

		// Create or update the reserved stages now
		foreach ( array_keys( self::$reserved_stages ) as $stage_name ) {
			$exist_id = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT stage_id FROM {$wpdb->crewhrm_stages} WHERE job_id=%d AND stage_name=%s LIMIT 1",
					$job_id,
					$stage_name
				)
			);

			if ( ! empty( $exist_id ) ) {
				$wpdb->update(
					$wpdb->crewhrm_stages,
					array( 'sequence' => ++$sequence ),
					array( 'stage_id' => $exist_id )
				);
			} else {
				$wpdb->insert(
					$wpdb->crewhrm_stages,
					array(
						'job_id'     => $job_id,
						'stage_name' => $stage_name,
						'sequence'   => ++$sequence,
					)
				);
			}
		}

		return $id_mapping;
	}

	/**
	 * Get stages of job/s
	 *
	 * @param int|array $job_id Job ID or array of job IDs
	 * @return array
	 */
	public static function getStagesByJobId( $job_id ) {
		$is_singular = ! is_array( $job_id );
		$ids_in      = array_values( _Array::getArray( $job_id, true, 0 ) );
		$ids_places  = _String::getPlaceHolders( $ids_in );

		global $wpdb;
		$stages = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$wpdb->crewhrm_stages} WHERE job_id IN ({$ids_places}) ORDER BY sequence",
				...$ids_in
			),
			ARRAY_A
		);

		$stages    = _Array::castRecursive( $stages );
		$new_array = array();

		// Assign the stages in jobs array
		foreach ( $stages as $stage ) {
			$_job_id = $stage['job_id'];

			if ( ! isset( $new_array[ $_job_id ] ) ) {
				$new_array[ $_job_id ] = array();
			}

			$new_array[ $_job_id ][] = array(
				'stage_id'   => $stage['stage_id'],
				'stage_name' => $stage['stage_name'],
			);
		}

		$stages = _Array::castRecursive( $new_array );

		return $is_singular ? ( $stages[ $job_id ] ?? null ) : $stages;
	}

	/**
	 * Delete individual application stage from individual job
	 *
	 * @param int $job_id The job id to delete stage from
	 * @param int $stage_id The stage to delete
	 * @param int $move_to The stage id to move the applications to before deleting
	 * @return mixed
	 */
	public static function deleteStage( $job_id, $stage_id, $move_to = null ) {
		global $wpdb;

		// Get the applications in the deletable stage
		$overview = self::getApplicationsOverview( $job_id, $stage_id );

		// Move the applications to new target if necessary
		if ( ! empty( $overview['count'] ) ) {

			if ( empty( $move_to ) ) {
				// Return overview to show prompt that applications should be moved to another stage before deleting.
				// However if the stage id to move to is provided, then this block will not be executed. Directly will be moved before deletion.
				return $overview;
			}

			// Check if the target stage exists
			$target = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT 
						stage_id 
					FROM 
						{$wpdb->crewhrm_stages} 
					WHERE 
						job_id=%d AND stage_id=%d 
					LIMIT 1",
					$job_id,
					$move_to
				)
			);
			if ( empty( $target ) ) {
				return false;
			}

			// Move applications to another stage
			$wpdb->update(
				$wpdb->crewhrm_applications,
				array( 'stage_id' => $move_to ),
				array(
					'job_id'   => $job_id,
					'stage_id' => $stage_id,
				)
			);

			// Move the pipelines too to the new stage
			$wpdb->update(
				$wpdb->crewhrm_pipeline,
				array( 'stage_id' => $move_to ),
				array( 'stage_id' => $stage_id )
			);
		}

		// Delete the stage now
		$wpdb->delete(
			$wpdb->crewhrm_stages,
			array( 'stage_id' => $stage_id )
		);

		return true;
	}

	/**
	 * Get an over view of applications per stage
	 *
	 * @param int $job_id   Job ID
	 * @param int $stage_id Stage ID
	 * @return array
	 */
	public static function getApplicationsOverview( $job_id, $stage_id ) {
		global $wpdb;

		// Get the total application count
		$count = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT 
					COUNT(application_id) 
				FROM 
					{$wpdb->crewhrm_applications} 
				WHERE 
					job_id=%d 
					AND stage_id=%d",
				$job_id,
				$stage_id
			)
		);

		// Get the initial 3 application data
		$peak = self::getApplications(
			array(
				'job_id'   => $job_id,
				'stage_id' => $stage_id,
				'limit'    => 3,
			)
		);

		return array(
			'count' => (int) $count,
			'peak'  => $peak,
		);
	}

	/**
	 * Get applications based on arguments
	 *
	 * @param array $args Arguments array to get applications based on
	 * @return array
	 */
	private static function getApplications( array $args ) {

		global $wpdb;

		$order_by = $args['order_by'] ?? 'application_date';
		$order    = $args['order'] ?? 'DESC';
		$limit    = $args['limit'] ?? 2;
		$offset   = ( ( $args['page'] ?? 1 ) - 1 ) * $limit;

		$where_clause = '';

		if ( ! empty( $args['job_id'] ) ) {
			$where_clause .= $wpdb->prepare( ' AND job_id=%d', $args['job_id'] );
		}

		if ( ! empty( $args['stage_id'] ) ) {
			$where_clause .= $wpdb->prepare( ' AND stage_id=%d', $args['stage_id'] );
		}

		$applications = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT 
					application_id,
					job_id,
					stage_id,
					address_id,
					first_name,
					last_name,
					email,
					phone,
					date_of_birth,
					gender,
					cover_letter,
					resume_file_id,
					is_complete, 
					UNIX_TIMESTAMP(application_date) AS application_date 
				FROM 
					{$wpdb->crewhrm_applications} 
				WHERE 
					1=1 {$where_clause} 
				ORDER BY {$order_by} {$order} LIMIT %d OFFSET %d",
				$limit,
				$offset
			),
			ARRAY_A
		);

		return _Array::castRecursive( $applications );
	}

	/**
	 * Get stages and application counts for job/s
	 *
	 * @param int|array $job_id Job ID or array of IDs
	 * @return array
	 */
	public static function getStageStatsByJobId( $job_id ) {

		// Prepare arguments
		$is_singular = ! is_array( $job_id );
		$job_ids     = array_values( _Array::getArray( $job_id, true ) );
		if ( empty( $job_ids ) ) {
			return array();
		}

		$ids_places = _String::getPlaceHolders( $job_ids );

		// Get application counts per stage per job.
		global $wpdb;
		$counts = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT 
					job_id, 
					stage_id, 
					COUNT(application_id) as candidates 
				FROM 
					{$wpdb->crewhrm_applications} 
				WHERE 
					job_id IN ({$ids_places}) 
				GROUP BY job_id, stage_id",
				...$job_ids
			),
			ARRAY_A
		);

		if ( empty( $counts ) ) {
			return array();
		}
		$counts = _Array::castRecursive( $counts );

		// Get job wise total candidate counts
		$candidate_counts = array();
		foreach ( $counts as $count ) {
			$_job_id = $count['job_id'];

			// Create the holder if not already
			if ( ! isset( $candidate_counts[ $_job_id ] ) ) {
				$candidate_counts[ $_job_id ] = 0;
			}

			$candidate_counts[ $_job_id ] += $count['candidates'];
		}

		// Get the stages sequence to sort.
		// Exclude disqualified as it is used in special way and has no usage in frontend view.
		$sequences = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT 
					job_id, 
					stage_id, 
					stage_name, 
					sequence 
				FROM 
					{$wpdb->crewhrm_stages} 
				WHERE job_id IN ({$ids_places}) 
					AND stage_name!='_disqualified_' 
				ORDER BY sequence",
				...$job_ids
			),
			ARRAY_A
		);
		$sequences = _Array::castRecursive( $sequences );

		// Generate new stage array per job based on sequence order
		$_stages = array();
		foreach ( $job_ids as $id ) {
			// Create place holder to store per job stages
			$_stages[ $id ] = array();
		}

		// Loop through sorted sequences
		foreach ( $sequences as $sequence ) {

			// Put sequenced stage in the new array
			$_stages[ $sequence['job_id'] ][ $sequence['stage_id'] ] = array_merge(
				$sequence,
				array(
					'candidates' => 0,
				)
			);

			// Loop through candidate counts
			foreach ( $counts as $count ) {
				if ( $count['stage_id'] === $sequence['stage_id'] ) {
					$_stages[ $count['job_id'] ][ $sequence['stage_id'] ]['candidates'] = $count['candidates'];
				}
			}
		}

		// Remove indexes from stages to avoid casting as object during transfer to browser.
		foreach ( $_stages as $index => $s ) {
			$_stages[ $index ] = array_values( $s );
		}

		return array(
			'candidates' => $is_singular ? ( $candidate_counts[ $job_id ] ?? 0 ) : $candidate_counts,
			'stages'     => $is_singular ? ( $_stages[ $job_id ] ?? array() ) : $_stages,
		);
	}

	/**
	 * Get the stage id of disqualify for a job
	 *
	 * @param int $job_id Job ID
	 * @return int
	 */
	public static function getDisqualifyId( $job_id ) {
		return self::getStageIdByName( $job_id, '_disqualified_' );
	}

	/**
	 * Get stage ID by stage name
	 *
	 * @param int $job_id
	 * @param string $stage_name
	 * @return int
	 */
	public static function getStageIdByName( $job_id, $stage_name ) {
		
		global $wpdb;

		$stg_id = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT 
					stage_id 
				FROM 
					{$wpdb->crewhrm_stages} 
				WHERE 
					job_id=%d 
					AND stage_name=%s",
				$job_id,
				$stage_name
			)
		);

		return $stg_id ? (int) $stg_id : 0;
	}

	/**
	 * Get the current stage ID of an application. 0 means no stage, and it is utilized across the app.
	 *
	 * @param int $application_id The application ID to get stages of
	 * @return int
	 */
	public static function getCurrentStageIdByApplicationId( $application_id ) {
		global $wpdb;
		$stage_id = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT 
					stage_id 
				FROM 
					{$wpdb->crewhrm_pipeline} 
				WHERE 
					application_id=%d 
				ORDER BY action_date DESC 
				LIMIT 1",
				$application_id
			)
		);

		return empty( $stage_id ) ? 0 : $stage_id;
	}
}
