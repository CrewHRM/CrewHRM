<?php
/**
 * Plugin settings handler
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;
use CrewHRM\Helpers\_String;
use CrewHRM\Helpers\File;

/**
 * Settings manager class
 */
class Settings {

	/**
	 * Plugin settings option name
	 */
	const KEY_SETTINGS = 'crewhrm_plugins_settings';

	/**
	 * Business type option name
	 */
	const BUSINESS_TYPE_NAME = 'crewhrm-business-types';

	/**
	 * Commn method to get settings for both
	 *
	 * @return array
	 */
	private static function get() {

		$defaults = array(
			'careers_search'          => true,
			'careers_sidebar'         => true,
			'application_form_layout' => 'segmented_form',
			'job_post_per_page'       => 20,
			'outgoing_email_events'   => apply_filters(
				'crewhrm_email_events_default',
				array(
					'application-confirmation',
				)
			),
		);

		$_data = get_option( self::KEY_SETTINGS );
		$_data = _Array::getArray( $_data );
		$_data = array_merge( $defaults, $_data );
		$_data = File::applyDynamics( $_data );

		return $_data;
	}

	/**
	 * Get plugin settings
	 *
	 * @param string|null $name    Settings name
	 * @param mixed       $default Default return value
	 * @return mixed
	 */
	public static function getSettings( $name = null, $default = null ) {

		// Pass through fitlers for pro default options ideally
		$settings = apply_filters( 'crewhrm_settings', self::get() );

		return null !== $name ? ( $settings[ $name ] ?? $default ) : $settings;
	}

	/**
	 * Get WP max upload size in MB.
	 *
	 * @return int
	 */
	public static function getWpMaxUploadSize() {
		return floor( ( wp_max_upload_size() / 1024 ) / 1024 );
	}

	/**
	 * Get specific settings
	 *
	 * @param string $name    Get specific setting value
	 * @param mixed  $default Default return value
	 * @return mixed
	 */
	public static function getSetting( string $name, $default = null ) {
		return self::getSettings( $name, $default );
	}

	/**
	 * Save company profile data coming from ideally settings page
	 *
	 * @param array $data Settings to save
	 * @param bool  $merge Whether to merge with existing or not
	 * @return void
	 */
	public static function saveSettings( array $data, $merge = false ) {

		// In case you need to update only on option inside the array
		if ( true === $merge ) {
			$data = array_merge( self::get(), $data );
		}

		// Save general info
		update_option( self::KEY_SETTINGS, apply_filters( 'crewhrm_save_settings', $data ), true );

		// Flush rewrite rule to apply dashboard page change
		flush_rewrite_rules();
	}

	/**
	 * Return recruiter email to send on behalf of
	 *
	 * @return string|null
	 */
	public static function getRecruiterEmail() {
		// Get From company settings first
		$mail = self::getSettings( 'recruiter_email' );

		// Then from global settings
		if ( empty( $mail ) ) {
			$mail = get_option( 'admin_email' );
		}

		return empty( $mail ) ? null : $mail;
	}

	/**
	 * Get settings for careers listing only
	 *
	 * @return array
	 */
	public static function getCareersListSettings() {

		$settings = self::getSettings();

		return array(
			'header'         => ( $settings['careers_header'] ?? false ) === true,
			'tagline'        => $settings['careers_tagline'] ?? '',
			'sidebar'        => $settings['careers_sidebar'] ?? false,
			'search'         => $settings['careers_search'] ?? false,
			'hero_image_url' => is_array( $settings['careers_hero_image'] ?? null ) ? ( $settings['careers_hero_image']['file_url'] ) : '',
			'country_codes'  => Address::getJobsCountryCodes(),
			'form_layout'    => self::getSetting( 'application_form_layout' ),
		);
	}

