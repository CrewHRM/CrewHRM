<?php

namespace CrewHRM\Setup;

use CrewHRM\Helpers\Nonce;

class Shortcode {
	/**
	 * Short code name
	 */
	const SHORTCODE = 'crewhrm_careers';

	/**
	 * Mount point id
	 */
	const MOUNTPOINT = 'crewhrm_careers';

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
		return '<div id="' . esc_attr( self::MOUNTPOINT ) . '" data-crewhrm-nonce="' . esc_attr( Nonce::generate( self::MOUNTPOINT ) ) . '"></div>';
	}
}
