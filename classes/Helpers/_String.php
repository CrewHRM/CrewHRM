<?php
/**
 * String related operations
 *
 * @package crewhrm
 */

namespace CrewHRM\Helpers;

/**
 * String handler class
 */
class _String {
	/**
	 * Allowed html elements for kses
	 *
	 * @var array
	 */
	private static $allowed_html = array(
		'a',
		'b',
		'br',
		'code',
		'del',
		'div',
		'em',
		'i',
		'ins',
		'kbd',
		'li',
		'ol',
		'p',
		'small',
		'span',
		'strong',
		'sub',
		'sup',
		'u',
		'ul',
	);

	/**
	 * Allowed attributes for kses
	 *
	 * @var array
	 */
	private static $allowed_attributes = array(
		'style'  => array(),
		'class'  => array(),
		'id'     => array(),
		'href'   => array(),
		'alt'    => array(),
		'title'  => array(),
		'width'  => array(),
		'height' => array(),
		'size'   => array(),
	);

	/**
	 * Generate random string
	 *
	 * @param int $length
	 * @param stirng $prefix Prefix
	 * @param stirng $postfix Postfix
	 *
	 * @return string
	 */
	public static function getRandomString( $length = 5, $prefix = 'r', $postfix = 'r' ) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$ms         = (string) microtime( true );
		$ms         = str_replace( '.', '', $ms );
		$string     = $prefix . $ms;

		for ( $i = 0; $i < $length; $i++ ) {
			$string .= $characters[ wp_rand( 0, strlen( $characters ) - 1 ) ];
		}

		return $string . $postfix;
	}

	/**
	 * Apply kses filter on string
	 *
	 * @param string $string The string to apply kses filter
	 * @param bool   $echo Whether to echo rather than return or not
	 * @return string
	 */
	public static function applyKses( string $string, $echo = false ) {
		static $allowed = null;

		// Prepare allowed array only once by defining as static
		if ( null === $allowed ) {

			$allowed = array();

			// Loop through tags
			foreach ( self::$allowed_html as $tag ) {

				// And assign supported attributes per tag
				$allowed[ $tag ] = self::$allowed_attributes;
			}
		}

		if ( $echo ) {
			echo wp_kses( $string, $allowed );
		} else {
			return wp_kses( $string, $allowed );
		}
	}

	/**
	 * Check if a value is float
	 *
	 * @param string|int|float $numeric_string The value to check if float
	 * @return boolean
	 */
	public static function isFloat( $numeric_string ) {
		return is_numeric( $numeric_string ) && strpos( $numeric_string, '.' ) !== false;
	}

	/**
	 * Cast a string value to nearest data type
	 *
	 * @param string $value The value to convert to nearest data type
	 *
	 * @return mixed
	 */
	public static function castValue( $value ) {

		if ( is_string( $value ) ) {

			if (preg_match('/^0+\d*$/', $value)) {
				$value = $value;
			} elseif ( is_numeric( $value ) ) {
				// Cast number
				$value = self::isFloat( $value ) ? (float) $value : (int) $value;

			} elseif ( 'true' === $value ) {
				// Cast boolean true
				$value = true;

			} elseif ( 'false' === $value ) {
				// Cast boolean false
				$value = false;

			} elseif ( 'null' === $value ) {
				// Cast null
				$value = null;

			} elseif ( '[]' === $value ) {
				// Cast empty array
				$value = array();

			} else {
				// Maybe unserialize
				$value = self::maybe_unserialize( $value );
			}
		}

		return $value;
	}

	/**
	 * Helper method to generate placeholders for in query
	 *
	 * @param int|array $count The amount of placeholders or the data array to get count of.
	 * @param string    $placeholder The placeholder. Default %d for numeric values as it is mostly used.
	 * @return string
	 */
	public static function getPlaceHolders( $count, string $placeholder = '%d' ) {
		$count = is_array( $count ) ? count( $count ) : $count;
		return implode( ', ', array_fill( 0, $count, $placeholder ) );
	}

	/**
	 * Consolidate string
	 *
	 * @param string  $input_string
	 * @param boolean $replace_newlines
	 * @return string
	 */
	public static function consolidate( string $input_string, $replace_newlines = false ) {
		$pattern = $replace_newlines ? '/[\s\t\r\n]+/' : '/[\s\t]+/';
		return preg_replace( $pattern, ' ', trim( $input_string ) );
	}

	/**
	 * Safely unserialize data, blocking object deserialization for security.
	 *
	 * @param mixed $data The data to be checked and potentially unserialized.
	 * @return mixed The unserialized data, or the original data if not serialized or if an object is detected.
	 */
	public static function maybe_unserialize( $data ) {
		// Check if the data is serialized
		if ( is_serialized( $data ) ) {
			// Trim the data to remove any extra whitespace
			$data = trim( $data );
	
			// Check if the serialized data starts with 'O:', indicating an object
			if ( preg_match( '/^O:\d+:"[a-zA-Z0-9_]+":\d+:\{/', $data ) ) {
				// If it's a serialized object, return the original data to block object deserialization
				return $data;
			}
	
			// Unserialize the data but prevent objects from being unserialized
			$unserialized_data = @unserialize( $data, ['allowed_classes' => false] );
	
			// If unserialization fails or returns false (but not due to 'b:0;' which is valid false), return the original data
			if ( $unserialized_data === false && $data !== 'b:0;' ) {
				return $data;
			}
	
			return $unserialized_data;
		}
	
		// If not serialized, return the original data
		return $data;
	}
}
