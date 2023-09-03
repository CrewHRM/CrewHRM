<?php

namespace CrewHRM\Helpers;

use CrewHRM\Main;
use CrewHRM\Models\Settings;

class Utilities extends Main {
	/**
	 * Check if the page is a Crew Dashboard
	 *
	 * @param string $page Sub page name to match too
	 * @return boolean
	 */
	public static function isCrewDashboard( $page = null ) {
		$is_dashboard = is_admin() && get_admin_page_parent() == self::$configs->root_menu_slug;
		
		if ( $is_dashboard && $page !== null ) {
			$pages        = ! is_array( $page ) ? array( $page ) : $page;
			$_page        = ! empty( $_GET['page'] ) ? $_GET['page'] : null;
			$is_dashboard = in_array( $_page, $pages );
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
			'post_type'   => 'page', // Retrieve only pages
			'post_status' => 'publish', // Retrieve only published pages
			'numberposts' => -1, // Retrieve all pages (you can limit it if needed)
		);

		// Get the list of pages
		$pages = get_posts( $args );

		$page_list = array_map(
			function ( $page ) {
				return array(
					'id'    => (int) $page->ID,
					'label' => $page->post_title
				);
			},
			$pages
		);
		
		return $page_list;
	}
}
