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
	 * @param array $exclude  Array of user IDs to exclude from the query
	 * @return array
	 */
	public static function searchUser( string $keyword, array $exclude = array() ) {
		if ( empty( $keyword ) ) {
			return array();
		}

		$keyword = esc_sql( $keyword );

		$where_clause  = " ID='{$keyword}'";
		$where_clause .= " OR user_login='{$keyword}'";
		$where_clause .= " OR user_email='{$keyword}'";
		$where_clause .= " OR display_name LIKE '%{$keyword}%'";
		$where_clause .= " OR user_nicename LIKE '%{$keyword}%'";

		if ( ! empty( $exclude ) ) {
			$ids = implode( ',', $exclude );
			$where_clause = "({$where_clause}) AND ID NOT IN ({$ids})";
		}

		global $wpdb;
		$users = $wpdb->get_results(
			"SELECT ID AS user_id, display_name, user_email AS email FROM {$wpdb->users} WHERE {$where_clause} LIMIT 50",
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
}
