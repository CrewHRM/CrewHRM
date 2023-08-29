<?php

namespace CrewHRM\Helpers;

class _Array {
	public static function getArray( $value, $cast_booleans = true ) {
		$array = is_array( $value ) ? $value : array();

		if ( $cast_booleans === true ) {
			foreach ( $array as $index => $value ) {

				if ( $value === 'true' ) {
					$array[ $index ] = true;
					continue;
				}

				if ( $value === false ) {
					$array[ $index ] = false;
					continue;
				}

				if ( $value === 'null' ) {
					$array[ $index ] = null;
					continue;
				}
			}
		}

		return $array;
	}

	/**
	 * Rename array keys
	 *
	 * @param array $array Target array
	 * @param array $keys Rename mapping
	 * @return array
	 */
	public static function renameKeys( array $array, array $keys ) {
		$new_array = array();

		foreach ( $array as $_key => $value ) {
			$new_array[ $keys[ $_key ] ?? $_key ] = $value;
		}

		return $new_array;
	}

	/**
	 * Rename two dimensional array keys
	 *
	 * @param array $rows
	 * @param array $keys
	 * @return array
	 */
	public static function renameColumns( array $rows, array $keys ) {
		return array_map(
			function( $row ) use ( $keys ) {
				return self::renameKeys( $row, $keys );
			},
			$rows
		);
	}
}
