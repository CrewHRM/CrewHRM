<?php

namespace CrewHRM\Helpers;

use CrewHRM\Main;

class Colors {
	private static $base_colors = array(
		'primary'      => '#1A1A1A',
		'secondary'    => '#236BFE',
		'tertiary'     => '#E3E5E8',

		'text'         => '#1A1A1A',
		'text-light'   => '#72777B',
		'text-lighter' => '#BBBFC3',
		
		'danger'       => '#EA4545',
		'success'      => '#5B9215',
		'warning'      => '#F57A08'
	);

	public static function getColors() {
		return self::$base_colors;
	}
}