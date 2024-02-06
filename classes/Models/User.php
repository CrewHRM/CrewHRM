<?php
/**
 * User functionalities
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;
use CrewHRM\Helpers\_String;
use CrewHRM\Helpers\Utilities;

/**
 * User functions
 */
class User {

	/**
	 * The meta key to set avatar image ID for
	 */
	const META_KEY_AVATAR = 'avatar_image_id';

	/**
	 * The meta ket set flag that the image is crew avatar. So it can be hidden from media library based on this.
	 */
	const META_KEY_AVATAR_CREW_FLAG = 'crewhrm_avatar_id_for_employee';

	/**
	 * Role id for employee
	 */
	const ROLE_EMPLOYEE = 'crewhrm-employee';

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

		// Get employee meta
		$meta = self::getMeta( $user_id );

		// Get address
		$address = ! empty( $meta['address_id'] ) ? Address::getAddressById( $meta['address_id'], array() ) : array();

		return array(
			'user_id'          => $user_id,
			'user_id'          => $user_id,
			'first_name'       => $user->first_name,
			'last_name'        => $user->last_name,
			'user_email'       => $user->user_email,
			'display_name'     => $user->display_name,
			'avatar_url'       => get_avatar_url( $user_id ),
			'weekly_schedules' => WeeklySchedule::getSchedule( $user_id ),
			...$meta,
			...$address,
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
	 * Get employee list
	 *
	 * @param array $args
	 * @return array
	 */
	public static function getUsers( array $args ) {

		$limit  = 30;
		$page   = Utilities::getInt( $args['page'] ?? 1, 1 ); 
		$offset = ( $page - 1 ) * $limit;

		$filters = array(
			'role'   => $args['role'],
			'number' => $limit,
			'offset' => $offset,
			'search' => ! empty( $args['search'] ) ? $args['search'] : null,
			'echo'   => false,
		);

		$users       = get_users( $filters );
		$total_count = ( new \WP_User_Query( array_merge( $filters, array( 'count_total' => true, 'number' => null ) ) ) )->get_total();
		$page_count  = ceil( $total_count / $limit );

		// Loop through users and assign meta data
		$users_array = array();
		foreach ( $users as $user ) {

			$meta = self::getMeta( $user->ID );

			$users_array[] = array(
				'user_id'         => $user->ID,
				'avatar_url'      => get_avatar_url( $user->ID ),
				'display_name'    => $user->display_name,
				'designation'     => $meta['designation'] ?? null,
				'department'      => ! empty( $meta['department_id'] ) ? Department::getDepartmentNameById( $meta['department_id'] ) : null,
				'employment_type' => $meta['employment_type'] ?? null,
				'hire_date'       => $meta['hire_date'] ?? null,
				'address'         => ! empty( $meta['address_id'] ) ? Address::getAddressById( $meta['address_id'] ) : null
			);
		}

		return array(
			'users'        => $users_array,
			'segmentation' => array(
				'total_count' => $total_count,
				'page_count'  => $page_count,
				'page'        => $page,
				'limit'       => $limit,
			)
		);
	}

	/**
	 * Create or update a user
	 *
	 * @param array $data User data array
	 * @param array $avatar_image
	 *
	 * @return int
	 */
	public static function createOrUpdate( $data, $avatar_image ) {

		$user_id   = ! empty( $data['user_id'] ) ? $data['user_id'] : null;
		$full_name = $data['first_name'] . ' ' . $data['last_name'];

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

			// Set the role for newly created user
			if ( ! empty( $data['role'] ) ) {
				( new \WP_User( $user_id) )->set_role( $data['role'] );
			}
		}
		
		wp_update_user(
			array(
				'ID'           => $user_id,
				'first_name'   => $data['first_name'],
				'last_name'    => $data['last_name'],
				'display_name' => $data['display_name'] ?? $full_name,
				'description'  => $data['description'] ?? ''
			)
		);

		// Set profile pic
		if ( ! empty( $avatar_image['tmp_name'] ) ) {
			self::setProfilePic( $user_id, $avatar_image );
		}

		// Set schedule
		if ( ! empty( $data['weekly_schedules'] ) ) {
			WeeklySchedule::updateSchedule( $user_id, $data['weekly_schedules'] );
		}

		// Create or update address
		$address_id = Address::createUpdateAddress( $data );
		
		// Prepare social links
		$links = array();
		$emergency = array();
		foreach ( $data as $key => $value ) {
			if ( strpos( $key, 'social_link_' ) === 0 ) {
				$links[ $key ] = $value;
			}

			if ( strpos( $key, 'emergency_' ) === 0 ) {
				$emergency[ $key ] = $value;
			}
		}

		// Prepare education info 
		$educational_info = is_array( $data['educational_info'] ?? null ) ? $data['educational_info'] : array();
		$filtered_educations = array();
		foreach( $educational_info as $id => $_info ) {
			if ( ! empty( $_info['program'] ) && is_numeric( $_info['passing_year'] ?? null ) ) {
				$filtered_educations[ $id ] = $_info;
			}
		}
		
		// Update meta data that can't be added in user table or anything native by WP
		self::updateMeta(
			$user_id,
			array(
				'user_phone'                 => $data['user_phone'] ?? null,
				'birth_date'                 => $data['birth_date'] ?? null,
				'gender'                     => $data['gender'] ?? null,
				'marital_status'             => $data['marital_status'] ?? null,
				'fathers_name'               => $data['fathers_name'] ?? null,
				'mothers_name'               => $data['mothers_name'] ?? null,
				'driving_license_number'     => $data['driving_license_number'] ?? null,
				'nid_number'                 => $data['nid_number'] ?? null,
				'blood_group'                => $data['blood_group'] ?? null,
				'educational_info'           => $filtered_educations,
				'address_id'                 => $address_id,
				'experience_level'           => $data['experience_level'] ?? null,
				'designation'                => $data['designation'] ?? null,
				'department_id'              => $data['department_id'] ?? null,
				'attendance_types'           => $data['attendance_types'] ?? array(),
				'salary_currency'            => $data['salary_currency'] ?? null,
				'annual_gross_salary'        => $data['annual_gross_salary'] ?? 0,
				'employment_type'            => $data['employment_type'] ?? null,
				'is_provisional'             => $data['is_provisional'] ?? null,
				'weekly_working_hour'        => $data['weekly_working_hour'] ?? null,
				'use_custom_weekly_schedule' => $data['use_custom_weekly_schedule'] ?? null,
				'contract_start_date'        => $data['contract_start_date'] ?? null,
				'contract_end_date'          => $data['contract_end_date'] ?? null,
				'probation_end_date'         => $data['probation_end_date'] ?? null,
				'employee_benefits'          => $data['employee_benefits'] ?? ( object ) array(),
				'employee_leaves'            => $data['employee_leaves'] ?? ( object ) array(),
				...$emergency,
				...$links,
			)
		);
		
		return $user_id;
	}

