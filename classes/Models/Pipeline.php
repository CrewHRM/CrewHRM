<?php

namespace CrewHRM\Models;

class Pipeline {
	public static function create( $application_id, $stage_id, $action_taker_id ) {
		global $wpdb;
		$wpdb->insert(
			DB::pipeline(),
			array(
				'application_id'  => $application_id,
				'stage_id'        => $stage_id,
				'action_taker_id' => $action_taker_id,
			)
		);
	}
}