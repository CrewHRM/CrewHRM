<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

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
	 * @param string $table
	 * @param int $object_id
	 */
	public function __construct( string $table, $object_id ) {
		$this->table = $table;
		$this->object_id = $object_id;
	}

	/**
	 * Provide an instance of job meta
	 *
	 * @param int $job_id
	 * @return Meta
	 */
	public static function job( $job_id ) {
		return new self( DB::jobmeta(), $job_id );
	}

	/**
	 * Provide an instance of application meta
	 *
	 * @param int $application_id
	 * @return Meta
	 */
	public static function application( $application_id ) {
		return new self( DB::appmeta(), $application_id );
	}

	/**
	 * Get single meta value by object id and meta key
	 *
	 * @param string $meta_key
	 * @return mixed
	 */
	public function getMeta( $meta_key = null ) {
		$is_singular  = ! empty( $meta_key );
		$where_clause = $is_singular ? " AND meta_key='" . esc_sql( $meta_key ) . "' " : '';
		
		global $wpdb;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT meta_key, meta_value FROM ' . $this->table . ' WHERE object_id=%d ' . $where_clause,
				$this->object_id
			),
			ARRAY_A
		);

		// New array 
		$_meta = array();

		// Loop through results and prepare value
		foreach ( $results as $result ) {

			// Store values per meta key in the array
			$_meta[ $result['meta_key'] ] = maybe_unserialize( $result['meta_value'] );
		}

		$_meta = _Array::castRecursive( $_meta );

		return $is_singular ? ( $_meta[ $meta_key ] ?? null ) : $_meta;
	}

	/**
	 * Create or update a meta field. If the value is array, then mismatching values will be removed.
	 *
	 * @param string $meta_key
	 * @param mixed  $meta_value
	 * @return bool
	 */
	public function updateMeta( $meta_key, $meta_value ) {
		global $wpdb;

		// Check if the meta exists already
		$exists = $wpdb->get_var(
			$wpdb->prepare(
				'SELECT meta_key FROM ' . $this->table . ' WHERE object_id=%d AND meta_key=%s LIMIT 1',
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
	 * Delete single meta
	 *
	 * @param string $meta_key
	 * @return void
	 */
	public function deleteMeta( $meta_key = null, $meta_value = null ) {

		$where = array(
			'object_id' => $this->object_id,
		);

		if ( $meta_key !== null ) {
			$where['meta_key'] = $meta_key;
		}

		if ( $meta_value !== null ) {
			$where['meta_value'] = $meta_value;
		}

		global $wpdb;
		$wpdb->delete(
			$this->table,
			$where
		);
	}

	/**
	 * Assign bulk meta to objects array
	 *
	 * @param array  $objects
	 * @param string $id_key
	 * @return void
	 */
	public function assignBulkMeta( array $objects ) {
		global $wpdb;

		$objects = _Array::appendColumn( $objects, 'meta', (object)array() );
		$obj_ids = array_keys( $objects );
		$ids_in  = implode( ',', $obj_ids );

		$meta = $wpdb->get_results(
			'SELECT * FROM ' . $this->table . " WHERE object_id IN({$ids_in})",
			ARRAY_A
		);

		foreach ( $meta as $m ) {
			$_key   = $m['meta_key'];
			$_value = maybe_unserialize( $m['meta_value'] );

			$objects[ (int) $m['object_id'] ]['meta']->$_key = $_value;
		}

		return $objects;
	}

	/**
	 * Copy meta from one object to another in favour of duplication. This method will not check for duplicate. Just will add.
	 *
	 * @param int $to_id
	 * @return void
	 */
	public function copyMeta( $to_id ) {
		global $wpdb;

		$meta_data = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT meta_key, meta_value FROM ' . $this->table . ' WHERE object_id=%d',
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
