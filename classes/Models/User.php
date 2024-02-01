<?php
/**
 * User functionalities
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;
use CrewHRM\Helpers\_String;

/**
 * User functions
 */
class User {

	/**
	 * User meta key to store only crewhrm specific data
	 */
	const META_KEY = 'crewhrm-user-meta';

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
		$skip_ids   = _Array::getArray( $skip_ids, false, 0 );
		$ids_places = _String::getPlaceHolders( $skip_ids );

		$users = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT 
					ID AS user_id, 
					display_name, 
					user_email AS email 
				FROM 
					{$wpdb->users} 
				WHERE 
					(
						ID=%s 
						OR user_login=%s 
						OR user_email=%s 
						OR display_name LIKE %s 
						OR user_nicename LIKE %s
					) 
					AND ID NOT IN ({$ids_places})
				LIMIT 50",
				$keyword,
				$keyword,
				$keyword,
				"%{$wpdb->esc_like( $keyword )}%",
				"%{$wpdb->esc_like( $keyword )}%",
				...$skip_ids
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
		if ( empty( $user ) ) {
			return $user;
		}

		return array(
			'user_id'      => $user_id,
			'employee_id'  => $user_id,
			'first_name'   => $user->first_name,
			'last_name'    => $user->last_name,
			'user_email'   => $user->user_email,
			'display_name' => $user->display_name,
			'user_phone'   => self::getMeta( $user_id, 'user_phone' )
		);
	}

	
	/**
	 * Get unique username
	 *
	 * @param string $username The current username
	 *
	 * @return string
	 */
	public static function getUniqueUsername( string $username ) {
		$_user_name = _String::consolidate( (string) $username, true );
		$_user_name = strtolower( str_replace( ' ', '-', $_user_name ) );
		$_user_name = preg_replace( '/[^A-Za-z\-]/u', '', $_user_name );
		$_user_name = empty( $_user_name ) ? 'employee' : $_user_name;
		$_user_name = preg_replace( '/-+/', '-', $_user_name );

		$_new_name = $_user_name;
		$index     = 0;

		// Get the slug until it's not avaialble in database
		while ( username_exists( $_new_name ) ) {
			$index++;
			$_new_name = $_user_name . '-' . $index;
		}

		return $_new_name;
	}


	/**
	 * Create or update a user
	 *
	 * @param array $data User data array
	 *
	 * @return int
	 */
	public static function createOrUpdate( $data ) {

		$user_id   = ! empty( $data['user_id'] ) ? $data['user_id'] : null;
		$full_name = $data['first_name'] . ' ' . $data['last_name'];

		error_log( var_export( $data, true ) );

		// Create new user if 
		if ( ! $user_id ) {
			$user_id = wp_create_user(
				self::getUniqueUsername( $full_name ),
				wp_generate_password(),
				$data['user_email']
			);

			if ( is_wp_error( $user_id ) || empty( $user_id ) || ! is_numeric( $user_id ) ) {
				return false;
			}
		}
		
		wp_update_user(
			array(
				'ID'           => $user_id,
				'first_name'   => $data['first_name'],
				'last_name'    => $data['last_name'],
				'display_name' => $data['display_name'] ?? $full_name
			)
		);

		// Update meta data that can't be added in user table or anything native by WP
		self::updateMeta( $user_id, 'user_phone', $data['user_phone'] ?? null );
		
		return $user_id;
	}

	/**
	 * Update crew meta for the user
	 *
	 * @param int $user_id
	 * @param string $key
	 * @param mixed $value
	 * @return void
	 */
	public static function updateMeta( $user_id, $key, $value ) {
		$meta = self::getMeta( $user_id );
		$meta[ $key ] = $value;
		update_user_meta( $user_id, self::META_KEY, $meta );
	}
	
	/**
	 * Get crew meta data
	 *
	 * @param int $user_id
	 * @param string $key
	 * @param mixed $fallback
	 *
	 * @return mixed
	 */
	public static function getMeta( $user_id, $key = null, $fallback = null ) {
		$meta = get_user_meta( $user_id, self::META_KEY, true );
		$meta = ! is_array( $meta ) ? array() : $meta;
		return $key ? ( $meta[ $key ] ?? $fallback ) : $meta;
	}
	
	/**
	 * Get user ID by email
	 *
	 * @param string $email The user email
	 * 
	 * @return void
	 */
	public static function getUserIdByEmail( $email ) {
		global $wpdb;
		return ( new Field( $wpdb->users ) )->getField( array( 'user_email' => $email ), 'ID' );
	}
}
