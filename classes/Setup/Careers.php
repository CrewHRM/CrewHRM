<?php

namespace CrewHRM\Setup;

use CrewHRM\Helpers\Utilities;

class Careers {
	/**
	 * Mount point id
	 */
	const MOUNTPOINT = 'crewhrm_careers';

	public function __construct() {		
		add_filter( 'query_vars', array( $this, 'registerQueryVars' ) );
		add_action( 'generate_rewrite_rules', array( $this, 'addRewriteRules' ) );
		add_filter( 'the_content', array( $this, 'renderCareers' ) );
	}

	/**
	 * Register careers variables
	 *
	 * @return void
	 */
	public function registerQueryVars( $vars ) {
		$vars[] = 'crewhrm_segments';
		return $vars;
	}

	/**
	 * Add rewrite rule to support job id and action slug
	 *
	 * @param object $$wp_rewrite
	 * @return void
	 */
	public function addRewriteRules( $wp_rewrite ) {
		$careers_page_id   = Utilities::getCareersPageId();
		$careers_page_slug = get_post_field('post_name', $careers_page_id);

		// ~/careers/23/
		$new_rules["({$careers_page_slug})/(.+?)/?$"] = 'index.php?pagename=' . $wp_rewrite->preg_index(1) . '&crewhrm_segments=' . $wp_rewrite->preg_index(2);
		
		$wp_rewrite->rules = $new_rules + $wp_rewrite->rules;
	}

	/**
	 * Output mountpoint for careers component
	 *
	 * @return string
	 */
	public function renderCareers() {
		if ( get_the_ID() === Utilities::getCareersPageId() ) {

			return '<div 
					id="' . esc_attr( self::MOUNTPOINT ) . '" 
					data-crewhrm-nonce="' . esc_attr( wp_create_nonce( self::MOUNTPOINT ) ) . '"
					data-base_permalink="' . trim( str_replace( get_home_url(), '', get_permalink( get_the_ID() ) ), '/' ) . '"></div>';
		}
	}
}