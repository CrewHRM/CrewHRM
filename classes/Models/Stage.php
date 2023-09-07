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
		'_hired_'
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
				"SELECT stage_name, sequence FROM " . DB::stages() . " WHERE job_id=%d",
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
					'job_id'     => $job_to_id
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
						'job_id'   => $job_id
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
					"SELECT stage_id FROM " . DB::stages() . " WHERE job_id=%d AND stage_name=%s LIMIT 1",
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
		$stages  = $wpdb->get_results(
			"SELECT * FROM " . DB::stages() . " WHERE job_id IN({$ids_in}) ORDER BY sequence",
			ARRAY_A
		);
		$stages = _Array::castRecursive( $stages );

		$new_array = array();

		// Assign the stages in jobs array
		foreach ( $stages as $stage ) {
			$_job_id     = $stage['job_id'];
			
			if ( ! isset( $new_array[ $_job_id ] ) ) {
				$new_array[ $_job_id ] = array();
			}

			$new_array[ $_job_id ][] = array(
				'stage_id'   => $stage['stage_id'],
				'stage_name' => $stage['stage_name']
			);
		}

		$stages = _Array::castRecursive( $new_array );

		return $is_singular ? ( $stages[ $job_id ] ?? null ) : $stages;
	}

	/**
	 * Get all stages for multiple jobs using a single query.
	 *
	 * @param array $jobs
	 * @return array
	 */
	public static function appendApplicationStages( array $jobs ) {

		// Prepare args 
		$jobs   = _Array::appendArray( $jobs, 'stats', array( 'stages' => array() ) );
		$stages = self::getStagesByJobId( array_keys( $jobs ) );

		// Assign the stages in jobs array
		foreach ( $stages as $job_id => $stage ) {			
			$jobs[ $job_id ]['stats']['stages'] = $stage;
		}

		return $jobs;
	}

	/**
	 * Delete individual application stage from individual job
	 *
	 * @param int $job_id The job id to delete stage from
	 * @param int $stage_id The stage to delete
	 * @param int $move_to The stage id to move the applicants to before deleting
	 * @return mixed
	 */
	public static function deleteStage( $job_id, $stage_id, $move_to = null ) {
		global $wpdb;

		// Get the applicants in the deletable stage
		$overview = self::getApplicantsOverview( $job_id, $stage_id );

		// Move the applicants to new target if necessary
		if ( ! empty( $overview['count'] ) ) {

			if ( empty( $move_to ) ) {
				// Return overview to show prompt that applicants should be moved to another stage before deleting.
				// However if the stage id to move to is provided, then this block will not be executed. Directly will be moved before deletion.
				return $overview;
			}

			// Check if the target stage exists
			$target = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT stage_id FROM " . DB::stages() . " WHERE job_id=%d AND stage_id=%d LIMIT 1",
					$job_id,
					$move_to
				)
			);
			if ( empty( $target ) ) {
				return false;
			}

			// Move applicants to another stage
			$wpdb->update(
				DB::applications(),
				array( 'stage_id' => $move_to ),
				array(
					'job_id'   => $job_id,
					'stage_id' => $stage_id
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
	 * Get an over view of applicants
	 *
	 * @param int $job_id
	 * @param int $stage_id
	 * @return array
	 */
	public static function getApplicantsOverview( $job_id, $stage_id ) {
		global $wpdb;

		// Get the total application count
		$count = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(application_id) FROM " . DB::applications() . " WHERE job_id=%d AND stage_id=%d",
				$job_id,
				$stage_id
			)
		);

		// Get the initial 3 application data
		$peak = self::getApplicants(
			array(
				'job_id'   => $job_id,
				'stage_id' => $stage_id,
				'limit'    => 3,
			)
		);

		return array(
			'count' => (int) $count,
			'peak'  => $peak
		);
	}

	/**
	 * Get applicants based on arguments
	 *
	 * @param array $args
	 * @return array
	 */
	public static function getApplicants( array $args ) {
		
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
		$applicants = $wpdb->get_results(
			"SELECT * FROM " . DB::applications() . " WHERE 1=1 {$where_clause} {$order_clause} {$limit_clause}",
			ARRAY_A
		);

		return _Array::castRecursive( $applicants );
	}
}