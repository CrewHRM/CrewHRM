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
	 * Type cast key value paired array
	 *
	 * @param array  $array
	 * @param string $method
	 * @return array
	 */
	public static function cast( array $array, $method ) {
		$is_intval = $method === 'intval';
		
		foreach ( $array as $key => $value ) {
			
			if ( $is_intval && ! is_numeric( $value ) ) {
				continue;
			}

			$array[ $key ] = $method( $value );
		}

		return $array;
	}

	/**
	 * Type cast row-column array
	 *
	 * @param array  $rows
	 * @param string $method
	 * @return array
	 */
	public static function castColumns( array $rows, $method ) {
		return array_map(
			function ( $row ) use ( $method ) {
				return self::cast( $row, $method );
			},
			$rows
		);
	}
}
