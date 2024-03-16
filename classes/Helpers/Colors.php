<?php
/**
 * Color pallete
 *
 * @package crewhrm
 */

namespace CrewHRM\Helpers;

/**
 * Color helper class
 */
class Colors {
	/**
	 * Array of color pallete
	 *
	 * @var array
	 */
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

	/**
	 * Convert hexa to rgba color
	 *
	 * @param string $hex_color The color to convert
	 * @param float  $opacity Opacity to achieve
	 * @return string
	 */
	private static function hexToRgba( $hex_color, $opacity ) {
		// Remove any leading '#' from the hex color code
		$hex_color = ltrim( $hex_color, '#' );

		// Convert the hex color to RGB values
		$r = hexdec( substr( $hex_color, 0, 2 ) );
		$g = hexdec( substr( $hex_color, 2, 2 ) );
		$b = hexdec( substr( $hex_color, 4, 2 ) );

		// Ensure opacity is within the valid range (0 to 1)
		$opacity = max( 0, min( 1, $opacity ) );

		// Create the RGBA color string
		$rgba_color = "rgba($r, $g, $b, $opacity)";

		return $rgba_color;
	}

	/**
	 * Get the colors to render in frontend
	 *
	 * @return array
	 */
	public static function getColors( $key = null, $fallback = null ) {

		$colors = self::$base_colors;

		// Provide some necessary opacity
		$colors['secondary-15'] = self::hexToRgba( $colors['secondary'], 0.15 );
		$colors = apply_filters( 'crewhrm_color_palette', $colors );

		return $key ? ( $colors[ $key ] ?? $fallback ) : $colors;
	}
}
