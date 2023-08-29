<?php

namespace CrewHRM\Models;

class Department {

	/**
	 * Save bulk departments. Ideally from department setting page in backend dashboard.
	 *
	 * @param array $daprtments
	 * @return array Saved departments
	 */
	public static function saveDepartments( array $departments ) {
		global $wpdb;
		
		foreach ( $departments as $department ) {
			if ( is_numeric( $department['department_id'] ) ) {
				// Update the name as ID exists
				$wpdb->update(
					DB::departments(),
					array( 'department_name' => $department ),
					array( 'department_id' => $department['department_id'] )
				);
			} else {
				// The ID was assigned by react when added new for 'key' attribute purpose. Insert it as a new.
				$wpdb->insert(
					DB::departments(),
					array( 'department_name' => $department['department_name'] )
				);
			}
		}
	}

	/**
	 * Get departments
	 *
	 * @return array
	 */
	public static function getDepartments( $type = OBJECT  ) {
		global $wpdb;
		$departments = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM " . DB::departments()
			),
			$type
		);

		return $departments;
	}
}