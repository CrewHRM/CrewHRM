<?php
/**
 * Number related helper class
 *
 * @package crewhrm
 */

namespace CrewHRM\Helpers;

/**
 * Number related class
 */
class Number {
	/**
	 * Prepare number within safe range.
	 *
	 * @param mixed    $value The value
	 * @param integer  $min   Minimum
	 * @param int|null $max   Maximum
	 * @return int
	 */
	public static function getInt( $value, $min = 0, $max = null ) {
		$number = is_numeric( $value ) ? (int) $value : 0;

		if ( $number < $min ) {
			$number = $min;
		}

		if ( null !== $max && $number > $max ) {
			$number = $max;
		}

		return $number;
	}
}
