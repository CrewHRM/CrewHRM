<?php

namespace CrewHRM\Helpers;

use CrewHRM\Main;

class Colors {
	private static $base_colors = array(
		'primary'      => '#1A1A1A',
		'secondary'    => '#236BFE',
		'tertiary'     => '#E3E5E8',
		'quaternary'   => '#F9F9F9',

		'text'         => '#1A1A1A',
		'text-light'   => '#72777B',
		'text-lighter' => '#BBBFC3',
		'text-hint'    => '#757C8E',
		
		'success'      => '#5B9215',
		'warning'      => '#F57A08',
		'error'        => '#EA4545',

		'black'        => '#000000',
		'white'        => '#FFFFFF',
		'transparent'  => 'rgba(0, 0, 0, 0)',
	);

	private static function hexToRgba( $hexColor, $opacity ) {
		// Remove any leading '#' from the hex color code
		$hexColor = ltrim( $hexColor, '#' );

		// Convert the hex color to RGB values
		$r = hexdec( substr( $hexColor, 0, 2 ) );
		$g = hexdec( substr( $hexColor, 2, 2 ) );
		$b = hexdec( substr( $hexColor, 4, 2 ) );

		// Ensure opacity is within the valid range (0 to 1)
		$opacity = max( 0, min( 1, $opacity ) );

		// Create the RGBA color string
		$rgbaColor = "rgba($r, $g, $b, $opacity)";

		return $rgbaColor;
	}

	public static function getColors() {
		$colors = self::$base_colors;

		// Provide some necessary opacity
		$colors['secondary-15'] = self::hexToRgba( $colors['secondary'], 0.15 );
		
		return $colors;
	}
}
