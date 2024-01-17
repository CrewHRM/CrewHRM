<?php
/**
 *  Careers and other short code registrar
 *
 * @package crewhrm
 */

namespace CrewHRM\Setup;

use CrewHRM\Helpers\_Array;

/**
 * Shortcode registrar class
 */
class Shortcode {

	/**
	 * Shortcode registrar hooks
	 *
	 * @return void
	 */
	public function __construct() {
		add_shortcode( 'crewhrm_careers', array( $this, 'careersShortcode' ) );
	}

	/**
	 * Careers page render
	 *
	 * @param array $attrs Attributes assigned during exection
	 *
	 * @return string
	 */
	public function careersShortcode( $attrs ) {

		$attrs = _Array::getArray( $attrs );

		$args = array(
			'search'          => $attrs['search'] ?? true,
			'header'          => $attrs['header'] ?? true,
			'hero_image_url'  => $attrs['hero_image_url'] ?? '',
			'tagline'         => $attrs['tagline'] ?? '',
			'sidebar'         => $attrs['sidebar'] ?? true,
			'department_id'   => $attrs['department_id'] ?? null,
			'keyword'         => $attrs['keyword'] ?? null,
			'country_code'    => $attrs['country_code'] ?? null,
			'employment_type' => $attrs['employment_type'] ?? null,
		);

		return '<div 
			class="crewhrm-careers-block" 
			data-attributes="' . esc_attr( wp_json_encode( $args ) ) . '"></div>';
	}
}
