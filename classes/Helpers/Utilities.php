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
	 * @param string|array $sub_page Optional sub page name to match too
	 * @return boolean
	 */
	public static function isCrewDashboard( $sub_page = null ) {

		$is_dashboard = is_admin() && get_admin_page_parent() === Main::$configs->app_name;

		if ( $is_dashboard && null !== $sub_page ) {
			$pages        = ! is_array( $sub_page ) ? array( $sub_page ) : $sub_page;
			$current_page = sanitize_text_field( $_GET['page'] ?? '' );
			$is_dashboard = in_array( $current_page, $pages, true );
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
	 * Get link to HRM main dashboard
	 *
	 * @param string $append Additional segments
	 *
	 * @return string
	 */
	public static function getDashboardPermalink( $append = '' ) {
		return admin_url( 'admin.php?page=' . Main::$configs->app_name ) . $append;
	}

	/**
	 * Return page list especially for settings page
	 *
	 * @param init $limit How many pages t oget
	 *
	 * @return array
	 */
	public static function getPageList( $limit ) {
		// Define arguments for get_posts to retrieve pages
		$args = array(
			'post_type'   => 'page',
			'post_status' => 'publish',
			'numberposts' => $limit,
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
			'app_logo_extended' => apply_filters( 'crewhrm_app_logo_extended', null ),
		);
	}

	/**
	 * Get timezone offset basedon settings
	 *
	 * @return int
	 */
	public static function getTimezoneOffset() {
		$time_zone_string = get_option( 'timezone_string' );

		// If the time zone string is not set, use the default UTC offset
		if ( empty( $time_zone_string ) ) {
			$time_zone_offset = get_option( 'gmt_offset' );
		} else {
			// Create a DateTime object with the specified time zone
			$time_zone = new \DateTimeZone( $time_zone_string );

			// Get the current time in the specified time zone
			$current_time = new \DateTime( 'now', $time_zone );

			// Get the time zone offset in seconds
			$time_zone_offset = $time_zone->getOffset( $current_time ) / 3600; // Convert seconds to hours
		}

		// Set explicit posetive sign
		$time_zone_offset = (string) $time_zone_offset;
		if ( '-' !== substr( $time_zone_offset, 0, 1 ) ) {
			$time_zone_offset = '+' . $time_zone_offset;
		}

		return $time_zone_offset;
	}

	/**
	 * Convert unix to specific timezone offset and return time string.
	 *
	 * @param int    $timestamp        Unix timestamp seconds
	 * @param int    $time_zone_offset Timezone offset
	 * @param string $format_pattern   Date time format
	 * @return string
	 */
	public static function formatUnixTimestamp( $timestamp, $time_zone_offset, $format_pattern = 'Y-m-d H:i' ) {
		// Create a DateTime object with the specified time zone offset
		$date_time = new \DateTime( "@$timestamp" );
		$date_time->setTimezone( new \DateTimeZone( $time_zone_offset ) );

		// Format the DateTime object with the custom pattern
		return $date_time->format( $format_pattern );
	}

	/**
	 * Prepare number within safe range.
	 *
	 * @param mixed    $value The value
	 * @param integer  $min   Minimum
	 * @param int|null $max   Maximum
	 * @return int
	 */
	public static function getInt( $value, $min = 0, $max = null ) {
		$number = is_numeric( $value ) ? (int) $value : 0;

		if ( $number < $min ) {
			$number = $min;
		}

		if ( null !== $max && $number > $max ) {
			$number = $max;
		}

		return $number;
	}
}
