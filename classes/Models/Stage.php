<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

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
		'_disqualified_',
		'_hired_',
	);

	/**
	 * Copy stages from one to another job
	 *
	 * @param int $job_from_id
	 * @param int $job_to_id
	 * @return void
	 */
	public static function copyStages( $job_from_id, $job_to_id ) {
		global $wpdb;

		$stages = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT stage_name, sequence FROM ' . DB::stages() . ' WHERE job_id=%d',
				$job_from_id
			),
			ARRAY_A
		);

		// Insert the stages for new job
		foreach ( $stages as $stage ) {
			$wpdb->insert(
				DB::stages(),
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
	 * @param [type] $job_id
	 * @param [type] $stages
	 * @return void
	 */
	public static function createUpdateStages( $job_id, $stages ) {
		global $wpdb;

		// Exclude reserved from the input array
		$stages = array_filter(
			$stages, 
			function( $stage ) {
				return ! in_array( $stage['stage_name'], self::$reserved_stages );
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
					DB::stages(),
					$payload,
					array( 
						'stage_id' => $stage_id,
						'job_id'   => $job_id,
					)
				);
			} else {
				$wpdb->insert(
					DB::stages(),
					$payload
				);

				$id_mapping[ $stage_id ] = $wpdb->insert_id;
			}
		}

		// Create or update the reserved stages now
		foreach ( self::$reserved_stages as $stage_name ) {
			$exist_id = $wpdb->get_var(
				$wpdb->prepare(
					'SELECT stage_id FROM ' . DB::stages() . ' WHERE job_id=%d AND stage_name=%s LIMIT 1',
					$job_id,
					$stage_name
				)
			);

			if ( ! empty( $exist_id ) ) {
				$wpdb->update(
					DB::stages(),
					array( 'sequence' => ++$sequence ),
					array( 'stage_id' => $exist_id )
				);
			} else {
				$wpdb->insert(
					DB::stages(),
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
	 * @param int|array $job_id
	 * @return array
	 */
	public static function getStagesByJobId( $job_id ) {
		$is_singular = ! is_array( $job_id );
		$job_ids     = $is_singular ? array( $job_id ) : $job_id;
		$ids_in      = implode( ',', $job_ids );

		global $wpdb;
		$stages = $wpdb->get_results(
			'SELECT * FROM ' . DB::stages() . " WHERE job_id IN({$ids_in}) ORDER BY sequence",
			ARRAY_A
		);
		$stages = _Array::castRecursive( $stages );

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
					'SELECT stage_id FROM ' . DB::stages() . ' WHERE job_id=%d AND stage_id=%d LIMIT 1',
					$job_id,
					$move_to
				)
			);
			if ( empty( $target ) ) {
				return false;
			}

			// Move applications to another stage
			$wpdb->update(
				DB::applications(),
				array( 'stage_id' => $move_to ),
				array(
					'job_id'   => $job_id,
					'stage_id' => $stage_id,
				)
			);

			// Move the pipelines too to the new stage
			$wpdb->update(
				DB::pipeline(),
				array( 'stage_id' => $move_to ),
				array( 'stage_id' => $stage_id )
			);
		}

		// Delete the stage now
		$wpdb->delete(
			DB::stages(),
			array( 'stage_id' => $stage_id )
		);

		return true;
	}

	/**
	 * Get an over view of applications
	 *
	 * @param int $job_id
	 * @param int $stage_id
	 * @return array
	 */
	public static function getApplicationsOverview( $job_id, $stage_id ) {
		global $wpdb;

		// Get the total application count
		$count = $wpdb->get_var(
			$wpdb->prepare(
				'SELECT COUNT(application_id) FROM ' . DB::applications() . ' WHERE job_id=%d AND stage_id=%d',
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
	 * @param array $args
	 * @return array
	 */
	public static function getApplications( array $args ) {
		
		$order_by = $args['order_by'] ?? 'application_date';
		$order    = $args['order'] ?? 'DESC';
		$limit    = $args['limit'] ?? 20;
		$offset   = ( ( $args['page'] ?? 1 ) - 1 ) * $limit;

		$where_clause = '';
		$order_clause = " ORDER BY {$order_by} {$order}";
		$limit_clause = " LIMIT {$limit} OFFSET {$offset}";

		if ( ! empty( $args['job_id'] ) ) {
			$where_clause .= " AND job_id={$args['job_id']}";
		}

		if ( ! empty( $args['stage_id'] ) ) {
			$where_clause .= " AND stage_id={$args['stage_id']}";
		}

		global $wpdb;
		$applications = $wpdb->get_results(
			'SELECT * FROM ' . DB::applications() . " WHERE 1=1 {$where_clause} {$order_clause} {$limit_clause}",
			ARRAY_A
		);

		return _Array::castRecursive( $applications );
	}

	/**
	 * Get stages nad application counts for job/s
	 *
	 * @param int|array $job_id
	 * @return array
	 */
	public static function getStageStatsByJobId( $job_id ) {
		// Prepare arguments
		$is_singular = ! is_array( $job_id );
		$job_ids     = ! $is_singular ? $job_id : array( $job_id );
		$ids_in      = implode( ',', $job_ids );
		if ( empty( $job_ids ) ) {
			return array();
		}

		// Get application counts per stage per job.
		global $wpdb;
		$counts = $wpdb->get_results(
			'SELECT job_id, stage_id, COUNT(application_id) as candidates FROM ' . DB::applications() . " WHERE job_id IN ({$ids_in}) GROUP BY job_id, stage_id",
			ARRAY_A
		);
		$counts = _Array::castRecursive( $counts );
		if ( empty( $counts ) ) {
			return array();
		}

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

		// Get the stages sequence to sort (Exclude disqualified as it has no usage in frontend view)
		$sequences = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT job_id, stage_id, stage_name, sequence FROM ' . DB::stages() . " WHERE job_id IN ({$ids_in}) AND stage_name!='_disqualified_' ORDER BY sequence"
			),
			ARRAY_A
		);
		$sequences = _Array::castRecursive( $sequences );

		// Generate new stage array per job based on sequence order
		$_stages = array();

		// Loop through sorted sequences
		foreach ( $sequences as $sequence ) {

			// Loop through candidate counts
			foreach ( $counts as $count ) {

				$_job_id = $count['job_id'];

				// No need to process null. 
				// Null means the application is not assigned to any stage yet. 
				// It has been already included in the global candidates count variable $candidate_counts
				if ( $count['stage_id'] === null || $_job_id !== $sequence['job_id'] ) {
					continue;
				}

				// Create the holder if not created yet
				if ( ! isset( $_stages[ $_job_id ] ) ) {
					$_stages[ $_job_id ] = array();
				}

				// Add the stage per job
				$_stages[ $_job_id ][ $sequence['stage_id'] ] = array_merge(
					$sequence, 
					array( 
						'candidates' => $count['candidates'],
					) 
				);
			}
		}

		foreach ( $_stages as $index => $s ) {
			$_stages[ $index ] = array_values( $s );
		}

		return array(
			'candidates' => $is_singular ? ( $candidate_counts[ $job_id ] ?? 0 ) : $candidate_counts,
			'stages'     => $is_singular ? ( $_stages[ $job_id ] ?? array() ) : $_stages,
		);
	}

	/**
	 * Get single field by stage id
	 *
	 * @param array  $where
	 * @param string $field_name
	 * @return int|string
	 */
	public static function getField( $where, $field_name ) {

		$where_clause = '1=1';
		foreach ( $where as $col => $val ) {
			$where_clause .= " AND " . $col . "='{$val}'";
		}

		global $wpdb;
		return $wpdb->get_var(
			"SELECT {$field_name} FROM " . DB::stages() . " WHERE {$where_clause} LIMIT 1",
		);
	}

	/**
	 * Get the stage id of disqualify for a job
	 *
	 * @param int $job_id
	 * @return int
	 */
	public static function getDisqualifyId( $job_id ) {
		global $wpdb;
		return $wpdb->get_var(
			$wpdb->prepare(
				'SELECT stage_id FROM ' . DB::stages() . " WHERE job_id=%d AND stage_name='_disqualified_'",
				$job_id
			)
		);
	}
}