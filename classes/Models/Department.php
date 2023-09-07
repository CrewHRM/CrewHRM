<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

class Department {
	/**
	 * COlumn name mapping between react and database
	 *
	 * @var array
	 */
	private static $column_names = array( 
		'id'    => 'department_id', 
		'label' => 'department_name', 
	);

	/**
	 * Save bulk departments. Ideally from department setting page in backend dashboard.
	 *
	 * @param array $daprtments
	 * @return array Saved departments
	 */
	public static function saveDepartments( array $departments ) {

		// Apply order the way the array is
		$departments = _Array::applyOrderRecursive( $departments, 'sequence' );

		global $wpdb;
		foreach ( $departments as $department ) {
			if ( is_numeric( $department['id'] ) ) {
				// Update the name as ID exists
				$wpdb->update(
					DB::departments(),
					array( 
						'department_name' => $department['label'],
						'sequence'        => $department['sequence'],
					),
					array( 'department_id' => $department['id'] )
				);
			} else {
				// The ID was assigned by react when added new for 'key' attribute purpose. Insert it as a new.
				$wpdb->insert(
					DB::departments(),
					array( 
						'department_name' => $department['label'],
						'sequence'        => $department['sequence'],
					)
				);
			}
		}
	}

	/**
	 * Get departments
	 *
	 * @return array
	 */
	public static function getDepartments() {
		global $wpdb;
		$departments = $wpdb->get_results(
			"SELECT department_name, department_id, sequence, parent_id FROM " . DB::departments(),
			ARRAY_A
		);

		// Convert data for react use
		$departments = _Array::renameColumns( $departments, array_flip( self::$column_names ) );
		$departments = _Array::castRecursive( $departments );
		$departments = array_reverse( $departments );

		return $departments;
	}

	/**
	 * Add a single department
	 *
	 * @param string $department_name
	 * @return int
	 */
	public static function addDepartment( string $department_name ) {
		global $wpdb;

		// Get sequence number
		$max_value    = $wpdb->get_var( 'SELECT MAX(sequence) FROM ' . DB::departments() );
		$new_sequence = $max_value + 1;

		// Insert finally
		$wpdb->insert(
			DB::departments(),
			array(
				'department_name' => $department_name,
				'sequence'        => $new_sequence,
			)
		);

		return $wpdb->insert_id;
	}
}
