<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

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
	 * Get single meta value by object id and meta key
	 *
	 * @param int $obj_id
	 * @param string $meta_key
	 * @return mixed
	 */
	public function getMeta( $obj_id, $meta_key ) {
		
		$where_clause = ! empty( $meta_key ) ? " AND meta_key='" . esc_sql( $meta_key ) . "' " : '';
		
		global $wpdb;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT meta_key, meta_value FROM " . $this->table . " WHERE object_id=%d " . $where_clause,
				$obj_id
			),
			ARRAY_A
		);


		$_meta = array();
		foreach ( $results as $result ) {
			$key   = $result['meta_key'];
			$value = maybe_unserialize( $result['meta_value'] );

			if ( ! isset( $_meta[ $key ] ) ) {
				$_meta[ $key ] = $value;
				continue;
			}

			if ( ! is_array( $_meta[ $key ] ) ) {
				$_meta[ $key ] = array( $_meta[ $key ] );
			}

			$_meta[ $key ][] = $value;
		}

		return ! empty( $meta_key ) ? ( $_meta[ $meta_key ] ?? null ) : $_meta;
	}

	/**
	 * Create or update a meta field. If the value is array, then mismatching values will be removed.
	 *
	 * @param int $obj_id
	 * @param string $meta_key
	 * @param mixed $meta_value
	 * @return bool
	 */
	public function updateMeta( $obj_id, $meta_key, $meta_value ) {
		global $wpdb;

		if ( is_array( $meta_value ) ) {
			// Delete existing
			$this->deleteMeta( $obj_id, $meta_key, null );

			// Add again
			foreach ( $meta_value as $value ) {
				$this->addMeta( $obj_id, $meta_key, $value );
			}
			return;
		}
		
		$exists = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(meta_key) FROM " . $this->table . " WHERE object_id=%d AND meta_key=%s",
				$obj_id,
				$meta_key
			)
		);

		$payload = array(
			'object_id' => $obj_id,
			'meta_key' => $meta_key,
			'meta_value' => maybe_serialize( $meta_value )
		);

		if ( $exists ) {
			$wpdb->update(
				$this->table,
				$payload,
				array( 
					'object_id' => $obj_id,
					'meta_key'  => $meta_key 
				)
			);

		} else {
			$wpdb->insert(
				$this->table,
				$payload
			);
		} 
	}

	/**
	 * Add meta. No check about if there is any existing
	 *
	 * @param int $obj_id
	 * @param string $meta_key
	 * @param mixed $meta_value
	 * @return bool
	 */
	public function addMeta( $obj_id, $meta_key, $meta_value ) {
		global $wpdb;
		$wpdb->insert(
			$this->table,
			array(
				'object_id'  => $obj_id,
				'meta_key'   => $meta_key,
				'meta_value' => maybe_serialize( $meta_value )
			)
		);
	}

	/**
	 * Delete single meta
	 *
	 * @param int $obj_id
	 * @param string $meta_key
	 * @return void
	 */
	public function deleteMeta( $obj_id, $meta_key, $meta_value ) {
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
	 * @param array $objects
	 * @param string $id_key
	 * @return void
	 */
	public function assignBulkMeta( array $objects ) {
		global $wpdb;

		$objects = _Array::appendArray( $objects, 'meta', array() );
		$obj_ids = array_keys( $objects );
		$ids_in  = implode( ',', $obj_ids );

		$meta = $wpdb->get_results(
			"SELECT * FROM " . $this->table . " WHERE object_id IN({$ids_in})",
			ARRAY_A
		);

		foreach ( $meta as $m ) {
			$_key   = $m['meta_key'];
			$_value = maybe_unserialize( $m['meta_value'] );
			$_meta  = &$objects[ (int)$m['object_id'] ]['meta'];

			// First time assign the value directly
			if ( ! isset( $_meta[ $_key ] ) ) {
				$_meta[ $_key ] = $_value;
				continue;
			}

			// Make it array if same key has multiple value
			if ( ! is_array( $_meta[ $_key ] ) ) {
				$_meta[ $_key ] = array( $_meta[ $_key ] );
			}

			$_meta[ $_key ][] = $_value;
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
				"SELECT meta_key, meta_value FROM " . $this->table . " WHERE object_id=%d",
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
					'meta_value' => $meta['meta_value']
				)
			);
		}
	}
}