	/**
	 * Set uploaded file as profile pic
	 *
	 * @param int $user_id The user ID to set profile pic for
	 * @param array $file The uploaded file data array
	 * @return bool
	 */
	public static function setProfilePic( $user_id, $file ) {
		
		// Alter the name and handle upload
		$upload = wp_handle_upload( $file, array( 'test_form' => false ) );

		if ( isset( $upload['file'] ) ) {
			// Create a post for the file
			$attachment    = array(
				'post_mime_type' => $upload['type'],
				'post_title'     => $file['name'],
				'post_content'   => '',
				'post_status'    => 'private',
				'guid'           => $upload['url'],
			);
			$attachment_id = wp_insert_attachment( $attachment, $upload['file'] );
			require_once ABSPATH . 'wp-admin/includes/image.php';

			// Generate meta data for the file
			$attachment_data = wp_generate_attachment_metadata( $attachment_id, $upload['file'] );
			wp_update_attachment_metadata( $attachment_id, $attachment_data );
			update_post_meta( $attachment_id, self::META_KEY_AVATAR_CREW_FLAG, $user_id );

			// Delete existing one
			$existing_id = self::getMeta( $user_id, self::META_KEY_AVATAR );
			if ( ! empty( $existing_id ) ) {
				FileManager::deleteFile( $existing_id );
			}

			// Set the media as avatar url
			self::updateMeta( $user_id, self::META_KEY_AVATAR, $attachment_id );

			return true;
		}

		return false;
	}

	/**
	 * Update crew meta for the user
	 *
	 * @param int $user_id
	 * @param string $key
	 * @param mixed $value
	 * @return void
	 */
	public static function updateMeta( $user_id, $key, $value = null ) {

		// Get existing meta
		$meta = self::getMeta( $user_id );

		if ( is_array( $key ) ) {
			// Update bulk meta data array
			$meta = array_merge( $meta, $key );

		} else {
			// Update single meta
			$meta[ $key ] = $value;
		}
		
		Meta::employee( $user_id )->updateBulkMeta( $meta );
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

		// Get Crew meta data
		$meta = Meta::employee( $user_id )->getMeta();
		$meta = ! is_array( $meta ) ? array() : $meta;

		// Get WP specific meta data
		$wp_meta = array(
			'description'
		);
		foreach ( $wp_meta as $_key ) {
			$meta[ $_key ] = get_user_meta( $user_id, $_key, true );
		}

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
