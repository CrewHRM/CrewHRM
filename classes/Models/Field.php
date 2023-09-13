<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

class Field {
	/**
	 * Get specific field/s from table
	 *
	 * @var string
	 */
	private $table;

	public function __construct( string $table ) {
		$this->table = $table;
	}

	/**
	 * Get instance by table name
	 *
	 * @param string $name
	 * @param string $arguments
	 * @return self
	 */
	public static function __callStatic( $name, $arguments ) {
		// Run time cache
		static $instances = array();

		if ( ! isset( $instances[ $name ] ) ) {
			$instances[ $name ] = new self( DB::$name() );
		}

		return $instances[ $name ];
	}

	/**
	 * Get specific fields by specific where clause
	 *
	 * @param array $where
	 * @param string|array $field
	 * @return mixed
	 */
	public function getField( array $where, $field ) {
		// Prepare select columns and where clause
		$columns      = is_array( $field ) ? implode( ', ', $field ) : $field;
		$where_clause = '1=1';

		// Loop through conditions
		foreach ( $where as $col => $val ) {
			$where_clause .= " AND {$col}='{$val}'";
		}

		global $wpdb;
		$row = $wpdb->get_row(
			"SELECT {$columns} FROM {$this->table} WHERE {$where_clause} LIMIT 1"
		);
		$row = ! empty( $row ) ? (array)$row : array();
		$row = _Array::castRecursive( $row );

		return ! is_array( $field ) ? ( $row[ $field ] ?? null ) : $row;
	}
}