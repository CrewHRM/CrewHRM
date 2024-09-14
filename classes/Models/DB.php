<?php
/**
 * Database handler
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Number;
use CrewHRM\Main;

/**
 * Databse handler class
 */
class DB {
	/**
	 * Prepare the table name, add prefixes
	 *
	 * @param string $name      The table name to get prefixed
	 * @param array  $arguments Callstatic arguments
	 * @return string
	 */
	public static function __callStatic( $name, $arguments ) {
		global $wpdb;
		return $wpdb->prefix . Main::$configs->db_prefix . $name;
	}

	/**
	 * Remove unnecessary things from the SQL
	 *
	 * Supports only
	 * 
	 * 1. CREATE TABLE
	 * 2. ALTER TABLE
	 * 
	 * @param string $sql The raw exported SQL file
	 * @return array
	 */
	private static function purgeSQL( string $sql ) {
		$pattern = '/(CREATE TABLE .*?;|ALTER TABLE .*?;)/si';
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
				$query = str_replace( 'wp_crewhrm_', $wpdb->prefix . Main::$configs->db_prefix, $query );

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
	 * Inspect all the things in queries
	 *
	 * @return array
	 */
	private static function getInspected( array $queries ) {
		foreach ( $queries as $index => $query ) {
			if ( strpos( $query, 'CREATE TABLE' ) === 0 ) {
				// For CREATE TABLE queries
				preg_match( '/CREATE TABLE IF NOT EXISTS `(.*)`/', $query, $matches );
				$table_name = $matches[1] ?? '';
	
				$lines   = explode( PHP_EOL, $query );
				$columns = array();
				foreach ( $lines as $line ) {
					$line = trim( $line );
					if ( empty( $line ) || strpos( $line, '`' ) !== 0 ) {
						continue;
					}
	
					$column_name = substr( $line, 1, strpos( $line, '`', 2 ) - 1 );
					$columns[ $column_name ] = trim( $line, ',' );
				}
	
				$queries[ $index ] = array(
					'query'   => $query,
					'table'   => $table_name,
					'columns' => $columns,
					'type'    => 'CREATE'
				);
			} elseif ( strpos( $query, 'ALTER TABLE' ) === 0 ) {
				// For ALTER TABLE queries
				preg_match( '/ALTER TABLE `(.*?)`/', $query, $matches );
				$table_name = $matches[1] ?? '';
	
				$columns = array();
	
				// Extract column modifications
				preg_match_all( '/\s*(ADD|MODIFY|DROP)\s*(COLUMN)?\s*`([^`]+)`\s*(.*?)(?:,|$)/i', $query, $matches, PREG_SET_ORDER );
				foreach ( $matches as $match ) {
					$operation = strtoupper($match[1]);
					$column_name = $match[3];
					$column_definition = isset($match[4]) ? trim($match[4]) : '';
	
					// Store column modifications
					$columns[ $column_name ] = array(
						'operation' => $operation,
						'definition' => $column_definition
					);
				}
	
				$queries[ $index ] = array(
					'query'   => $query,
					'table'   => $table_name,
					'columns' => $columns,
					'type'    => 'ALTER'
				);
			}
		}
	
		return $queries;
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
		$queries = self::getInspected( $queries );
	
		// Load helper methods if not loaded already
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	
		global $wpdb;
	
		foreach ( $queries as $query ) {
			if ($query['type'] === 'CREATE') {
				// Use dbDelta for CREATE TABLE queries
				dbDelta( $query['query'] );
			} elseif ($query['type'] === 'ALTER') {
				// Add missing columns to the table
				// Because the previous dbDelta just creates new table if not exists already
				// So missing columns doesn't get created automatically.
				$current_columns = $wpdb->get_col(
					$wpdb->prepare(
						'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = %s',
						$query['table']
					)
				);

				// Loop through the columns in latest SQL file
				foreach ( $query['columns'] as $column_name => $column_info ) {
					// Determine if column needs to be added or modified
					if ( $column_info['operation'] === 'ADD' && ! in_array( $column_name, $current_columns ) ) {
						$wpdb->query( "ALTER TABLE {$query['table']} ADD {$column_info['definition']}" );
					} elseif ( $column_info['operation'] === 'MODIFY' && in_array( $column_name, $current_columns ) ) {
						$wpdb->query( "ALTER TABLE {$query['table']} MODIFY `{$column_name}` {$column_info['definition']}" );
					} elseif ( $column_info['operation'] === 'DROP' && in_array( $column_name, $current_columns ) ) {
						$wpdb->query( "ALTER TABLE {$query['table']} DROP COLUMN `{$column_name}`" );
					}
				}
			}
		}
	}

	/**
	 * Get limit for queries
	 *
	 * @param int|null $limit The limit to prepare
	 * @return int
	 */
	public static function getLimit( $limit = null ) {
		if ( ! is_numeric( $limit ) ) {
			$limit = 20;
		}
		return apply_filters( 'crewhrm_query_result_count', _Number::getInt( $limit, 1 ) );
	}

	/**
	 * Get page num to get results for
	 *
	 * @param int|null $page The page to prepare
	 * @return int
	 */
	public static function getPage( $page = null ) {
		return _Number::getInt( $page, 1 );
	}
}
