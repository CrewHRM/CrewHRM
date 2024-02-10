<?php
/**
 * Employment history manager
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

class Employment {

	/**
	 * The employment data to insert or update
	 *
	 * @param int   $user_id The user ID to save employment data for
	 * @param array $data The employment data array
	 * @param bool  $update Whether to update latest employment or create new in case of promotion.
	 *
	 * @return int The employment ID
	 */
	public static function createUpdate( $user_id, $data, $update ) {
		$payload = array(
			'employee_user_id'         => $user_id,
			'designation'              => $data['designation'] ?? null,
			'department_id'            => $data['department_id'] ?? null,
			'employment_type'          => $data['employment_type'] ?? null,
			'annual_gross_salary'      => $data['annual_gross_salary'] ?? 0,
			'salary_currency'          => $data['salary_currency'] ?? null,
			'reporting_person_user_id' => $data['reporting_person_user_id'] ?? null,
			'start_date'               => $data['start_date'] ?? null,
			'end_date'                 => $data['end_date'] ?? null,
			'attendance_type'          => $data['attendance_type'] ?? null,
			'is_provisional'           => $data['is_provisional'] ?? null,
			'probation_end_date'       => $data['probation_end_date'] ?? null,
			'weekly_working_hour'      => $data['weekly_working_hour'] ?? null,
			'hire_date'                => $data['hire_date'] ?? null,
		);

		global $wpdb;

		$latest        = self::getLatestEmployment( $user_id, array() );
		$employment_id = $latest['employment_id'] ?? null;

		// If not update, or no entry yet, then create new
		if ( ! $update || empty( $latest ) ) {
			$wpdb->insert(
				$wpdb->crewhrm_employments,
				$payload
			);
			$employment_id = $wpdb->insert_id;

		} else {
			$wpdb->update(
				$wpdb->crewhrm_employments,
				$payload,
				array( 'employment_id' => $employment_id )
			);
		}

		return $employment_id;
	}

	/**
	 * Get latest employment data by user ID
	 *
	 * @param int   $user_id The user ID to get employment data of
	 * @param mixed $fallback Fallback data to return
	 *
	 * @return array|mixed
	 */
	public static function getLatestEmployment( $user_id, $fallback = null ) {
		$employments = self::getEmployments( $user_id, 1 );
		return ! empty( $employments ) ? $employments[0] : $fallback;
	}

	/**
	 * Get all employments by user ID
	 *
	 * @param int $user_id The user ID to get employment data of
	 * @param int $limit How many entry to get
	 *
	 * @return void
	 */
	public static function getEmployments( $user_id, $limit = null ) {

		global $wpdb;

		$limit = ! empty( $limit ) ? $wpdb->prepare( " LIMIT %d", $limit ) : '';

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$wpdb->crewhrm_employments} WHERE employee_user_id=%d ORDER BY employment_id DESC {$limit}",
				$user_id
			),
			ARRAY_A
		);

		// Get employment specific related data
		foreach ( $rows as $index => $row ) {
			
			$reporting_person_id = $row['reporting_person_user_id'] ?? 0;

			$rows[ $index ]['reporting_person'] = ! $reporting_person_id ? null : array(
				'avatar_url'   => get_avatar_url( $reporting_person_id ),
				'display_name' => User::getDisplayName( $reporting_person_id ),
			);

			$rows[ $index ]['department_name'] = ! empty( $row['department_id'] ) ? Department::getDepartmentNameById( $row['department_id'] ) : null;
		}

		return _Array::castRecursive( $rows );
	}
}
