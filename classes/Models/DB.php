<?php
/**
 * Database handler
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

use CrewHRM\Main;

/**
 * Databse handler class
 */
class DB extends Main {
	/**
	 * Prepare the table name, add prefixes
	 *
	 * @param string $name      The table name to get prefixed
	 * @param array  $arguments Callstatic arguments
	 * @return string
	 */
	public static function __callStatic( $name, $arguments ) {
		global $wpdb;
		return $wpdb->prefix . self::$configs->db_prefix . $name;
	}

	/**
	 * Remove unnecessary things from the SQL
	 *
	 * @param string $sql The raw exported SQL file
	 * @return array
	 */
	private static function purgeSQL( string $sql ) {
		$pattern = '/(CREATE TABLE .*?);/si';
		preg_match_all( $pattern, $sql, $matches );

		return $matches[0];
	}

	/**
	 * Apply dynamic collation, charset, prefix etc.
	 *
	 * @param array $queries Array of single queries.
	 * @return array
	 */
	private static function applyDynamics( array $queries ) {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		return array_map(
			function ( $query ) use ( $wpdb, $charset_collate ) {
				// Replace table prefix
				$query = str_replace( 'wp_crewhrm_', $wpdb->prefix . self::$configs->db_prefix, $query );

				// Replace table configs
				$query = str_replace( 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci', $charset_collate, $query );

				// Replace column configs
				$query = str_replace( 'CHARACTER SET utf8mb4', 'CHARACTER SET ' . $wpdb->charset, $query );
				$query = str_replace( 'COLLATE utf8mb4_unicode_520_ci', 'COLLATE ' . $wpdb->collate, $query );

				return $query;
			},
			$queries
		);
	}

	/**
	 * Import the DB from SQL file.
	 * ---------------------------
	 * Must have in the SQL
	 *
	 * 1. Table prefix: wp_crewhrm_
	 * 2. ENGINE=InnoDB
	 * 3. DEFAULT CHARSET=utf8mb4
	 * 4. COLLATE=utf8mb4_unicode_520_ci
	 * 5. Column CHARACTER SET utf8mb4
	 * 6. Column COLLATE utf8mb4_unicode_520_ci
	 * 7. CREATE TABLE IF NOT EXISTS
	 *
	 * So these can be replaced with dymanic configuration correctly. And no onflict with existing table with same names.
	 *
	 * @param string $sql Raw exported SQL file contents
	 * @return void
	 */
	public static function import( $sql ) {
		$queries = self::purgeSQL( $sql );
		$queries = self::applyDynamics( $queries );

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		foreach ( $queries as $query ) {
			dbDelta( $query );
		}
	}
}
