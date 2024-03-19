<?php
/**
 * Employee controller from admin screens
 */

namespace CrewHRM\Controllers;

use CrewHRM\Models\Address;
use CrewHRM\Models\Employment;
use CrewHRM\Models\User;

/**
 * Controller class
 */
class EmployeeController {

	const PREREQUISITES = array(
		'updateEmployee'         => array(
			'role' => 'administrator',
		),
		'fetchEmployee'          => array(
			'nopriv' => true,
		),
		'getEmployeeList'        => array(
			'role' => ['administrator', User::ROLE_EMPLOYEE],
		),
		'changeEmploymentStatus' => array(
			'role' => 'administrator',
		),
	);

	/**
	 * Add/or update an employee profile
	 *
	 * @param array $employee Empoyee data array
	 *
	 * @return void
	 */
	public static function updateEmployee( array $employee, array $avatar_image = array() ) {

		// Check if required fields provided
		if ( empty( $employee['first_name'] ) || empty( $employee['last_name'] ) || empty( $employee['user_email'] ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Required fields missing', 'crewhrm' ) ) );
		}

		// To Do: Allow existing email for new manual entry if no emaployment is linked already.
		// To Do: Restrict email field edit once an employment is created
		// To Do: Add activation key during creating new
		// To Do: Send email, and onboard through email link

		// Show warning for existing email
		$mail_user_id = User::getUserIdByEmail( $employee['user_email'] );
		if ( ! empty( $mail_user_id ) && $mail_user_id !== ( $employee['user_id'] ?? null ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'The email is associated with another account already', 'crewhrm' ) ) );
		}

		// Show warning for duplicate employee ID
		if ( ! empty( $employee['employee_id'] ) ) {

			// Make the employee consisten using leading zero
			if ( is_numeric( $employee['employee_id'] ) ) {
				$employee['employee_id'] = User::padStringEmployeeId( $employee['employee_id'] );
			}

			$employee_user_id = User::getUserIdByEmployeeId( $employee['employee_id'] );
			if ( ! empty( $employee_user_id ) && $employee_user_id != ( $employee['user_id'] ?? null ) ) {
				wp_send_json_error( array( 'message' => __( 'The employee ID exists', 'crewhrm' ) ) );
			}
		}
		
		// Create or update the user now
		$user_id = User::createOrUpdateEmployee( $employee, $avatar_image );

		// If fails
		if ( empty( $user_id ) || ! is_numeric( $user_id ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Something went wrong!', 'crewhrm' ) ) );
		}

		wp_send_json_success(
			array(
				'user_id'  => $user_id,
				'employee' => User::getUserInfo( $user_id ),
			)
		);
	}

	/**
	 * Get single employee info
	 *
	 * @param integer $user_id
	 * @return void
	 */
	public static function fetchEmployee( int $user_id ) {

		// Validate access
		if ( get_current_user_id() != $user_id && ! User::validateRole( get_current_user_id(), apply_filters( 'crewhrm_hr_roles', array( 'administrator' ) ) ) ) {
			wp_send_json_error( array( 'message' => __( 'Access denied!', 'crewhrm' ) ) );
		}

		$employee = User::getUserInfo( $user_id );

		if ( ! empty( $employee ) ) {
			wp_send_json_success( array( 'employee' => $employee ) );
		} else {
			wp_send_json_error( array( 'message' => esc_html__( 'Employee not found', 'crewhrm' ) ) );
		}
	}

	/**
	 * Get employee list ideall for dashboard
	 *
	 * @param array $filters
	 * @return void
	 */
	public static function getEmployeeList( array $filters = array() ) {

		$users = User::getUsers(
			array_merge(
				$filters,
				array(
					'role' => User::ROLE_EMPLOYEE,
				)
			)
		);

		wp_send_json_success(
			array(
				'employees'    => $users['users'],
				'segmentation' => $users['segmentation'],
			)
		);
	}

	/**
	 * Change employment status for single user
	 *
	 * @param integer $user_id The employee user ID to change status for
	 * @param string  $status The new status
	 *
	 * @return void
	 */
	public static function changeEmploymentStatus( int $user_id, string $status ) {

		$success = Employment::changeStatus( $user_id, $status );

		if ( $success ) {
			wp_send_json_success( array( 'message' => __( 'Employment status has been changed successfully!' ) ) );
			return;
		}

		wp_send_json_error( array( 'message' => __( 'Employment not found to change status' ) ) );
	}
}
