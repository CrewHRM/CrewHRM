<?php

namespace CrewHRM\Models;

class JobMeta extends Meta {
	
	/**
	 * Internal function to provide the meta object
	 *
	 * @return Meta
	 */
	private static function meta() {
		static $meta = null;
		if ( $meta === null ) {
			$meta = new Meta( DB::jobmeta() );
		}

		return $meta;
	}

	/**
	 * Get job meta value
	 *
	 * @param int $job_id
	 * @param string $meta_key
	 * @return mixed
	 */
	public static function getJobMeta( $job_id, $meta_key=null ) {
		return self::meta()->getMeta( $job_id, $meta_key );
	}

	/**
	 * Add meta no matter if there are some already with the key
	 *
	 * @param string $meta_key
	 * @param mixed $meta_value
	 * @return bool
	 */
	public static function addJobMeta( $job_id, $meta_key, $meta_value ) {
		return self::meta()->addMeta( $job_id, $meta_key, $meta_value );
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
		return self::meta()->updateMeta( $job_id, $meta_key, $meta_value );
	}

	/**
	 * Delete job meta
	 *
	 * @param int $job_id
	 * @param string $meta_key
	 * @return mixed
	 */
	public static function deleteJobMeta( $job_id, $meta_key = null, $meta_value = null ) {
		return self::meta()->deleteMeta( $job_id, $meta_key, $meta_value );
	}

	/**
	 * Assign bulk job meta in jobs array
	 *
	 * @param array $jobs
	 * @return array
	 */
	public static function assignBulkJobMeta( array $jobs ) {
		return self::meta()->assignBulkMeta( $jobs );
	}

	/**
	 * Copy from one to another
	 *
	 * @param int $from
	 * @param int $to
	 * @return mixed
	 */
	public static function copyJobMeta( $from, $to ) {
		return self::meta()->copyMeta( $from, $to );
	}
}