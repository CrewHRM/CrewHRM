<?php
/**
 * Weekly Schedule related functionalities
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

use CrewHRM\Helpers\_String;

class WeeklySchedule {

	/**
	 * Update schedule for a user or for global settings
	 *
	 * @param int   $employment_id
	 * @param array $schedules
	 * @return void
	 */
	public static function updateSchedule( $employment_id, $schedules ) {

		// Delete removed slots first
		self::deleteRemovedSlots( $employment_id, $schedules );

		// Loop through per day
		global $wpdb;
		foreach ( $schedules as $day => $schedule ) {

			$slots = $schedule['slots'] ?? array();

			// Loop through slots in a single day
			foreach ( $slots as $schedule_id => $slot ) {
				$row = array(
					'week_day'      => $day,
					'employment_id' => $employment_id,
					'time_starts'   => $slot['start'],
					'time_ends'     => $slot['end'],
					'enable'        => $schedule['enable'],
				);

				// Update existing one by the schedule ID
				if ( is_numeric( $schedule_id ) ) {
					$wpdb->update(
						$wpdb->crewhrm_weekly_schedules,
						$row,
						array( 'schedule_id' => $schedule_id )
					);
				} else {
					// Create new entry
					$wpdb->insert(
						$wpdb->crewhrm_weekly_schedules,
						$row
					);
				}
			}
		}
	}

	/**
	 * Delete removed slots
	 *
	 * @param int   $employment_id
	 * @param array $schedules
	 * @return void
	 */
	private static function deleteRemovedSlots( $employment_id, $schedules ) {

		global $wpdb;

		// Delete removed slots
		$remaining_ids = array();
		foreach ( $schedules as $day ) {
			$slot_ids = array_filter(
				array_keys( $day['slots'] ?? array() ),
				function ( $id ) {
					return is_numeric( $id ); // Non numeric means newly added, and ids are random string assigned by react.
				}
			);

			$remaining_ids = array_merge( $remaining_ids, $slot_ids );
		}

		// If user ID not passed, it means it is global settings
		$where_clause = $employment_id === null ? ' employment_id IS NULL' : $wpdb->prepare( ' employment_id=%d', $employment_id );

		// Delete all slots except remaings
		if ( ! empty( $remaining_ids ) ) {
			$remaining_ids = array_values( $remaining_ids );
			$ids_places    = _String::getPlaceHolders( $remaining_ids );
			$where_clause .= $wpdb->prepare( " AND schedule_id NOT IN ({$ids_places})", ...$remaining_ids );
		}

		$wpdb->query(
			"DELETE FROM {$wpdb->crewhrm_weekly_schedules} WHERE {$where_clause}"
		);
	}

	/**
	 * Get weekly schedule
	 *
	 * @param int $employment_id
	 * @return array
	 */
	public static function getSchedule( $employment_id ) {

		global $wpdb;

		$schedules = array(
			'monday'    => array(
				'enable' => false,
				'slots'  => (object) array(),
			),
			'tuesday'   => array(
				'enable' => false,
				'slots'  => (object) array(),
			),
			'wednesday' => array(
				'enable' => false,
				'slots'  => (object) array(),
			),
			'thursday'  => array(
				'enable' => false,
				'slots'  => (object) array(),
			),
			'friday'    => array(
				'enable' => false,
				'slots'  => (object) array(),
			),
			'saturday'  => array(
				'enable' => false,
				'slots'  => (object) array(),
			),
			'sunday'    => array(
				'enable' => false,
				'slots'  => (object) array(),
			),
		);

		// If custom date not enabled then get from global settings
		if ( ! Employment::getMeta( $employment_id, 'use_custom_weekly_schedule' ) ) {

			// If setting has schedule, use it.
			$setting_schedule = Settings::getSetting( 'employee_default_working_hours' );
			if ( ! empty( $setting_schedule ) ) {
				$schedules = $setting_schedule;
			}

			// As custom schedule not enabled, return either from setting or empty schedule
			return $schedules;
		}

		$where_clause = $employment_id === null ? ' employment_id IS NULL' : $wpdb->prepare( ' employment_id=%d', $employment_id );

		$slots = $wpdb->get_results(
			"SELECT * FROM {$wpdb->crewhrm_weekly_schedules} WHERE {$where_clause}",
			ARRAY_A
		);

		if ( empty( $slots ) ) {
			return null;
		}

		foreach ( $slots as $slot ) {
			$schedule_id                              = $slot['schedule_id'];
			$schedules[ $slot['week_day'] ]['enable'] = (bool) $slot['enable'];
			$schedules[ $slot['week_day'] ]['slots']->$schedule_id = array(
				'start' => $slot['time_starts'],
				'end'   => $slot['time_ends'],
			);
		}

		return $schedules;
	}
}
