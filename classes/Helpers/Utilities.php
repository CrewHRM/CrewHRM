<?php
/**
 * Utility functions
 *
 * @package crewhrm
 */

namespace CrewHRM\Helpers;

use CrewHRM\Main;
use CrewHRM\Models\Settings;

/**
 * The class
 */
class Utilities {
	/**
	 * Check if the page is a Crew Dashboard
	 *
	 * @param string $page Optional sub page name to match too
	 * @return boolean
	 */
	public static function isCrewDashboard( $sub_page = null ) {
		$is_dashboard = is_admin() && get_admin_page_parent() === Main::$configs->app_name;

		if ( $is_dashboard && null !== $sub_page ) {
			$pages        = ! is_array( $sub_page ) ? array( $sub_page ) : $sub_page;
			$is_dashboard = in_array( $_GET['page'] ?? null, $pages, true ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		}

		return $is_dashboard;
	}

	/**
	 * Career page ID getter helper function
	 *
	 * @return int|null
	 */
	public static function getCareersPageId() {
		return Settings::getSetting( 'careers_page_id' );
	}

	/**
	 * Check if current page is careers. Add support of sub page check later.
	 *
	 * @return boolean
	 */
	public static function isCareersPage() {
		return ! is_admin() && is_singular() && get_the_ID() === self::getCareersPageId();
	}

	/**
	 * Return page list especially for settings page
	 *
	 * @return array
	 */
	public static function getPageList() {
		// Define arguments for get_posts to retrieve pages
		$args = array(
			'post_type'   => 'page',
			'post_status' => 'publish',
			'numberposts' => -1, // phpcs:ignore WordPress.WP.PostsPerPageNoUnlimited.posts_per_page_numberposts
		);

		// Get the list of pages
		$pages = get_posts( $args );

		$page_list = array_map(
			function ( $page ) {
				return array(
					'id'    => (int) $page->ID,
					'label' => $page->post_title,
				);
			},
			$pages
		);

		return $page_list;
	}

	/**
	 * Return white label data
	 *
	 * @return array
	 */
	public static function getWhiteLabel() {
		return array(
			'app_label'         => apply_filters( 'crewhrm_app_label', Main::$configs->plugin_name ),
			'app_logo'          => apply_filters( 'crewhrm_app_logo', null ),
			'app_logo_extended' => apply_filters( 'crewhrm_app_logo_extended', null )
		);
	}
}
