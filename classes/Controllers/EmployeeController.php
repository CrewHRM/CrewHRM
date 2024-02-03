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
		if ( ! empty( $mail_user_id ) && $mail_user_id !== ( $employee['employee_id'] ?? null ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'The email is associated with another account already', 'crewhrm' ) ) );
		}

		// Set profile pic
		if ( ! empty( $avatar_image['tmp_name'] ) ) {
			User::setProfilePic( $employee['employee_id'], $avatar_image );
		}

		// Create or update address
		$address_id = Address::createUpdateAddress( $employee );
		
		// Create or update the user now
		$user_id =  User::createOrUpdate(
			array(
				'user_id'      => $employee['employee_id'] ?? 0,
				'first_name'   => $employee['first_name'],
				'last_name'    => $employee['last_name'],
				'display_name' => $employee['display_name'] ?? null,
				'user_email'   => $employee['user_email'],
				'user_phone'   => $employee['user_phone'] ?? null,
				'birth_date'   => $employee['birth_date'] ?? null,
				'description'  => $employee['description'] ?? null,
				'address_id'   => $address_id,
			)
		);

		// If fails
		if ( empty( $user_id ) || ! is_numeric( $user_id ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Something went wrong!', 'crewhrm' ) ) );
		}
		
		wp_send_json_success( array( 'employee_id' => $user_id ) );
	}

	/**
	 * Get single employee info
	 *
	 * @param integer $employee_id
	 * @return void
	 */
	public static function fetchEmployee( int $employee_id ) {
		
		$employee = User::getUserInfo( $employee_id );

		if ( ! empty( $employee ) ) {
			wp_send_json_success( array( 'employee' => $employee ) );
		} else {
			wp_send_json_error( array( 'message' => esc_html__( 'Employee not found', 'crewhrm' ) ) );
		}
	}
}
