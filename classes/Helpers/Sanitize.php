<?php
/**
 * Sanitize helper class
 *
 * @package crewhrm
 */

namespace CrewHRM\Helpers;

/**
 * The helper class methods
 */
class Sanitize {
	/**
	 * Sanitize array elements
	 *
	 * @param array $array The array to sanitize
	 * @return array
	 */
	public function sanitizeArray( array $array ) {
		foreach ( $array as $index => $element ) {
			$array[ $index ] = sanitize_text_field( $element );
		}

		return $array;
	}
}
