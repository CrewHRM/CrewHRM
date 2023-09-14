<?php

namespace CrewHRM\Helpers;

class _String {
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
}
