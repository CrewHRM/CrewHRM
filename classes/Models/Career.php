<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

class Career {
	/**
	 * Prepare renderable filters
	 *
	 * @return array
	 */
	public static function getFilterList() {
		$filters = array(
			'departments' => array(
				'section_label'  => __( 'Departments', 'crewhrm' ),
				'selection_type' => 'list',
				'options'        => array() 
			),
			'locations' => array(
				'section_label'  => __( 'Locations', 'crewhrm' ),
        		'selection_type' => 'tag',
        		'options'        => array() 
			),
			'employment_type' => array(
				'section_label'  => __( 'Locations', 'crewhrm' ),
        		'selection_type' => 'list',
        		'options'        => array() 
			)
		);

		// Departments first
		$departments = Department::getDepartments();
		$departments = _Array::indexify( $departments, 'department_id' );
		foreach ( $departments as $id => $department ) {
			$filters['departments']['options'][] = array(
				'department_name' => $department['department_name'],
				'department_id'   => $department['department_id'],
			);
		}

		return $filters;
	}
}