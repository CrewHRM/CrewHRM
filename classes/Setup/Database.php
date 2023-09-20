<?php

namespace CrewHRM\Setup;

use CrewHRM\Main;
use CrewHRM\Models\DB;

class Database {
	public function __construct() {
		add_action( 'crewhrm_activated', array( $this, 'importDB' ) );
	}

	/**
	 * Import database
	 *
	 * @return void
	 */
	public function importDB() {
		$sql_path = Main::$configs->dir . 'dist' . DIRECTORY_SEPARATOR . 'libraries' . DIRECTORY_SEPARATOR . 'db.sql';
		DB::import( file_get_contents( $sql_path ) );
	}
}