<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

class Meta {
	/**
	 * Get single meta value by object id and meta key
	 *
	 * @param int $obj_id
	 * @param string $meta_key
	 * @param mixed $default
	 * @return mixed
	 */
	private static function getMeta( $obj_id, $meta_key, $singular, $table ) {
		global $wpdb;
		$meta_values = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT meta_value FROM " . $table . " WHERE object_id=%d AND meta_key=%s ORDER BY meta_id DESC " . ( $singular ? 'LIMIT 1' : '' ),
				$obj_id,
				$meta_key
			)
		);

		$meta_values = array_map(
			function( $meta ) {
				return maybe_unserialize( $meta );
			},
			$meta_values
		);

		return $singular ? ($meta_values[0] ?? null) : $meta_values;
	}

	/**
	 * Create or update a meta field
	 *
	 * @param int $obj_id
	 * @param string $meta_key
	 * @param mixed $meta_value
	 * @return bool
	 */
	private static function updateMeta( $obj_id, $meta_key, $meta_value, $table ) {
		global $wpdb;

		$payload = array(
			'object_id' => $obj_id,
			'meta_key' => $meta_key,
			'meta_value' => maybe_serialize( $meta_value )
		);

		// Check if it exists
		$exist_counts = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(meta_key) FROM " . $table . " WHERE object_id=%d AND meta_key=%s",
				$obj_id,
				$meta_key
			)
		);

		if ( $exist_counts === 1 ) {
			// Can be updated if there's only one meta for the key
			$wpdb->update(
				$table,
				$payload,
				array( 
					'object_id' => $obj_id,
					'meta_key'  => $meta_key 
				)
			);
		} else if( $exist_counts === 0 ) {
			// Can be added if no meta key added for this
			$wpdb->insert(
				$table,
				$payload
			);
		} else {
			// If there are multiple meta with the key, then neither update nor create possible.
			return false;
		}

		return true;
	}

	/**
	 * Add meta
	 *
	 * @param int $obj_id
	 * @param string $meta_key
	 * @param mixed $meta_value
	 * @return bool
	 */
	public static function addMeta( $obj_id, $meta_key, $meta_value, $table ) {
		global $wpdb;
		$wpdb->insert(
			$table,
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
	 * @param string $table
	 * @return void
	 */
	private static function deleteMeta( $obj_id, $meta_key, $table ) {
		global $wpdb;

		$where = array(
			'object_id' => $obj_id,
		);

		if ( $meta_key !== null ) {
			$where['meta_key'] = $meta_key;
		}

		$wpdb->delete(
			$table,
			$where
		);
	}

	/**
	 * Undocumented function
	 *
	 * @param array $objects
	 * @param string $id_key
	 * @return void
	 */
	private static function assignBulkMeta( array $objects, string $table ) {
		global $wpdb;

		$objects = _Array::appendColumn( $objects, 'meta', array() );
		$obj_ids = array_keys( $objects );
		$ids_in  = implode( ',', $obj_ids );

		$meta = $wpdb->get_results(
			"SELECT * FROM " . $table . " WHERE object_id IN({$ids_in})",
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
	 * Get job meta value
	 *
	 * @param int $job_id
	 * @param string $meta_key
	 * @return mixed
	 */
	public static function getJobMeta( $job_id, $meta_key, $singular=false ) {
		return self::getMeta( $job_id, $meta_key, $singular, DB::jobmeta() );
	}

	/**
	 * Add meta no matter if there are some already with the key
	 *
	 * @param string $meta_key
	 * @param mixed $meta_value
	 * @return bool
	 */
	public static function addJobMeta( $job_id, $meta_key, $meta_value ) {
		return self::addMeta( $job_id, $meta_key, $meta_value, DB::jobmeta() );
	}

	/**
	 * Update job meta
	 *
	 * @param int $job_id
	 * @param string $meta_key
	 * @param mixed $meta_value
	 * @return mixed
	 */
	public static function updateJobMeta( $job_id, $meta_key, $meta_value ) {
		return self::updateMeta( $job_id, $meta_key, $meta_value, DB::jobmeta() );
	}

	/**
	 * Delete job meta
	 *
	 * @param int $job_id
	 * @param string $meta_key
	 * @return mixed
	 */
	public static function deleteJobMeta( $job_id, $meta_key = null ) {
		return self::deleteMeta( $job_id, $meta_key, DB::jobmeta() );
	}

	/**
	 * Assign bulk job meta in jobs array
	 *
	 * @param array $jobs
	 * @return array
	 */
	public static function assignBulkJobMeta( array $jobs ) {
		return self::assignBulkMeta( $jobs, DB::jobmeta() );
	}
}