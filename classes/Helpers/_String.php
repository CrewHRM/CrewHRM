<?php

namespace CrewHRM\Helpers;

class _String {
	/**
	 * Convert snake case to camel
	 *
	 * @param string $input
	 * @return string
	 */
	public static function snakeToCamel($input) {
		$parts = explode('_', $input);
		$camelCase = $parts[0];

		for ($i = 1; $i < count($parts); $i++) {
			$camelCase .= ucfirst($parts[$i]);
		}

		return $camelCase;
	}
}