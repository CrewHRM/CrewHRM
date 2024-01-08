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
	 * @param int $length The length to generate random stirng
	 * @return string
	 */
	public static function getRandomString( $length = 10 ) {
		$characters    = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$random_string = '';

		for ( $i = 0; $i < $length; $i++ ) {
			$random_string .= $characters[ wp_rand( 0, strlen( $characters ) - 1 ) ];
		}

		return $random_string;
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
	 * @param string $value
	 * @return mixed
	 */
	public static function castValue( $value ) {

		if ( is_string( $value ) ) {

			if ( is_numeric( $value ) ) {
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
				$value = maybe_unserialize( $value );
			}
		}

		return $value;
	}
}
