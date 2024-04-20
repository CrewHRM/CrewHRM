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
	 * User meta key to set crew flag
	 */
	const META_KEY_CREW_FLAG = 'crewhrm_user_role';

	/**
	 * Meta key for employee activation
	 */
	const META_KEY_FOR_TOKEN = 'crewhrm-employee-activation-key';

	/**
	 * The get parameter to accept onboarding token through.
	 */
	const ONBOARDING_GET_KEY = 'onboarding-token';

	/**
	 * The meta key to store completed onboarding step names
	 */
	const ONBOARDING_COMPLETED_STEP_KEY = 'onboarding-completed-steps';

	/**
	 * Currently supported onboarding steps
	 */
	const ONBOARDING_STEPS = array(
		'personal_info',
		'emergency_contact',
		'payment_method',
		'supporting_documents'
	);

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
	public static function searchUser( string $keyword, string $role = '', array $skip_ids = array() ) {
		if ( empty( $keyword ) ) {
			return array();
		}

		global $wpdb;

		$keyword    = esc_sql( $keyword );
		$skip_ids   = array_values( _Array::getArray( $skip_ids, false, 0 ) );
		$ids_places = _String::getPlaceHolders( $skip_ids );

		$role_clause = ! empty( $role ) ? $wpdb->prepare( ' AND _meta.meta_value=%s', $role ) : '';

		$users = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT 
					_user.ID AS user_id, 
					_user.display_name, 
					_user.user_email AS email 
				FROM 
					{$wpdb->users} _user
					LEFT JOIN {$wpdb->usermeta} _meta ON _user.ID=_meta.user_id AND _meta.meta_key=%s
				WHERE 
					(
						_user.ID=%s 
						OR _user.user_login=%s 
						OR _user.user_email=%s 
						OR _user.display_name LIKE %s 
						OR _user.user_nicename LIKE %s
					) 
					AND _user.ID NOT IN ({$ids_places})
					{$role_clause}
				LIMIT 50",
				self::META_KEY_CREW_FLAG,
				$keyword,
				$keyword,
				$keyword,
				"%{$wpdb->esc_like( $keyword )}%",
				"%{$wpdb->esc_like( $keyword )}%",
				...$skip_ids
			),
			ARRAY_A
		);

		$users_array = array();

		// Convert to generic data structure in favour of instant search component
		foreach ( $users as $index => $user ) {

			$emp_info = Employment::getMinimalInfo( $user['user_id'], array() );

			$users_array[] = array(
				'id'            => $user['user_id'],
				'thumbnail_url' => get_avatar_url( $user['user_id'] ),
				'label'         => $user['display_name'],
				'unique_name'   => $user['email'],
				'hint'          => $emp_info['designation'] ?? null,
			);
		}

		return $users_array;
	}

	/**
	 * Get the role to register admin menu as it doesn't support array
	 *
	 * @param int $user_id The user to register admin menu for
	 * @return string
	 */
	public static function getAdminMenuRole( $user_id ) {
		$user_roles = self::getUserRoles( $user_id );
		$has_role   = array_values( array_intersect( self::getAdministrativeRoles(), $user_roles ) );

		// Return any of the common rules. No matter administrator or hr-manager. Both will allow accessing crew features.
		return $has_role[0] ?? null;
	}

	/**
	 * Get the roles array that has administrative access in CrewHRM
	 *
	 * @return array
	 */
	public static function getAdministrativeRoles() {
		return apply_filters( 'crewhrm_hr_roles', array( 'administrator' ) );
	}

	/**
	 * Check if a user has administrative role
	 *
	 * @param int $user_id
	 * @return boolean
	 */
	public static function hasAdministrativeRole( $user_id ) {
		return self::validateRole( $user_id, self::getAdministrativeRoles() );
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

		// Get employment data
		$employment      = Employment::getLatestEmployment( $user_id, array() );
		$employment_meta = $employment ? Employment::getMeta( $employment['employment_id'] ) : array();

		// Get address
		$address = ! empty( $meta['address_id'] ) ? Address::getAddressById( $meta['address_id'], array() ) : array();

		return array_merge(
			array(
				'user_id'          => $user_id,
				'first_name'       => $user->first_name,
				'last_name'        => $user->last_name,
				'user_email'       => $user->user_email,
				'display_name'     => $user->display_name,
				'avatar_url'       => get_avatar_url( $user_id ),
				'weekly_schedules' => $employment ? WeeklySchedule::getSchedule( $employment['employment_id'] ) : null,
				'department_name'  => $employment ? Department::getDepartmentNameById( $employment['department_id'] ) : null,
				'reporting_person' => $employment ? Employment::getMinimalInfo( $employment['reporting_person_user_id'] ?? 0 ) : null,
				'subordinates'     => Employment::getSubordinates( $user_id ),
				'employments'      => Employment::getEmployments( $user_id ),
			),
			$meta,
			$employment,
			$employment_meta,
			$address
		);
	}

	/**
	 * Get display name of a user
	 *
	 * @param int $user_id
	 * @return string
	 */
	public static function getDisplayName( $user_id ) {
		$args = array(
			'ID' => $user_id,
		);

		global $wpdb;
		return ( new Field( $wpdb->users ) )->getField( $args, 'display_name' );
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
	 * Delete a user, usually used through user deletion hook
	 *
	 * @param int $user_id
	 * @return void
	 */
	/* public static function deleteUser( $user_id ) {

		global $wpdb;

		// Delete employment
		Employment::deleteEmployment( array( 'user_id' => $user_id ) );

		// Delete employee meta
		Meta::employee( $user_id )->deleteMeta();

		// Delete comments
		// Comme
	} */

	/**
	 * Replace user ID to another one
	 *
	 * @param int $user_id
	 * @param int $assign_to
	 * @return void
	 */
	public static function replaceUser( $user_id, $assign_to ) {

	}

	/**
	 * Get employee list
	 *
	 * @param array $args
	 * @return array
	 */
	public static function getEmployeeUsers( array $args ) {

		$limit  = DB::getLimit( $args['limit'] ?? null );
		$page   = Utilities::getInt( $args['page'] ?? 1, 1 );
		$offset = ( $page - 1 ) * $limit;

		global $wpdb;

		$where_clause = '';

		// Search employee by keyword
		if ( ! empty( $args['search'] ) ) {
			$where_clause .= $wpdb->prepare( ' AND _user.display_name LIKE %s', "%{$wpdb->esc_like( $args['search'] )}%" );
		}

		// Get by department ID
		if ( ! empty( $args['department_id'] ) ) {
			$where_clause .= $wpdb->prepare( ' AND _employment.department_id=%d', $args['department_id'] );
		}

		// Employment status filter
		if ( ! empty( $args['employment_status'] ) ) {
			$where_clause .= $wpdb->prepare( ' AND _employment.employment_status=%s', $args['employment_status'] );
		}

		$users = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT 
					_user.ID AS user_id,
					_user.display_name,
					_user.user_email,
					_employment.employment_id,
					_employment.designation,
					_employment.employment_status,
					_employment.department_id,
					_employment.employment_type,
					_employment.hire_date,
					_employment.reporting_person_user_id
				FROM 
					{$wpdb->users} _user 
					INNER JOIN {$wpdb->usermeta} _meta ON _user.ID=_meta.user_id AND _meta.meta_key=%s AND _meta.meta_value=%s
					INNER JOIN {$wpdb->crewhrm_employments} _employment ON _employment.employee_user_id=_user.ID
				WHERE 
					1=1 
					{$where_clause}
				ORDER BY 
					_employment.employment_id DESC
				LIMIT 
					%d 
				OFFSET 
					%d",
				self::META_KEY_CREW_FLAG,
				self::ROLE_EMPLOYEE,
				$limit,
				$offset
			),
			ARRAY_A
		);

		$users = _Array::castRecursive( $users );

		$total_count = (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT 
					COUNT(_user.ID)
				FROM 
					{$wpdb->users} _user 
					INNER JOIN {$wpdb->usermeta} _meta ON _user.ID=_meta.user_id AND _meta.meta_key=%s AND _meta.meta_value=%s
					LEFT JOIN {$wpdb->crewhrm_employments} _employment ON _employment.employee_user_id=_user.ID
				WHERE 
					1=1 
					{$where_clause}",
				self::META_KEY_CREW_FLAG,
				self::ROLE_EMPLOYEE
			)
		);

		$page_count = ceil( $total_count / $limit );

		// Loop through users and assign meta data
		$users_array = array();
		foreach ( $users as $user ) {

			$meta       = self::getMeta( $user['user_id'] );
			$address    = ! empty( $meta['address_id'] ) ? Address::getAddressById( $meta['address_id'], array() ) : array();
			$local_time = ! empty( $address['timezone'] ) ? ( new \DateTime( 'now', new \DateTimeZone( $address['timezone'] ) ) )->format( 'H:i a' ) : null;

			$users_array[] = array(
				'user_id'           => $user['user_id'],
				'avatar_url'        => get_avatar_url( $user['user_id'] ),
				'email'             => $user['user_email'],
				'display_name'      => $user['display_name'],
				'employment_id'     => $user['employment_id'],
				'employee_id'       => $meta['employee_id'],
				'employment_status' => $user['employment_status'] ?? null,
				'designation'       => $user['designation'] ?? null,
				'department_name'   => ! empty( $user['department_id'] ) ? Department::getDepartmentNameById( $user['department_id'] ) : null,
				'employment_type'   => $user['employment_type'] ?? null,
				'hire_date'         => $user['hire_date'] ?? null,
				'address'           => ! empty( $meta['address_id'] ) ? Address::getAddressById( $meta['address_id'] ) : null,
				'social_links'      => self::getSocialLinks( $user['user_id'] ),
				'local_time'        => $local_time,
				'reporting_person'  => ! empty( $user['reporting_person_user_id'] ) ? Employment::getMinimalInfo( $user['reporting_person_user_id'] ) : null
			);
		}

		return array(
			'users'        => $users_array,
			'segmentation' => array(
				'total_count' => $total_count,
				'page_count'  => $page_count,
				'page'        => $page,
				'limit'       => $limit,
			),
		);
	}

	/**
	 * Create or update an employee profile
	 *
	 * @param array $data User data array
	 * @param array $avatar_image
	 *
	 * @return int The user ID, created or updated one.
	 */
	public static function createOrUpdateEmployee( $data, $avatar_image = null, $photo_id_card = null, $certificates = null ) {

		$user_id   = ! empty( $data['user_id'] ) ? $data['user_id'] : null;
		$full_name = $data['first_name'] . ' ' . $data['last_name'];
		$is_new    = empty( $user_id ) || empty( get_user_meta( $user_id, self::META_KEY_CREW_FLAG, true ) );

		// Create new user if
		if ( empty( $user_id ) ) {
			$user_id = wp_create_user(
				self::getUniqueUsername( $full_name ),
				wp_generate_password(),
				$data['user_email']
			);

			if ( is_wp_error( $user_id ) || empty( $user_id ) || ! is_numeric( $user_id ) ) {
				return false;
			}

			// Set activation key
			update_user_meta( $user_id, self::META_KEY_FOR_TOKEN, $user_id . '_' . _String::getRandomString() );

			// Set the role for newly created user
			( new \WP_User( $user_id ) )->set_role( self::ROLE_EMPLOYEE );
		}

		// Update the user
		wp_update_user(
			array(
				'ID'           => $user_id,
				'first_name'   => $data['first_name'],
				'last_name'    => $data['last_name'],
				'display_name' => $data['display_name'] ?? $full_name,
				'description'  => $data['description'] ?? '',
			)
		);

		// Set profile pic
		if ( is_array( $avatar_image ) && ! empty( $avatar_image['tmp_name'] ) ) {
			self::setProfilePic( $user_id, $avatar_image );
		}

		// Set photo id card
		$file_manager = new FileManager( $user_id, 'employee' );
		if ( is_array( $photo_id_card ) && ! empty( $photo_id_card['tmp_name'] ) ) {

			$attachment_id = $file_manager->uploadFile( $photo_id_card );

			// Store the file ID as employee meta
			if ( $attachment_id ) {
				self::updateMeta( $user_id, 'photo_id_card_file_id', $attachment_id );
			}
		}

		// Store educational certificate files
		if ( is_array( $certificates ) ) {
			
			$educational_files = array();

			foreach ( $certificates as $cert_file ) {
				if ( is_array( $cert_file ) && ! empty( $cert_file['tmp_name'] ) ) {

					$attachment_id = $file_manager->uploadFile( $cert_file );
					
					if ( $attachment_id ) {
						$educational_files[] = $attachment_id;
					}
				}
			}
			
			self::updateMeta( $user_id, 'educational_certificate_file_ids', $educational_files );
		}

		// Update employment data
		$employment_id = Employment::createUpdate( $user_id, $data, true );

		// Set schedule
		if ( ! empty( $data['weekly_schedules'] ) ) {
			WeeklySchedule::updateSchedule( $employment_id, $data['weekly_schedules'] );
		}

		// Create or update address
		$address_id = Address::createUpdateAddress( $data );

		// Prepare social links
		$links     = array();
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
		$educational_info    = is_array( $data['educational_info'] ?? null ) ? $data['educational_info'] : array();
		$filtered_educations = array();
		foreach ( $educational_info as $id => $_info ) {
			if ( ! empty( $_info['program'] ) && is_numeric( $_info['passing_year'] ?? null ) ) {
				$filtered_educations[ $id ] = $_info;
			}
		}

		// Update meta data that can't be added in user table or anything native by WP
		self::updateMeta(
			$user_id,
			array_merge(
				array(
					'employee_id'                => ! empty( $data['employee_id'] ) ? $data['employee_id'] : self::getUniqueEmployeeId(), // Mandatory. Duplicate checking is supposed to be done in the earlier callstack.
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
					'payment_method'             => $data['payment_method'] ?? null,
					'payment_method_details'     => $data['payment_method_details'] ?? array(),

				),
				$emergency,
				$links
			)
		);

		// Update contract/employment specific meta data.
		Employment::updateMeta(
			$employment_id,
			array(
				'experience_level'           => $data['experience_level'] ?? null,
				'employee_benefits'          => $data['employee_benefits'] ?? (object) array(),
				'employee_leaves'            => $data['employee_leaves'] ?? (object) array(),
				'employee_documents'         => $data['employee_documents'] ?? null,
				'employee_trainings'         => $data['employee_trainings'] ?? null,
				'use_custom_weekly_schedule' => $data['use_custom_weekly_schedule'] ?? false,
				'use_custom_benefits'        => $data['use_custom_benefits'] ?? false,
				'use_custom_leaves'          => $data['use_custom_leaves'] ?? false,
				'enable_signing_bonus'       => $data['enable_signing_bonus'] ?? false,
				'signing_bonus_amount'       => $data['signing_bonus_amount'] ?? '',
				'enable_other_bonus'         => $data['enable_other_bonus'] ?? false,
				'other_bonus_amount'         => $data['other_bonus_amount'] ?? '',
				'offer_equity_compensation'  => $data['offer_equity_compensation'] ?? false,
				'equity_compensation_amount' => $data['equity_compensation_amount'] ?? '',
			)
		);

		if ( $is_new ) {

			// Set employee flag
			update_user_meta( $user_id, self::META_KEY_CREW_FLAG, self::ROLE_EMPLOYEE );

			do_action( 'crewhrm_employee_profile_created', $user_id );
		} else {
			do_action( 'crewhrm_employee_profile_updated', $user_id );
		}

		return $user_id;
	}

	/**
	 * Get social links by user ID
	 *
	 * @param int $user_id
	 * @return array
	 */
	public static function getSocialLinks( $user_id ) {

		// Get user meta
		$meta    = self::getMeta( $user_id );
		$socials = array();

		// Loop through meta and extract social links
		foreach ( $meta as $key => $value ) {
			if ( strpos( $key, 'social_link_' ) === 0 ) {
				$socials[ str_replace( 'social_link_', '', $key ) ] = $value;
			}
		}
		
		return $socials;
	}

	/**
	 * Get unique ID to set as employee ID
	 *
	 * @return string
	 */
	public static function getUniqueEmployeeId() {

		global $wpdb;
		$count = (int) $wpdb->get_var(
			"SELECT COUNT(meta_id) FROM {$wpdb->crewhrm_employee_meta} WHERE meta_key='employee_id'"
		);

		$id     = $count + 1;
		$new_id = self::padStringEmployeeId( $id );

		// Get the slug until it's not avaialble in database
		while ( ! empty( self::getUserIdByEmployeeId( $new_id ) ) ) {
			$id++;
			$new_id = self::padStringEmployeeId( $id );
		}

		return $new_id;
	}

	/**
	 * Get user ID by employee ID
	 *
	 * @param string $employee_id
	 * @return int|null
	 */
	public static function getUserIdByEmployeeId( $employee_id ) {
		$args = array(
			'meta_key'   => 'employee_id',
			'meta_value' => $employee_id,
		);
		return Field::employee_meta()->getField( $args, 'object_id' );
	}

	/**
	 * Set uploaded file as profile pic
	 *
	 * @param int   $user_id The user ID to set profile pic for
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
	 * @param int    $user_id
	 * @param string $key
	 * @param mixed  $value
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
	 * @param int    $user_id
	 * @param string $key
	 * @param mixed  $fallback
	 *
	 * @return mixed
	 */
	public static function getMeta( $user_id, $key = null, $fallback = null ) {

		// Get Crew meta data
		$meta = Meta::employee( $user_id )->getMeta( $key );

		// Return singular meta data
		if ( ! empty( $key ) ) {
			return $meta;
		}

		$meta = ! is_array( $meta ) ? array() : $meta;

		// Get WP specific meta data
		$wp_meta = array(
			'description',
		);
		foreach ( $wp_meta as $_key ) {
			$meta[ $_key ] = get_user_meta( $user_id, $_key, true );
		}

		// Add leading zero to employee if it is numeric
		if ( ! empty( $meta['employee_id'] ) ) {
			$meta['employee_id'] = self::padStringEmployeeId( $meta['employee_id'] );
		}

		// Assign dynamic document and traning file meta data
		$resource_keys = array( 'employee_trainings', 'employee_documents' );
		foreach ( $resource_keys as $_r_key ) {
			if ( ! is_array( $meta[ $_r_key ] ?? null ) ) {
				$meta[ $_r_key ] = array();
				continue;
			}

			foreach ( $meta[ $_r_key ] as $index => $file_info ) {
				$meta[ $_r_key ][ $index ] = array_merge(
					$file_info,
					array(
						'title'       => get_the_title( $file_info['id'] ),
						'description' => get_the_content( null, false, $file_info['id'] ),
						'permalink'   => wp_get_attachment_url( $file_info['id'] ),
						'mime_type'   => get_post_mime_type( $file_info['id'] ),
					)
				);
			}
		}

		return $key ? ( $meta[ $key ] ?? $fallback ) : $meta;
	}

	/**
	 * Prepare employee ID
	 *
	 * @param string|int $id
	 * @return string
	 */
	public static function padStringEmployeeId( $id ) {
		return is_numeric( $id ) ? str_pad( $id, 3, '0', STR_PAD_LEFT ) : $id;
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
	
	/**
	 * Get user ID by activation key
	 *
	 * @param string $activation_key The user email
	 *
	 * @return void
	 */
	public static function getUserIdByActivationKey( $key ) {
		global $wpdb;
		$user_id = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT 
					_user.ID
				FROM
					{$wpdb->users} _user
					INNER JOIN {$wpdb->usermeta} _meta ON _user.ID=_meta.user_id AND _meta.meta_key=%s
				WHERE
					_meta.meta_value=%s
				LIMIT 1",
				self::META_KEY_FOR_TOKEN,
				$key
			)
		);
		return ! empty( $user_id ) ? ( int ) $user_id : null;
	}

	/**
	 * Clear the user activation key
	 *
	 * @param int $user_id
	 * @return void
	 */
	public static function clearActivationKey( $user_id ) {
		delete_user_meta( $user_id, self::META_KEY_FOR_TOKEN );
	}

	/**
	 * Save completed step name
	 *
	 * @param int $user_id
	 * @param string $new_step
	 * @return array
	 */
	public static function updatedCompletedSteps( $user_id, $new_step ) {
		$existing = self::getCompletedSteps( $user_id );
		if ( ! in_array( $new_step, $existing ) ) {
			$existing[] = $new_step;
			self::updateMeta( $user_id, self::ONBOARDING_COMPLETED_STEP_KEY, $existing );
		}
		return $existing;
	}

	/**
	 * Get completed steps names
	 *
	 * @param int $user_id
	 * @return array
	 */
	public static function getCompletedSteps( $user_id ) {
		return _Array::getArray( self::getMeta( $user_id, self::ONBOARDING_COMPLETED_STEP_KEY ) );
	}
}
