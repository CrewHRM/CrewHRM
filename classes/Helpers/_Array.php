<?php

namespace CrewHRM\Helpers;

class _Array {
	public static function getArray( $value ) {
		return is_array( $value ) ? $value : array();
	}
}