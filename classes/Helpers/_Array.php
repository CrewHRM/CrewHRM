<?php

namespace CrewHRM\Helpers;

class _Array {
	/**
	 * Return array
	 *
	 * @param mixed $value
	 * @return array
	 */
	public static function getArray( $value ) {
		$array = is_array( $value ) ? $value : array();
		$array = self::castRecursive( $array );
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

	/**
	 * Apply order to every array elements
	 *
	 * @param array  $array
	 * @param string $key
	 * @return array
	 */
	public static function applyOrderRecursive( array $array, string $key, $order = 1 ) {
		
		foreach ( $array as $index => $elment ) {

			// Deep level order assignment
			if ( is_array( $elment ) ) {
				$array[ $index ] = self::applyOrderRecursive( $elment, $key );
				continue;
			}

			$elment[ $key ]  = $order;
			$array[ $index ] = $elment;
			$order++;
		}

		return $array;
	}

	/**
	 * Cast number, bool from string.
	 *
	 * @param array $array
	 * @return array
	 */
	public static function castRecursive( array $array ) {
		// Loop through array elements
		foreach ( $array as $index => $value ) {

			// If it is also array, pass through recursion
			if ( is_array( $value ) ) {
				$array[ $index ] = self::castRecursive( $value );
				continue;
			}

			if ( is_string( $value ) ) {

				// Cast number
				if ( is_numeric( $value ) ) {
					$array[ $index ] = (int) $value;
				}

				// Cast boolean true
				if ( $value === 'true' ) {
					$array[ $index ] = true;
				}

				// Cast boolean false
				if ( $value === 'false' ) {
					$array[ $index ] = false;
				}
			}
		}

		return $array;
	}

	/**
	 * Make an array column value index of the array
	 *
	 * @param array $array
	 * @param string $column
	 * @return array
	 */
	public static function indexify( array $array, string $column ) {
		$new_array = array();
		foreach ( $array as $element ) {
			$new_array[ $element[ $column ] ] = $element;
		}

		return $new_array;
	}

	/**
	 * Append column to a two dimensional array
	 *
	 * @param array $array
	 * @param string $key
	 * @param array $new
	 * @return array
	 */
	public static function appendArray( array $array, string $key, $new ) {
		foreach ( $array as $index => $element ) {
			$prev = $array[ $index ][ $key ] ?? array();
			$array[ $index ][ $key ] = array_merge_recursive( $prev, $new );
		}

		return $array;
	}

	/**
	 * Get object from array by object key value match, similar to js find method.
	 *
	 * @param array $array
	 * @param string $key
	 * @param mixed $value
	 * @return mixed
	 */
	public static function find( array $array, $key, $value ) {
		foreach ( $array as $object ) {
			if ( ( $object[ $key ] ?? null ) === $value ) {
				return $object;
			}
		}
	}
}
