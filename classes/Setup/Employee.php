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
	 * Avatar size
	 */
	const AVATAR_SIZE = 'crewhrm-employee-avatar';

	/**
	 * Register hooks
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'addEmployeeRole' ) );
		add_filter( 'get_avatar_url', array( $this, 'avatarUrl' ), 10, 3 );
		add_action( 'init', array( $this, 'registerAvatarSize' ) );
		// add_action( 'delete_user', array( $this, 'deleteUserInfo' ), 10, 2 );
	}

	/**
	 * Register custom size for crew avatar url
	 *
	 * @return void
	 */
	public function registerAvatarSize() {
		add_image_size( self::AVATAR_SIZE, 512, 512, true );
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
				$url = wp_get_attachment_image_url( $avatar_id, self::AVATAR_SIZE );
			}
		}

		return $url;
	}

	/**
	 * When a user is about to be deleted
	 *
	 * @param int $user_id
	 * @param int|null $assign_to
	 * @return void
	 */
	/* public function deleteUserInfo( $user_id, $assign_to ) {

		if ( empty( $assign_to ) ) {
			User::deleteEmployee( $user_id );
		} else {
			User::
		}
	} */
}
