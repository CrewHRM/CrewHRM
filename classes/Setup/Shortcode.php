<?php

namespace CrewHRM\Setup;

class Shortcode {
	function __construct() {
		add_shortcode( 'crewhrm_careers', array( $this, 'careerPage' ) );
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