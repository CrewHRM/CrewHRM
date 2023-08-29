<?php

namespace CrewHRM\Models;

use CrewHRM\Main;

class DB extends Main {
	/**
	 * Prepare the table name, add prefixes
	 *
	 * @param string $name
	 * @param array  $arguments
	 * @return string
	 */
	public static function __callStatic( $name, $arguments ) {
		global $wpdb;
		return $wpdb->prefix . self::$configs->db_prefix . $name;
	}
}
