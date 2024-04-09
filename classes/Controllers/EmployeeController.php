<?php
/**
 * Employee controller from admin screens
 */

namespace CrewHRM\Controllers;

use CrewHRM\Helpers\File;
use CrewHRM\Models\Employment;
use CrewHRM\Models\User;

/**
 * Controller class
 */
class EmployeeController {

	const PREREQUISITES = array(
		'updateEmployee'         => array(

		),
		'fetchEmployee'          => array(

		),
		'getEmployeeList'        => array(

		),
		'changeEmploymentStatus' => array(
			'role' => 'administrator',
		),
		'getEmployeeListMetaData' => array(
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
	public static function updateEmployee( array $employee, array $avatar_image = array(), array $educational_certificates = array(), array $photo_id_card = array(), bool $is_admin = false, string $onboarding_step = '' ) {

		$current_user_id = get_current_user_id();

		// If acting as admin but not admin then show error
		if ( $is_admin && ! User::hasAdministrativeRole( $current_user_id ) ) {
			wp_send_json_error( array( 'message' => __( 'Access denied!', 'crewhrm' ) ) );
		}

		// Check if required fields provided
		if ( empty( $employee['first_name'] ) || empty( $employee['last_name'] ) || ( $is_admin && empty( $employee['user_email'] ) ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Required fields missing', 'crewhrm' ) ) );
		}

		// If it is onboarding by end user, use current user ID as the employee
		if ( ! $is_admin ) {
			$employee['user_id'] = $current_user_id;
		}

		// To Do: Allow existing email for new manual entry if no emaployment is linked already.
		// To Do: Restrict email field edit once an employment is created

		// Show warning for existing email
		$mail_user_id = $is_admin ? User::getUserIdByEmail( $employee['user_email'] ) : null;
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

		$educational_certificates = File::organizeUploadedHierarchy( $educational_certificates );
		
		// Create or update the user now
		$user_id = User::createOrUpdateEmployee( $employee, $avatar_image, $photo_id_card, $educational_certificates );

		// If fails
		if ( empty( $user_id ) || ! is_numeric( $user_id ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Something went wrong!', 'crewhrm' ) ) );
		}

		// Update completed step array
		$completed_steps = array();
		if ( ! $is_admin && ! empty( $onboarding_step ) ) {
			$completed_steps = User::updatedCompletedSteps( $current_user_id, $onboarding_step );
		}
		
		wp_send_json_success(
			array(
				'user_id'         => $user_id,
				'employee'        => User::getUserInfo( $user_id ),
				'completed_steps' => $completed_steps
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
		if ( get_current_user_id() != $user_id && ! User::hasAdministrativeRole( get_current_user_id() ) ) {
			wp_send_json_error( array( 'message' => __( 'Access denied!', 'crewhrm' ) ) );
		}

		$employee = User::getUserInfo( $user_id );

		if ( ! empty( $employee ) ) {
			wp_send_json_success(
				array( 
					'employee' => $employee, 
					'completed_steps' => User::getCompletedSteps( $user_id )
				) 
			);
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
	public static function getEmployeeList( array $filters = array(), bool $is_admin = false ) {

		$user_id = get_current_user_id();
		$administrative = User::hasAdministrativeRole( $user_id );

		if ( ( $is_admin && ! $administrative ) || ( ! $administrative && ! User::validateRole( $user_id, User::ROLE_EMPLOYEE ) ) ) {
			wp_send_json_error( array( 'message' => __( 'Access denied!', 'crewhrm' ) ) );
		}

		$users = User::getEmployeeUsers( $filters );

		// Remove sensitive data if it is not admin access
		if ( ! $is_admin ) {

			$keep = array(
				'user_id', 
				'avatar_url', 
				'display_name',
				'designation',
				'department_name',
				'employee_id',
			);

			foreach ( $users['users'] as $index => $user ) {
				foreach ( $user as $col => $val ) {
					if ( ! in_array( $col, $keep ) ) {
						unset( $users['users'][ $index ][ $col ] );
					}
				}
			}
		}

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

	/**
	 * Get employee list meta data, for example total employee, pending leave count (provided from pro) and so on
	 *
	 * @return void
	 */
	public static function getEmployeeListMetaData() {

		$data = array(
			'employee' => Employment::getTotalEmployeeCount()
		);

		wp_send_json_success( apply_filters( 'crewhrm_employee_list_tab_content_count', $data ) );
	}
}
