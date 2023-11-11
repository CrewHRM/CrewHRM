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
	 * Get link to HRM main dashboard
	 *
	 * @param string $append Additional segments
	 * 
	 * @return string
	 */
	public static function getDashboardPermalink( $append = '' ) {
		return admin_url( "admin.php?page=" . Main::$configs->app_name ) . $append;
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

	public static function getTimezoneOffset() {
		$time_zone_string = get_option('timezone_string');

		// If the time zone string is not set, use the default UTC offset
		if ( empty( $time_zone_string ) ) {
			$time_zone_offset = get_option('gmt_offset');
		} else {
			// Create a DateTime object with the specified time zone
			$time_zone = new \DateTimeZone( $time_zone_string );

			// Get the current time in the specified time zone
			$current_time = new \DateTime( 'now', $time_zone );

			// Get the time zone offset in seconds
			$time_zone_offset = $time_zone->getOffset( $current_time ) / 3600; // Convert seconds to hours
		}

		return $time_zone_offset;
	}

	/**
	 * Convert unix to specific timezone offset and return time string.
	 *
	 * @param int $timestamp        Unix timestamp seconds
	 * @param int $timeZoneOffset   Timezone offset
	 * @param string $formatPattern Date time format
	 * @return string
	 */
	public static function formatUnixTimestamp( $timestamp, $timeZoneOffset, $formatPattern = 'Y-m-d H:i' ) {
		// Create a DateTime object with the specified time zone offset
		$date_time = new \DateTime( "@$timestamp" );
		$date_time->setTimezone( new \DateTimeZone( $timeZoneOffset ) );

		// Format the DateTime object with the custom pattern
		return $date_time->format( $formatPattern );
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

	/**
	 * Get site link without http protocol and query string
	 *
	 * @return string
	 */
	public static function getSiteLink() {
		$parsed    = parse_url( get_home_url() );
		$site_link = $parsed['host'] . ( ! empty( $parsed['port'] ) ? ':' . $parsed['port'] : '' );
		return $site_link;
	}
}
