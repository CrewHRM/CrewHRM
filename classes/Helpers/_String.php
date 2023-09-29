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
		'strong',
		'p',
		'div',
		'b',
		'i',
		'br',
		'a',
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
	);

	/**
	 * Convert snake case to camel
	 *
	 * @param string $input The string to convert from snake to camel
	 * @return string
	 */
	public static function snakeToCamel( $input ) {
		$parts      = explode( '_', $input );
		$camel_case = $parts[0];
		$counts     = count( $parts );

		for ( $i = 1; $i < $counts; $i++ ) {
			$camel_case .= ucfirst( $parts[ $i ] ); // phpcs:ignore Generic.CodeAnalysis.ForLoopWithTestFunctionCall.NotAllowed
		}

		return $camel_case;
	}

	/**
	 * Convert camel case to snake case
	 *
	 * @param string $input The string to convert camel to snake case
	 * @return string
	 */
	public static function camelToSnakeCase( $input ) {
		return strtolower( preg_replace( '/([a-z])([A-Z])/', '$1_$2', $input ) );
	}

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
	 * @return string
	 */
	public static function applyKses( string $string ) {
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

		return wp_kses( $string, $allowed );
	}

	/**
	 * Check if a value is float
	 *
	 * @param string|int|float $numericString
	 * @return boolean
	 */
	public static function isFloat( $numericString ) {
		return is_numeric( $numericString ) && strpos( $numericString, '.' ) !== false;
	}
}
