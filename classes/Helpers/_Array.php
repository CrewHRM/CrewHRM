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
	 * Multipurpose array preparation
	 *
	 * @param mixed $array Expected array, however anything else could be passed to convert to array element
	 * @param bool  $mutate Whether to make the non array element to array element
	 * @param mixed $non_empty_fallback The fallback array element when the array is empty
	 *
	 * @return array
	 */
	public static function getArray( $array, $mutate = false, $non_empty_fallback = null ) {

		// Set the array as empty or convert the non array to array
		if ( ! is_array( $array ) ) {
			$array = $mutate ? array( $array ) : array();
		}

		// Avoid non empty array by adding fallback element for IN query epecially
		if ( empty( $array ) && null !== $non_empty_fallback ) {
			$array = array( $non_empty_fallback );
		}

		// Convert data types to near ones
		$array = self::castRecursive( $array );

		return $array;
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

			$array[ $index ] = _String::castValue( $value );
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
	 * @param mixed      $value The value to sanitize
	 * @param string|int $key Current key in recursion. Do not pass it from outside of this function. It's for internal use only.
	 *
	 * @return mixed
	 */
	public static function sanitizeRecursive( $value, $key = null ) {
		if ( is_array( $value ) ) {
			foreach ( $value as $_key => $_value ) {
				// If it is kses, then remove the key prefix from array key as it is not necessary in core applications.
				$index           = strpos( $_key, 'kses_' ) === 0 ? substr( $_key, 5 ) : $_key;
				$value[ $index ] = self::sanitizeRecursive( $_value, $_key );
			}
		} elseif ( is_string( $value ) ) {
			// If the prefix is kses_, it means rich text editor content and get it through kses filter. Otherise normal sanitize.
			$value = strpos( $key, 'kses_' ) === 0 ? _String::applyKses( $value ) : _String::castValue( sanitize_text_field( $value ) );
		}

		return $value;
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

	/**
	 * Parse comments from php file as array
	 *
	 * @param string         $path The file path to get manifest from
	 * @param ARRAY_A|OBJECT $ret_type Either object or array to return
	 * @return array|object
	 */
	public static function getManifestArray( string $path, $ret_type = OBJECT ) {
		$result = [];

		// Use regular expressions to match the first PHP comment block
		preg_match( '/\/\*\*(.*?)\*\//s', file_get_contents( $path ), $matches );

		if ( isset( $matches[1] ) ) {
			$comment = $matches[1];

			// Remove leading asterisks and split lines
			$lines = preg_split( '/\r\n|\r|\n/', trim( preg_replace( '/^\s*\*\s*/m', '', $comment ) ) );

			foreach ( $lines as $line ) {
				// Check if the line contains a colon
				if ( strpos( $line, ':' ) !== false ) {
					list($key, $value) = array_map( 'trim', explode( ':', $line, 2 ) );

					$key            = strtolower( str_replace( ' ', '_', $key ) );
					$result[ $key ] = $value;
				}
			}
		}

		$result['file']     = $path;
		$result['dir']      = dirname( $path ) . '/';
		$result['url']      = plugin_dir_url( $path );
		$result['dist_url'] = $result['url'] . 'dist/';

		return ARRAY_A === $ret_type ? $result : (object) $result;
	}

	/**
	 * Get method parameter names
	 *
	 * @param class  $class The class to get method info from
	 * @param string $method The method to get parameters definition
	 *
	 * @return array
	 */
	public static function getMethodParams( $class, $method ) {

		$reflection_method = new \ReflectionMethod( $class, $method );
		$parameters        = $reflection_method->getParameters();
		$_params           = array();

		$type_map = array(
			'int'   => 'integer',
			'float' => 'double',
			'bool'  => 'boolean',
		);

		// Loop through method parameter definition and get configurations
		foreach ( $parameters as $parameter ) {

			$type = (string) $parameter->getType();

			$_params[ $parameter->getName() ] = array(
				'type'    => $type_map[ $type ] ?? $type,
				'default' => $parameter->isDefaultValueAvailable() ? $parameter->getDefaultValue() : null,
			);
		}

		return $_params;
	}
}
