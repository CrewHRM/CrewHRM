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

		$_reserveds = array();

		// Make sure reserved stages are at the end of the flow
		$stages = array_filter(
			$stages, 
			function( $stage ) use( &$_reserveds ) {
				if ( in_array( $stage['stage_name'], self::$reserved_stages )) {
					$_reserveds[ $stage['stage_name'] ] = $stage;
					return false;
				}
				
				return true;
			}
		);

		// Now add these reserved at the end of the flow
		foreach ( self::$reserved_stages as $stage_name ) {
			$stages[] = $_reserveds[ $stage_name ] ?? array( 'stage_name' => $stage_name );
		}
		
		// Apply sequence as per the current order now and insert/update based on stage ID
		$index = 0;
		foreach ( $stages as $index => $stage ) {
			$stage_id = $stage['stage_id'] ?? null;

			$payload = array(
				'job_id'     => $job_id,
				'stage_name' => $stage['stage_name'],
				'sequence'   => ++$index,
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
			}
		}
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
		$stages = _Array::castColumns( $stages, 'intval' );

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

		$stages = _Array::castColumns( $new_array, 'intval' );

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
}