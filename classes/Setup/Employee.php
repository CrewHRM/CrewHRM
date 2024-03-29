<?php
/**
 * Employee related hooks
 *
 * @package crewhrm
 */

namespace CrewHRM\Setup;

use CrewHRM\Models\User;

/**
 * Employee class
 */
class Employee {

	/**
	 * Register hooks
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'addEmployeeRole' ) );
		add_filter( 'get_avatar_url', array( $this, 'avatarUrl' ), 10, 3 );
	}

	/**
	 * Add custom role for crewhrm employees
	 *
	 * @return void
	 */
	public function addEmployeeRole() {
		add_role(
			User::ROLE_EMPLOYEE,
			esc_html__( 'Employee', 'hr-management' ),
			array(
				'read' => true,
			)
		);
	}

	/**
	 * Custom URL avatar url
	 *
	 * @param string     $url
	 * @param int|string $user_id
	 * @param array      $args
	 *
	 * @return string
	 */
	public function avatarUrl( $url, $user_id, $args ) {

		if ( is_numeric( $user_id ) ) {
			$avatar_id = User::getMeta( $user_id, User::META_KEY_AVATAR );
			if ( ! empty( $avatar_id ) ) {
				$url = wp_get_attachment_url( $avatar_id );
			}
		}

		return $url;
	}
}
