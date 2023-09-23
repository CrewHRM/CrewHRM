<?php

namespace CrewHRM\Helpers;

class _Array {
	/**
	 * Apply order to every array elements
	 *
	 * @param array  $array
	 * @param string $order_key
	 * @return array
	 */
	public static function addOrderColumn( array $array, string $order_key ) {
		// Start from
		$order = 1;

		// Loop through the array and assign sequence order
		foreach ( $array as $index => $element ) {

			$element[ $order_key ] = $order;
			$array[ $index ] = $element;

			$order++;
		}

		return $array;
	}

	/**
	 * Return array no matter what. And cast values to appropriate data type.
	 *
	 * @param mixed $value
	 * @return array
	 */
	public static function getArray( $value ) {
		return self::castRecursive( is_array( $value ) ? $value : array() );
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

				if ( is_numeric( $value ) ) {
					// Cast number
					$array[ $index ] = (int) $value;

				} else if ( $value === 'true' ) {
					// Cast boolean true
					$array[ $index ] = true;

				} else if ( $value === 'false' ) {
					// Cast boolean false
					$array[ $index ] = false;

				} else if ( $value === 'null' ) {
					// Cast null
					$array[ $index ] = null;

				} else if( $value === '[]' ) {
					// Cast empty array
					$array[ $index ] = array();

				} else {
					// Maybe unserialize
					$array[ $index ] = maybe_unserialize( $value );
				}
			}
		}

		return $array;
	}

	/**
	 * Make an array column value index of the array
	 *
	 * @param array  $array
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
	 * @param array  $array
	 * @param string $key
	 * @param array  $new
	 * @return array
	 */
	public static function appendColumn( array $array, string $key, $new ) {
		foreach ( $array as $index => $element ) {
			$array[ $index ][ $key ] = $new;
		}

		return $array;
	}

	/**
	 * Get object from array by object key value match, similar to js find method.
	 *
	 * @param array  $array
	 * @param string $key
	 * @param mixed  $value
	 * @return mixed
	 */
	public static function find( array $array, $key, $value ) {
		foreach ( $array as $object ) {
			if ( ( $object[ $key ] ?? null ) === $value ) {
				return $object;
			}
		}
	}

	/**
	 * Sanitize contents recursively
	 *
	 * @param array $kses_for Define field name to use wp_kses for instead of sanitize_text_field.
	 * @param string|int $key Do not use outside of this function. It's for internal use.
	 * @return array
	 */
	public static function sanitizeRecursive( $value, $kses_for = array(), $key = null ) {
		if ( is_array( $value ) ) {
			foreach ( $value as $_key => $_value ) {
				$value[ $_key ] = self::sanitizeRecursive( $_value, $kses_for, $_key );
			}

		} else if( is_string( $value ) ) {
			$value = in_array( $key, $kses_for ) ? _String::applyKses( $value ) : sanitize_text_field( $value );
		}

		return $value;
	}
}
