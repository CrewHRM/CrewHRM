<?php

namespace CrewHRM\Helpers;

class Sanitize {
	/**
	 * Sanitize array elements
	 *
	 * @param array $value
	 * @return array
	 */
	public function sanitizeArray( array $array ) {
		foreach ( $array as $index => $element ) {
			$array[ $index ] = sanitize_text_field( $element );
		}

		return $array;
	}
}