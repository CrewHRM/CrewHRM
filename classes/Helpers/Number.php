<?php

namespace CrewHRM\Helpers;

class Number {
	/**
	 * Prepare number within safe range.
	 *
	 * @param mixed $value 
	 * @param integer $min
	 * @param int|null $max
	 * @return int
	 */
	public static function getInt( $value, $min = 0, $max = null ) {
		$number = is_numeric( $value ) ? (int)$value : 0;
		
		if ( $number < $min ) {
			$number = $min;
		}

		if ( $max !== null && $number > $max ) {
			$number = $max;
		}

		return $number;
	}
}