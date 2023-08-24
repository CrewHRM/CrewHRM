<?php

namespace CrewHRM\Helpers;

use CrewHRM\Main;

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
}
