<?php

namespace CrewHRM\Helpers;

use CrewHRM\Main;

class Utilities extends Main {
	public static function isCrewDashboard( $frontend = false ) {
		if ( ! $frontend ) {
			return get_admin_page_parent() == self::$configs->root_menu_slug;
		}
	}
}
