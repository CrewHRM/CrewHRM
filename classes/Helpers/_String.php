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
		'size'   => array()
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
	 * @param string|int|float $numeric_string The value to check if float
	 * @return boolean
	 */
	public static function isFloat( $numeric_string ) {
		return is_numeric( $numeric_string ) && strpos( $numeric_string, '.' ) !== false;
	}

	/**
	 * Minify html
	 *
	 * @param string $html
	 * @return string
	 */
	public static function minifyHTML( $html ) {
		// Remove HTML comments
		$html = preg_replace('/<!--(.|\s)*?-->/', '', $html);
		
		// Remove line breaks
		$html = preg_replace('/\n/', '', $html);
		$html = preg_replace('/\r/', '', $html);

		// Remove excess whitespace
		$html = preg_replace('/\s+/', ' ', $html);
		
		// Remove leading and trailing spaces
		$html = trim($html);

		return $html;
	}
}
