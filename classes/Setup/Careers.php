<?php
/**
 * Careers page handlers
 *
 * @package crewhrm
 */

namespace CrewHRM\Setup;

use CrewHRM\Helpers\Utilities;
use CrewHRM\Models\Address;
use CrewHRM\Models\Settings;

/**
 * The careers class
 */
class Careers {
	/**
	 * Mount point id
	 */
	const MOUNTPOINT = 'crewhrm_careers';

	/**
	 * Set up careers page
	 *
	 * @return void
	 */
	public function __construct() {
		add_filter( 'query_vars', array( $this, 'registerQueryVars' ) );
		add_action( 'generate_rewrite_rules', array( $this, 'addRewriteRules' ) );
		add_filter( 'the_content', array( $this, 'renderCareers' ) );
	}

	/**
	 * Register careers variables
	 *
	 * @param array $vars Existing query variables from WP
	 * @return array
	 */
	public function registerQueryVars( $vars ) {
		$vars[] = 'crewhrm_segments';
		return $vars;
	}

	/**
	 * Add rewrite rule to support job id and action slug
	 *
	 * @param object $wp_rewrite The rewrite rule to modify
	 * @return void
	 */
	public function addRewriteRules( $wp_rewrite ) {
		$careers_page_id   = Utilities::getCareersPageId();
		$careers_page_slug = get_post_field( 'post_name', $careers_page_id );

		// ~/careers/23/
		$new_rules[ "({$careers_page_slug})/(.+?)/?$" ] = 'index.php?pagename=' . $wp_rewrite->preg_index( 1 ) . '&crewhrm_segments=' . $wp_rewrite->preg_index( 2 );

		$wp_rewrite->rules = $new_rules + $wp_rewrite->rules;
	}

	/**
	 * Output mountpoint for careers component
	 *
	 * @param string $contents The contents of other pages
	 * @return string
	 */
	public function renderCareers( $contents ) {

		// Return original content if it is not careers page
		if ( get_the_ID() !== Utilities::getCareersPageId() ) {
			return $contents;
		}

		// Prepare careers page settings
		$settings = Settings::getSettings();
		$settings = array(
			'header'         => ( $settings['careers_header'] ?? false ) === true,
			'tagline'        => $settings['careers_tagline'] ?? '',
			'sidebar'        => $settings['careers_sidebar'] ?? false,
			'search'         => $settings['careers_search'] ?? false,
			'hero_image_url' => is_array( $settings['careers_hero_image'] ?? null ) ? ( $settings['careers_hero_image']['file_url'] ) : '',
			'country_codes'  => Address::getJobsCountryCodes(),
		);

		return '<div 
				id="' . esc_attr( self::MOUNTPOINT ) . '" 
				data-base_permalink="' . trim( str_replace( get_home_url(), '', get_permalink( get_the_ID() ) ), '/' ) . '"
				data-settings="' . esc_attr( wp_json_encode( $settings ) ) . '"></div>';
	}
}
