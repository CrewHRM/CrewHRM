<?php
/**
 * Address handler
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;
use CrewHRM\Helpers\_String;
use CrewHRM\Helpers\Utilities;

/**
 * Address class
 */
class Address {
	/**
	 * Create or update an address
	 *
	 * @param array $address Address array consisting street_address, city, province, zip_code country_code etc.
	 * @return int Address ID
	 */
	public static function createUpdateAddress( array $address ) {
		
		$_address = array(
			'unit_flat'      => $address['unit_flat'] ?? null,
			'street_address' => $address['street_address'] ?? '',
			'city'           => $address['city'] ?? '',
			'province'       => $address['province'] ?? '',
			'zip_code'       => $address['zip_code'] ?? '',
			'country_code'   => $address['country_code'] ?? '',
			'timezone'       => $address['timezone'] ?? null,
		);

		// Return 0 if all field is empty
		if ( count( $_address ) === count( array_filter( $_address, function( $value ){ return empty( $value ); } ) ) ) {
			return 0;
		}

		global $wpdb;
		$address_id = $address['address_id'] ?? null;

		if ( ! empty( $address_id ) ) {
			// Update existing address with the ID
			$wpdb->update(
				$wpdb->crewhrm_addresses,
				$_address,
				array( 'address_id' => $address_id )
			);

		} else {
			// Create new address as ID not defined
			$wpdb->insert(
				$wpdb->crewhrm_addresses,
				$_address
			);

			$address_id = $wpdb->insert_id;
		}

		return $address_id;
	}

	/**
	 * Delete address by address ID
	 *
	 * @param int|array $address_id Address ID or array of IDs to delete by
	 *
	 * @return void
	 */
	public static function deleteAddress( $address_id ) {
		$ids        = array_values( _Array::getArray( $address_id, true, 0 ) );
		$ids_places = _String::getPlaceHolders( $ids );

		global $wpdb;
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->crewhrm_addresses} WHERE address_id IN ({$ids_places})",
				...$ids
			)
		);
	}

	/**
	 * Get address by id
	 *
	 * @param int   $address_id ID to get address by
	 * @param mixed $fallback The fallback if address not found
	 * @return array|mixed
	 */
	public static function getAddressById( $address_id, $fallback = null ) {
		global $wpdb;
		$address = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM {$wpdb->crewhrm_addresses} WHERE address_id=%d",
				$address_id
			),
			ARRAY_A
		);

		// Assign time info
		if ( ! empty( $address ) && ! empty( $address['timezone'] ) ) {
			$address = array_merge( $address, Utilities::getTimezoneInfo( $address['timezone'] ) );
		}

		return ! empty( $address ) ? $address : $fallback;
	}

	/**
	 * Get country codes that are connected to published jobs.
	 *
	 * @return array
	 */
	public static function getJobsCountryCodes() {
		global $wpdb;
		return $wpdb->get_col(
			"SELECT 
				DISTINCT address.country_code 
			FROM {$wpdb->crewhrm_addresses} address 
				INNER JOIN {$wpdb->crewhrm_jobs} job ON address.address_id=job.address_id
			WHERE 	
				job.job_status='publish' AND 
				address.country_code IS NOT NULL AND 
				address.country_code!='' 
			ORDER BY address.country_code ASC"
		);
	}
}
