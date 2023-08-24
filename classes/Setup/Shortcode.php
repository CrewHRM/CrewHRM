<?php

namespace CrewHRM\Setup;

class Shortcode {
	/**
	 * Short code name
	 */
	const SHORTCODE = 'crewhrm_careers';

	function __construct() {
		add_shortcode( self::SHORTCODE, array( $this, 'careerPage' ) );
	}

	/**
	 * Render shortcodes
	 *
	 * @param [type] $args
	 * @return void
	 */
	public function careerPage( $args ) {
    	do_action( 'careers_page_shortcode' );
		return '<div id="crewhrm_careers"></div>';
	}
}