<?php

namespace CrewHRM\Helpers;

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
		'a'
	);

	/**
	 * Allowed attributes for kses
	 *
	 * @var array
	 */
	private static $allowed_attributes = array( 
		'style'    => array(), 
		'class'    => array(), 
		'id' 	   => array(), 
		'href' 	   => array(), 
		'alt' 	   => array(), 
		'title'    => array(),
		'width'    => array(),
		'height'   => array()
	);

	/**
	 * Convert snake case to camel
	 *
	 * @param string $input
	 * @return string
	 */
	public static function snakeToCamel( $input ) {
		$parts     = explode( '_', $input );
		$camelCase = $parts[0];

		for ( $i = 1; $i < count( $parts ); $i++ ) {
			$camelCase .= ucfirst( $parts[ $i ] );
		}

		return $camelCase;
	}

	/**
	 * Convert camel case to snake case
	 *
	 * @param string $input
	 * @return string
	 */
	public static function camelToSnakeCase( $input ) {
		return strtolower( preg_replace( '/([a-z])([A-Z])/', '$1_$2', $input ) ); 
	}

	/**
	 * Generate random string
	 *
	 * @return void
	 */
	public static function getRandomString($length = 10) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$randomString = '';

		for ( $i = 0; $i < $length; $i++ ) {
			$randomString .= $characters[rand(0, strlen($characters) - 1)];
		}

		return $randomString;
	}

	/**
	 * Apply kses filter on string
	 *
	 * @param string $string
	 * @return string
	 */
	public static function applyKses( string $string ) {
		static $allowed = null;
		
		// Prepare allowed array only once by defining as static
		if ( $allowed === null ) {

			$allowed = array();

			// Loop through tags 
			foreach( self::$allowed_html as $tag ) {

				// And assign supported attributes per tag
				$allowed[ $tag ] = self::$allowed_attributes;
			}
		}
		
		return wp_kses( $string, $allowed );
	}
}
