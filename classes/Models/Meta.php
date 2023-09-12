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

	public function __construct( string $table ) {
		$this->table = $table;
	}

	/**
	 * Provide an instance of job meta
	 *
	 * @return Meta
	 */
	public static function job() {
		static $instance = null;

		if ( $instance === null ) {
			$instance = new self( DB::jobmeta() );
		}

		return $instance;
	}

	/**
	 * Provide an instance of application meta
	 *
	 * @return Meta
	 */
	public static function application() {
		static $instance = null;

		if ( $instance === null ) {
			$instance = new self( DB::appmeta() );
		}

		return $instance;
	}

	/**
	 * Get single meta value by object id and meta key
	 *
	 * @param int    $obj_id
	 * @param string $meta_key
	 * @return mixed
	 */
	public function getMeta( $obj_id, $meta_key = null ) {
		$is_singular  = ! empty( $meta_key );
		$where_clause = $is_singular ? " AND meta_key='" . esc_sql( $meta_key ) . "' " : '';
		
		global $wpdb;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT meta_key, meta_value FROM ' . $this->table . ' WHERE object_id=%d ' . $where_clause,
				$obj_id
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

		return $is_singular ? ( $_meta[ $meta_key ] ?? null ) : $_meta;
	}

	/**
	 * Create or update a meta field. If the value is array, then mismatching values will be removed.
	 *
	 * @param int    $obj_id
	 * @param string $meta_key
	 * @param mixed  $meta_value
	 * @return bool
	 */
	public function updateMeta( $obj_id, $meta_key, $meta_value ) {
		global $wpdb;

		// Check if the meta exists already
		$exists = $wpdb->get_var(
			$wpdb->prepare(
				'SELECT meta_key FROM ' . $this->table . ' WHERE object_id=%d AND meta_key=%s LIMIT 1',
				$obj_id,
				$meta_key
			)
		);

		// Prepare the row to insert/update
		$payload = array(
			'object_id'  => $obj_id,
			'meta_key'   => $meta_key,
			'meta_value' => maybe_serialize( $meta_value ),
		);

		if ( $exists ) {
			// Update existing one
			$wpdb->update(
				$this->table,
				$payload,
				array( 
					'object_id' => $obj_id,
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
	 * @param int    $obj_id
	 * @param string $meta_key
	 * @return void
	 */
	public function deleteMeta( $obj_id, $meta_key = null, $meta_value = null ) {
		global $wpdb;

		$where = array(
			'object_id' => $obj_id,
		);

		if ( $meta_key !== null ) {
			$where['meta_key'] = $meta_key;
		}

		if ( $meta_value !== null ) {
			$where['meta_value'] = $meta_value;
		}

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

		$objects = _Array::appendArray( $objects, 'meta', array() );
		$obj_ids = array_keys( $objects );
		$ids_in  = implode( ',', $obj_ids );

		$meta = $wpdb->get_results(
			'SELECT * FROM ' . $this->table . " WHERE object_id IN({$ids_in})",
			ARRAY_A
		);

		foreach ( $meta as $m ) {
			$_key   = $m['meta_key'];
			$_value = maybe_unserialize( $m['meta_value'] );

			$objects[ (int) $m['object_id'] ]['meta'][ $_key ] = $_value;
		}

		return $objects;
	}

	/**
	 * Copy meta from one object to another in favour of duplication. This method will not check for duplicate. Just will add.
	 *
	 * @param int $object_from_id
	 * @param int $object_to_id
	 * @return void
	 */
	public function copyMeta( $object_from_id, $object_to_id ) {
		global $wpdb;

		$meta_data = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT meta_key, meta_value FROM ' . $this->table . ' WHERE object_id=%d',
				$object_from_id
			),
			ARRAY_A
		);

		// Now insert these meta for the new job
		foreach ( $meta_data as $meta ) {
			$wpdb->insert(
				$this->table,
				array(
					'object_id'  => $object_to_id,
					'meta_key'   => $meta['meta_key'],
					'meta_value' => $meta['meta_value'],
				)
			);
		}
	}
}
