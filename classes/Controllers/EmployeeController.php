<?php
/**
 * Employee controller from admin screens
 */

namespace CrewHRM\Controllers;

use CrewHRM\Models\Address;
use CrewHRM\Models\User;

/**
 * Controller class
 */
class EmployeeController {

	const PREREQUISITES = array(
		'updateEmployee' => array(
			'role' => 'administrator'
		),
		'fetchEmployee' => array(
			'role' => 'administrator'
		),
		'getEmployeeList' => array(
			'role' => 'administrator'
		)
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

		// Show warning for existing email
		$mail_user_id = User::getUserIdByEmail( $employee['user_email'] );
		if ( ! empty( $mail_user_id ) && $mail_user_id !== ( $employee['user_id'] ?? null ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'The email is associated with another account already', 'crewhrm' ) ) );
		}

		// Create or update the user now
		$employee['role'] = User::ROLE_EMPLOYEE;
		$user_id          =  User::createOrUpdate( $employee, $avatar_image );

		// If fails
		if ( empty( $user_id ) || ! is_numeric( $user_id ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Something went wrong!', 'crewhrm' ) ) );
		}
		
		wp_send_json_success( 
			array( 
				'user_id' => $user_id, 
				'employee' => User::getUserInfo( $user_id ) 
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
		
		$users = User::getUsers( array( ...$filters, 'role' => User::ROLE_EMPLOYEE ) );
		
		wp_send_json_success(
			array(
				'employees' => $users['users'],
				'segmentation' => $users['segmentation']
			)
		);
	}
}
