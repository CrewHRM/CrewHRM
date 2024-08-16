<?php
/**
 * Job and application meta handler class
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;
use CrewHRM\Helpers\_String;

/**
 * Meta table CRUD functionalities.
 * This doesn't support multiple entry for single meta key unlike WP.
 * One meta key in the entire table. So no add capability.
 * Just update and get singular field always.
 */
class Meta {
	/**
	 * Meta table where to do operations
	 *
	 * @var string
	 */
	private $table;

	/**
	 * Object ID to work for
	 *
	 * @var int
	 */
	private $object_id;

	/**
	 * Meta instance
	 *
	 * @param string $table     The table name to run query in
	 * @param int    $object_id The object ID
	 */
	public function __construct( string $table, $object_id ) {
		$this->table     = $table;
		$this->object_id = $object_id;
	}

	/**
	 * Provide an instance of job meta
	 *
	 * @param int $job_id Job ID to return meta instance for
	 * @return Meta
	 */
	public static function job( $job_id ) {
		global $wpdb;
		return new self( $wpdb->crewhrm_jobmeta, $job_id );
	}

	/**
	 * Provide an instance of employment meta
	 *
	 * @param int $employment_id Employment ID to return meta instance for
	 * @return Meta
	 */
	public static function employment( $employment_id ) {
		global $wpdb;
		return new self( $wpdb->crewhrm_employment_meta, $employment_id );
	}

	/**
	 * Provide an instance of employee meta
	 *
	 * @param int $user_id Job ID to return meta instance for
	 * @return Meta
	 */
	public static function employee( $user_id ) {
		global $wpdb;
		return new self( $wpdb->crewhrm_employee_meta, $user_id );
	}

	/**
	 * Provide an instance of application meta
	 *
	 * @param int $application_id Application ID to return meta instance for
	 * @return Meta
	 */
	public static function application( $application_id ) {
		global $wpdb;
		return new self( $wpdb->crewhrm_appmeta, $application_id );
	}

	/**
	 * Get single meta value by object id and meta key
	 *
	 * @param string $meta_key Optional meta key to get specific. Otherwise all.
	 * @return mixed
	 */
	public function getMeta( $meta_key = null, $fallback = null ) {
		global $wpdb;

		$is_singular  = ! empty( $meta_key );
		$where_clause = $is_singular ? $wpdb->prepare( ' AND meta_key=%s', $meta_key ) : '';

		$results = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT meta_key, meta_value FROM {$this->table} WHERE object_id=%d {$where_clause}",
				$this->object_id
			),
			ARRAY_A
		);

		// New array
		$_meta = array();

		// Loop through results and prepare value
		foreach ( $results as $result ) {

			// Store values per meta key in the array
			$_meta[ $result['meta_key'] ] = _String::maybe_unserialize( $result['meta_value'] );
		}

		$_meta = _Array::castRecursive( $_meta );

		return $is_singular ? ( $_meta[ $meta_key ] ?? $fallback ) : $_meta;
	}

	/**
	 * Create or update a meta field. If the value is array, then mismatching values will be removed.
	 *
	 * @param string $meta_key   Meta key to update for
	 * @param mixed  $meta_value Meta value to store
	 * @return void
	 */
	public function updateMeta( $meta_key, $meta_value ) {
		global $wpdb;

		// Check if the meta exists already
		$exists = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT meta_key FROM {$this->table} WHERE object_id=%d AND meta_key=%s LIMIT 1",
				$this->object_id,
				$meta_key
			)
		);

		// Prepare the row to insert/update
		$payload = array(
			'object_id'  => $this->object_id,
			'meta_key'   => $meta_key,
			'meta_value' => maybe_serialize( $meta_value ),
		);

		if ( $exists ) {
			// Update existing one
			$wpdb->update(
				$this->table,
				$payload,
				array(
					'object_id' => $this->object_id,
					'meta_key'  => $meta_key,
				)
			);

		} else {
			// Insert as new
			$wpdb->insert(
				$this->table,
				$payload
			);
		}
	}

	/**
	 * Update bulk meta
	 *
	 * @param array $meta_array
	 *
	 * @return void
	 */
	public function updateBulkMeta( $meta_array ) {
		foreach ( $meta_array as $key => $value ) {
			$this->updateMeta( $key, $value );
		}
	}

	/**
	 * Delete single meta
	 *
	 * @param string $meta_key Optional meta key to delete. Otherwise all meta will be deleted for the object.
	 * @return void
	 */
	public function deleteMeta( $meta_key = null ) {

		$where = array(
			'object_id' => $this->object_id,
		);

		if ( null !== $meta_key ) {
			$where['meta_key'] = $meta_key;
		}

		global $wpdb;
		$wpdb->delete(
			$this->table,
			$where
		);
	}

	/**
	 * Delete bulk meta for multiple objects
	 *
	 * @param array  $object_ids Array of object IDs
	 * @param string $meta_key   Specific meta key. It's optional.
	 * @return void
	 */
	public function deleteBulkMeta( array $object_ids, string $meta_key = null ) {
		if ( empty( $object_ids ) ) {
			return;
		}

		global $wpdb;

		$object_ids = array_values( $object_ids );
		$ids_places = _String::getPlaceHolders( $object_ids );
		$meta_key   = $meta_key ? esc_sql( $meta_key ) : null;
		$key_clause = $meta_key ? $wpdb->prepare( ' AND meta_key=%s', $meta_key ) : '';

		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM 
					{$this->table} 
				WHERE 
					object_id IN ({$ids_places}) {$key_clause}",
				...$object_ids
			)
		);
	}

	/**
	 * Assign bulk meta to objects array
	 *
	 * @param array  $objects  Array of objects to assign meta into
	 * @param string $meta_key Optional meta key if needs specific meta data.
	 * @return array
	 */
	public function assignBulkMeta( array $objects, $meta_key = null ) {
		global $wpdb;

		$objects    = _Array::appendColumn( $objects, 'meta', (object) array() );
		$obj_ids    = array_values( _Array::getArray( array_keys( $objects ), false, 0 ) );
		$ids_places = _String::getPlaceHolders( $obj_ids );

		$where_clause = '';
		if ( $meta_key ) {
			$key           = esc_sql( $meta_key );
			$where_clause .= $wpdb->prepare( ' AND meta_key=%s', $key );
		}

		$meta = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$this->table} WHERE object_id IN ({$ids_places}) {$where_clause}",
				...$obj_ids
			),
			ARRAY_A
		);

		foreach ( $meta as $m ) {
			$_key   = $m['meta_key'];
			$_value = _String::maybe_unserialize( $m['meta_value'] );

			$obj_id                            = (int) $m['object_id'];
			$objects[ $obj_id ]['meta']->$_key = $_value;
		}

		return $objects;
	}

	/**
	 * Copy meta from one object to another in favour of duplication. This method will not check for duplicate. Just will add.
	 *
	 * @param int $to_id The target object ID to copy meta to
	 * @return void
	 */
	public function copyMeta( $to_id ) {
		global $wpdb;

		$meta_data = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT meta_key, meta_value FROM {$this->table} WHERE object_id=%d",
				$this->object_id
			),
			ARRAY_A
		);

		// Now insert these meta for the new job
		foreach ( $meta_data as $meta ) {
			$wpdb->insert(
				$this->table,
				array(
					'object_id'  => $to_id,
					'meta_key'   => $meta['meta_key'],
					'meta_value' => $meta['meta_value'],
				)
			);
		}
	}
}
