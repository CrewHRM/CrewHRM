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
			'is_provisional'           => $data['is_provisional'] ?? 0,
			'probation_end_date'       => $data['probation_end_date'] ?? null,
			'weekly_working_hour'      => $data['weekly_working_hour'] ?? null,
			'hire_date'                => $data['hire_date'] ?? null,
			'employment_status'        => $data['employment_status'] ?? 'active',
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

		$limit = ! empty( $limit ) ? $wpdb->prepare( ' LIMIT %d', $limit ) : '';

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT 
					* 
				FROM 
					{$wpdb->crewhrm_employments} 
				WHERE 
					employee_user_id=%d 
				ORDER BY employment_id DESC {$limit}",
				$user_id
			),
			ARRAY_A
		);

		// Get employment specific related data
		foreach ( $rows as $index => $row ) {
			$rows[ $index ]['reporting_person'] = self::getMinimalInfo( $row['reporting_person_user_id'] ?? 0 );
			$rows[ $index ]['department_name']  = ! empty( $row['department_id'] ) ? Department::getDepartmentNameById( $row['department_id'] ) : null;
		}

		return _Array::castRecursive( $rows );
	}

	/**
	 * Get reporting person info
	 *
	 * @param int $user_id
	 * @return array|null
	 */
	public static function getMinimalInfo( $user_id, $fallback = null ) {

		if ( empty( $user_id ) ) {
			return $fallback;
		}

		// Get the latest employment of the reporting person
		global $wpdb;
		$latest_employment = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT 
					employment_id, 
					designation 
				FROM 
					{$wpdb->crewhrm_employments} 
				WHERE 
					employee_user_id=%d 
				ORDER BY employment_id 
				DESC LIMIT 1",
				$user_id
			),
			ARRAY_A
		);

		return empty( $latest_employment ) ? null : array(
			'avatar_url'   => get_avatar_url( $user_id ),
			'display_name' => User::getDisplayName( $user_id ),
			'designation'  => $latest_employment['designation'],
		);
	}

	/**
	 * Change the status of the latest employment
	 *
	 * @param int    $user_id
	 * @param string $status
	 * @return bool
	 */
	public static function changeStatus( $user_id, $status ) {

		$employment = self::getLatestEmployment( $user_id );

		if ( ! empty( $employment ) ) {
			Field::employments()->updateField(
				array( 'employment_status' => $status ),
				array( 'employment_id' => $employment['employment_id'] )
			);

			return true;
		}

		return false;
	}

	/**
	 * Get subordinates of a user
	 *
	 * @param int $user_id
	 * @return array
	 */
	public static function getSubordinates( $user_id ) {

		global $wpdb;
		$users = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT 
					_employee.employee_user_id, 
					_user.display_name
				FROM 
					{$wpdb->crewhrm_employments} _employee
					INNER JOIN {$wpdb->users} _user ON _employee.employee_user_id=_user.ID
				WHERE
					_employee.reporting_person_user_id=%d
				ORDER BY
					_employee.employment_id DESC
				",
				$user_id
			),
			ARRAY_A
		);

		$users = _Array::castRecursive( $users );

		foreach ( $users as $index => $user ) {
			$users[ $index ]['avatar_url'] = get_avatar_url( $user['employee_user_id'] );
		}

		return $users;
	}

	/**
	 * Get total employee count by status
	 *
	 * @return int
	 */
	public static function getTotalEmployeeCount( $status = 'active', $department_id = null ) {
		
		global $wpdb;

		$where = '';

		if ( ! empty( $status ) ) {
			$where .= $wpdb->prepare( ' AND employment_status=%s', $status );
		}

		if ( ! empty( $department_id ) ) {
			$where .= $wpdb->prepare( ' AND department_id=%d', $department_id );
		}

		$count = $wpdb->get_var(
			"SELECT COUNT(DISTINCT employee_user_id) FROM {$wpdb->crewhrm_employments} WHERE 1=1 {$where}"
		);

		return ( int ) $count;
	}
}
