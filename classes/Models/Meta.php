<?php

namespace CrewHRM\Models;

class Meta {
	/**
	 * Get single meta value by object id and meta key
	 *
	 * @param int $obj_id
	 * @param string $meta_key
	 * @param mixed $default
	 * @return mixed
	 */
	private static function getMeta( $obj_id, $meta_key, $default, $table ) {
		global $wpdb;
		$meta_value = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT meta_value FROM " . $table . " WHERE object_id=%d AND meta_key=%s",
				$obj_id,
				$meta_key
			)
		);

		return $meta_value === null ? $default : unserialize( $meta_value );
	}

	/**
	 * Create or update a meta field
	 *
	 * @param int $obj_id
	 * @param string $meta_key
	 * @param mixed $meta_value
	 * @return void
	 */
	private static function updateMeta( $obj_id, $meta_key, $meta_value, $table ) {
		global $wpdb;

		$payload = array(
			'object_id' => $obj_id,
			'meta_key' => $meta_key,
			'meta_value' => serialize( $meta_value )
		);

		// Check if it exists
		$exists = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT meta_key FROM " . $table . " WHERE object_id=%d AND meta_key=%s",
				$obj_id,
				$meta_key
			)
		);

		if ( $exists ) {
			$wpdb->update(
				$table,
				$payload,
				array( 
					'object_id' => $obj_id,
					'meta_key'  => $meta_key 
				)
			);
		} else {
			$wpdb->insert(
				$table,
				$payload
			);
		}
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

		$wpdb->delete(
			$table,
			array(
				'object_id' => $obj_id,
				'meta_key' => $meta_key
			)
		);
	}

	/**
	 * Get job meta value
	 *
	 * @param int $job_id
	 * @param string $meta_key
	 * @return mixed
	 */
	public static function getJobMeta( $job_id, $meta_key, $default = null ) {
		return self::getMeta( $job_id, $meta_key, $default, DB::jobmeta() );
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
	public static function deleteJobMeta( $job_id, $meta_key ) {
		return self::deleteMeta( $job_id, $meta_key, DB::jobmeta() );
	}
}