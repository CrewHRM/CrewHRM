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
		add_action( 'save_post_page', array( $this, 'setCareersPage' ), 100, 2 );
		add_filter( 'pre_get_document_title', array( $this, 'addJobTitle' ), 10, 1 );
	}

	/**
	 * Render shortcodes
	 *
	 * @param [type] $args
	 * @return void
	 */
	public function careerPage( $args ) {
		do_action( 'careers_page_shortcode' );
		return '<div id="' . esc_attr( self::MOUNTPOINT ) . '" data-crewhrm-nonce="' . esc_attr( wp_create_nonce( self::MOUNTPOINT ) ) . '"></div>';
	}

	/**
	 * Store the page/post ID in option where the shortcode is used. It will be used to generate permalink with.
	 *
	 * @param int $post_id
	 * @param object $post_id
	 * @return void
	 */
	public function setCareersPage( $post_id, $post ) {		
		if ( ! empty( $post->post_content ) && strpos( $post->post_content, '[' . self::SHORTCODE ) !== false ) {
			update_option( 'crewhrm_careers_page_id', $post_id );
		}
	}

	/**
	 * Add single job title to the page title
	 *
	 * @param string $title
	 * @return string
	 */
	public function addJobTitle( $title ) {
		// To Do: Introduce custom url for careers page.
		if ( is_page() && get_the_ID() == get_option( 'crewhrm_careers_page_id' ) ) {
			$title =  'Web Dev | ' . get_the_title( get_the_ID() ) . ' | ' . get_bloginfo( 'name' );
		}
		return $title;
	}
}
