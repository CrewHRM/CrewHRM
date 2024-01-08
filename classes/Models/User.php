<?php
/**
 * User functionalities
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

/**
 * User functions
 */
class User {

	/**
	 * Validate if a user has required role
	 *
	 * @param int          $user_id The user ID to validate rule
	 * @param string|array $role    The rule to match
	 * @return bool
	 */
	public static function validateRole( $user_id, $role ) {

		if ( empty( $role ) ) {
			return true;
		}

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

	/**
	 * Search for users
	 *
	 * @param string $keyword The keyword to search user by
	 * @param array  $skip_ids Array of user IDs to exclude from the query
	 * @return array
	 */
	public static function searchUser( string $keyword, array $skip_ids = array() ) {
		if ( empty( $keyword ) ) {
			return array();
		}

		global $wpdb;

		$keyword    = esc_sql( $keyword );
		$skip_ids   = array_filter( $skip_ids, 'is_numeric' );
		$ids_not_in = ! empty( $skip_ids ) ? $skip_ids : array( 0 );
		$ids_not_in = implode( "','", $ids_not_in );

		$users = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT 
					ID AS user_id, 
					display_name, 
					user_email AS email 
				FROM 
					{$wpdb->users} 
				WHERE 
					(ID=%s OR user_login=%s OR user_email=%s OR display_name LIKE %s OR user_nicename LIKE %s) AND ID NOT IN (%s)
				LIMIT 50",
				$keyword,
				$keyword,
				$keyword,
				"%{$wpdb->esc_like( $keyword )}%",
				"%{$wpdb->esc_like( $keyword )}%",
				$ids_not_in
			),
			ARRAY_A
		);

		// Apply avatar url
		foreach ( $users as $index => $user ) {
			$users[ $index ]['avatar_url'] = get_avatar_url( $user['user_id'] );
		}

		return $users;
	}

	/**
	 * Get the role to register admin menu as it doesn't support array
	 *
	 * @param int $user_id The user to register admin menu for
	 * @return string
	 */
	public static function getAdminMenuRole( $user_id ) {
		$user_roles     = self::getUserRoles( $user_id );
		$required_roles = apply_filters( 'crewhrm_hr_roles', array( 'administrator' ) );
		$has_role       = array_values( array_intersect( $required_roles, $user_roles ) );

		// Return any of the common rules. No matter administrator or hr-manager. Both will allow accessing crew features.
		return $has_role[0] ?? null;
	}

	/**
	 * Get name of a user
	 *
	 * @param int $user_id The user ID to get name of
	 * @return string
	 */
	public static function getName( $user_id ) {
		$user = get_userdata( $user_id );
		return $user->display_name;
	}

	/**
	 * Get user info
	 *
	 * @param int $user_id The user ID to get info of
	 * @return array
	 */
	public static function getUserInfo( $user_id ) {

		$user = get_userdata( $user_id );

		return array(
			'display_name' => $user ? $user->display_name : null,
			'user_id'      => $user_id,
			'email'        => $user ? $user->user_email : null,
		);
	}
}
