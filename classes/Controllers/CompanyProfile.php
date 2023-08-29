<?php

namespace CrewHRM\Controllers;

use CrewHRM\Helpers\_Array;
use CrewHRM\Models\Department;
use CrewHRM\Models\Settings;

class CompanyProfile {
	const PREREQUISITES = array(
		'saveCompanyProfile' => array(
			'role'       => 'administrator',
			'required'   => array(
				'settings' => array(
					'type' => 'array',
				),
			),
		),
		'saveCompanyDepartments' => array(
			'role'     => 'administrator',
			'required' => array(
				'settings' => array(
					'type' => 'array',
				),
			),
		)
	);

	/**
	 * Save company settings
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function saveCompanyProfile( $data ) {
		
		// Update the settings now
		Settings::saveSettings( $data['settings'], Settings::KEY_COMPANY );

		wp_send_json_success( array( 'message' => __( 'Company profile updated' ) ) );
	}

	public static function saveCompanyDepartments( $data ) {
		$columns_names = array( 
			'id'    => 'department_id', 
			'label' => 'department_name' 
		);

		// Rename columns
		$departments = _Array::renameColumns( $data['departments'], $columns_names );
		
		// Save the departments
		Department::saveDepartments( $departments );

		// Transfer updated arrays in response, need to replace temporary ids generated by react
		$departments = Department::getDepartments( ARRAY_A );

		// Convert data for react use
		$departments = _Array::renameColumns( $departments, array_flip( $columns_names ) );
		$departments = array_reverse( $departments );

		wp_send_json_success(
			array(
				'message'     => __( 'Departments Saved!' ),
				'departments' => $departments,
			)
		);
	}
}
