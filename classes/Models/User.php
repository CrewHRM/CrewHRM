<?php

namespace CrewHRM\Models;

class User {

	/**
	 * Validate if a user has required role
	 *
	 * @param int          $user_id
	 * @param string|array $role
	 * @return bool
	 */
	public static function validateRole( $user_id, $role ) {
		$roles          = is_array( $role ) ? $role : array( $role );
		$assigned_roles = self::getUserRoles( $user_id );

		return count( array_diff( $roles, $assigned_roles ) ) < count( $roles );
	}

	/**
	 * Get user roles by user id
	 *
	 * @param int $user_id User ID to get roles of
	 * @return array
	 */
	public static function getUserRoles( $user_id ) {
		$user_data = get_userdata( $user_id );
		return ( is_object( $user_data ) && ! empty( $user_data->roles ) ) ? $user_data->roles : array();
	}
}
