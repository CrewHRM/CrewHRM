<?php
/**
 * Helper class to do array related operations
 *
 * @package crewhrm
 */

namespace CrewHRM\Helpers;

/**
 * The enriched array class
 */
class _Array {
	/**
	 * Apply order to every array elements
	 *
	 * @param array  $array     The array to add order ins
	 * @param string $order_key The key to store order index
	 * @return array
	 */
	public static function addOrderColumn( array $array, string $order_key ) {
		// Start from
		$order = 1;

		// Loop through the array and assign sequence order
		foreach ( $array as $index => $element ) {

			$element[ $order_key ] = $order;
			$array[ $index ]       = $element;

			$order++;
		}

		return $array;
	}

	/**
	 * Return array no matter what. And cast values to appropriate data type.
	 *
	 * @param mixed $value The value to get array of and cast before. If not retruns empty array.
	 * @return array
	 */
	public static function getArray( $value ) {
		return self::castRecursive( is_array( $value ) ? $value : array() );
	}

	/**
	 * Cast number, bool from string.
	 *
	 * @param array $array The array to cast data recursively
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
					$array[ $index ] = _String::isFloat( $value ) ? (float) $value : (int) $value;

				} elseif ( 'true' === $value ) {
					// Cast boolean true
					$array[ $index ] = true;

				} elseif ( 'false' === $value ) {
					// Cast boolean false
					$array[ $index ] = false;

				} elseif ( 'null' === $value ) {
					// Cast null
					$array[ $index ] = null;

				} elseif ( '[]' === $value ) {
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
	 * @param array  $array  Array to indexify
	 * @param string $column The field to use the value as index
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
	 * @param array  $array The array to append column into
	 * @param string $key   The key to use as index of the column
	 * @param array  $new   New field to use as the value
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
	 * @param array  $array The array to find objects in
	 * @param string $key   The key to match in the object
	 * @param mixed  $value The value to match in the object
	 * @return mixed
	 */
	public static function find( array $array, $key, $value ) {
		$index = self::findIndex( $array, $key, $value );
		return $array[ $index ] ?? null;
	}

	/**
	 * Find index of object in two dimensional array
	 *
	 * @param array  $array The array to find index of object in
	 * @param string $key   The key to match in the object
	 * @param mixed  $value The value to match in the object
	 * @return int|null
	 */
	public static function findIndex( array $array, $key, $value ) {
		foreach ( $array as $index => $object ) {
			if ( ( $object[ $key ] ?? null ) === $value ) {
				return $index;
			}
		}

		return null;
	}

	/**
	 * Sanitize contents recursively
	 *
	 * @param array      $value    The array to run kses through
	 * @param array      $kses_for Define field name to use wp_kses for instead of sanitize_text_field.
	 * @param string|int $key      Do not use outside of this function. It's for internal use.
	 * @return array
	 */
	public static function sanitizeRecursive( $value, $kses_for = array(), $key = null ) {
		if ( is_array( $value ) ) {
			foreach ( $value as $_key => $_value ) {
				$value[ $_key ] = self::sanitizeRecursive( $_value, $kses_for, $_key );
			}
		} elseif ( is_string( $value ) ) {
			$value = in_array( $key, $kses_for, true ) ? _String::applyKses( $value ) : sanitize_text_field( $value );
		}

		return $value;
	}

	/**
	 * Strip slasshes from string in array resursivley. Ideally used in post data.
	 *
	 * @param array $array Array of strings or whatever. Only strings will be processed.
	 * @return array
	 */
	public static function stripslashesRecursive( array $array ) {
		// Loop through array elements
		foreach ( $array as $index => $element ) {
			if ( is_array( $element ) ) {
				$array[ $index ] = self::stripslashesRecursive( $element );
				continue;
			}

			if ( is_string( $element ) ) {
				$array[ $index ] = stripslashes( $element );
			}
		}

		return $array;
	}

	/**
	 * Convert multidimensional array into one
	 *
	 * @param array $array The array to flatten
	 * @return array
	 */
	public static function flattenArray( array $array ) {
		$result = array();
		foreach ( $array as $element ) {
			if ( is_array( $element ) ) {
				$result = array_merge( $result, self::flattenArray( $element ) );
			} else {
				$result[] = $element;
			}
		}
		return $result;
	}
}
