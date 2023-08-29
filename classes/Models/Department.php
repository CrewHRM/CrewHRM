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
		'label' => 'department_name' 
	);

	/**
	 * Save bulk departments. Ideally from department setting page in backend dashboard.
	 *
	 * @param array $daprtments
	 * @return array Saved departments
	 */
	public static function saveDepartments( array $departments ) {
		global $wpdb;
		
		foreach ( $departments as $department ) {
			if ( is_numeric( $department['id'] ) ) {
				// Update the name as ID exists
				$wpdb->update(
					DB::departments(),
					array( 'department_name' => $department['label'] ),
					array( 'department_id' => $department['id'] )
				);
			} else {
				// The ID was assigned by react when added new for 'key' attribute purpose. Insert it as a new.
				$wpdb->insert(
					DB::departments(),
					array( 'department_name' => $department['label'] )
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
			$wpdb->prepare(
				"SELECT * FROM " . DB::departments()
			),
			ARRAY_A
		);

		// Convert data for react use
		$departments = _Array::renameColumns( $departments, array_flip( self::$column_names ) );
		$departments = array_reverse( $departments );

		return $departments;
	}
}