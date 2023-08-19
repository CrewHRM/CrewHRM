<?php

namespace CrewHRM\Helpers;

use CrewHRM\Main;

class Colors {
	private static $base_colors = array(
		'primary'      => '#1A1A1A',
		'secondary'    => '#236BFE',
		'tertiary'     => '#E3E5E8',

		'text'         => '#1A1A1A',
		'text-light'   => '#72777B',
		'text-lighter' => '#BBBFC3',
		
		'danger'       => '#EA4545',
		'success'      => '#5B9215',
		'warning'      => '#F57A08'
	);

	private static function hexToRgba($hexColor, $opacity) {
		// Remove any leading '#' from the hex color code
		$hexColor = ltrim($hexColor, '#');

		// Convert the hex color to RGB values
		$r = hexdec(substr($hexColor, 0, 2));
		$g = hexdec(substr($hexColor, 2, 2));
		$b = hexdec(substr($hexColor, 4, 2));

		// Ensure opacity is within the valid range (0 to 1)
		$opacity = max(0, min(1, $opacity));

		// Create the RGBA color string
		$rgbaColor = "rgba($r, $g, $b, $opacity)";

		return $rgbaColor;
	}

	public static function getColors() {
		$colors = self::$base_colors;

		// Loop through the colors
		foreach ( $colors as $name => $code ) {

			// Loop through the opacity levels
			for ( $i = 0.05; $i <= 1; $i += 0.05 ) {
				$_name = (string) number_format( $i, 2 );
				$_name = explode( '.', $_name );
				$_name = $name . '-' . end( $_name );

				$colors[ $_name ] = self::hexToRgba( $code, $i );
			}
		}

		return $colors;
	}
}