	/**
	 * Import default business type if not already
	 *
	 * @return void
	 */
	public static function importBusinessTypes() {

		// Get existing types from options
		$types = self::getSavedBusinessTypes();

		// If empty, import new
		if ( empty( $types ) ) {
			update_option(
				self::BUSINESS_TYPE_NAME,
				array(
					'agriculture_naturalresources' => esc_html__( 'Agriculture & Natural Resources', 'hr-management' ),
					'extraction_mining'            => esc_html__( 'Extraction & Mining', 'hr-management' ),
					'energy_utilities'             => esc_html__( 'Energy & Utilities', 'hr-management' ),
					'construction_infrastructure'  => esc_html__( 'Construction & Infrastructure', 'hr-management' ),
					'manufacturing_production'     => esc_html__( 'Manufacturing & Production', 'hr-management' ),
					'wholesale_distribution'       => esc_html__( 'Wholesale & Distribution', 'hr-management' ),
					'retail_consumergoods'         => esc_html__( 'Retail & Consumer Goods', 'hr-management' ),
					'transportation_logistics'     => esc_html__( 'Transportation & Logistics', 'hr-management' ),
					'technology_communication'     => esc_html__( 'Technology & Communication', 'hr-management' ),
					'finance_insurance'            => esc_html__( 'Finance & Insurance', 'hr-management' ),
					'realestate_property'          => esc_html__( 'Real Estate & Property', 'hr-management' ),
					'professionalservices'         => esc_html__( 'Professional Services', 'hr-management' ),
					'healthcare_wellness'          => esc_html__( 'Healthcare & Wellness', 'hr-management' ),
					'entertainment_media'          => esc_html__( 'Entertainment & Media', 'hr-management' ),
					'hospitality_tourism'          => esc_html__( 'Hospitality & Tourism', 'hr-management' ),
					'education_training'           => esc_html__( 'Education & Training', 'hr-management' ),
					'nonprofit_socialservices'     => esc_html__( 'Non-Profit & Social Services', 'hr-management' ),
					'government_publicservices'    => esc_html__( 'Government & Public Services', 'hr-management' ),
				)
			);
		}
	}

	/**
	 * Get business types from options
	 *
	 * @return array
	 */
	private static function getSavedBusinessTypes() {
		$types = get_option( self::BUSINESS_TYPE_NAME );
		return ! is_array( $types ) ? array() : $types;
	}

	/**
	 * Get saved business types array to show in drop down and in other places
	 *
	 * @return array
	 */
	public static function getBusinessTypes() {
		return apply_filters( 'crewhrm_business_types', self::getSavedBusinessTypes() );
	}

	/**
	 * Prepare the types array for dropdown
	 *
	 * @return array
	 */
	public static function getBusinessTypesDropdown() {
		$types     = self::getBusinessTypes();
		$new_array = array();

		foreach ( $types as $key => $label ) {
			$new_array[] = array(
				'id'    => $key,
				'label' => $label,
			);
		}

		return $new_array;
	}

	/**
	 * Add new business type in option
	 *
	 * @param string $type_name The name of the business type
	 * @return string
	 */
	public static function addBusinessType( string $type_name ) {

		$type_name = trim( preg_replace( '/\s+/', ' ', $type_name ) );
		if ( empty( $type_name ) ) {
			return false;
		}

		$types        = self::getSavedBusinessTypes();
		$id           = _String::getRandomString();
		$types[ $id ] = $type_name;

		update_option( self::BUSINESS_TYPE_NAME, $types );

		return $id;
	}

	/**
	 * Get social links from settings
	 *
	 * @return array
	 */
	public static function getSocialLinks() {

		$links        = array();
		$link_options = self::getSettings();
		$link_names   = array(
			'website_url'  => 'ch-icon ch-icon-world',
			'linkedin_url' => 'ch-icon ch-icon-linkedin2',
			'twitter_url'  => 'ch-icon ch-icon-x',
			'facebook_url' => 'ch-icon ch-icon-facebook',
		);

		foreach ( $link_names as $key => $icon ) {
			if ( ! empty( $link_options[ $key ] ) ) {
				$links[] = array(
					'url'  => $link_options[ $key ],
					'icon' => $icon,
				);
			}
		}

		return apply_filters( 'crewhrm_social_links', $links );
	}
}
