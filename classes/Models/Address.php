<?php

namespace CrewHRM\Models;

class Address {
	/**
	 * Create or update an address
	 *
	 * @param array $address Address array consisting street_address, city, province, zip_code country_code etc.
	 * @return int Address ID
	 */
	public static function createUpdateAddress( array $address ) {
		$_address = array(
			'street_address' => $address['street_address'] ?? '',
			'city'           => $address['city'] ?? '',
			'province'       => $address['province'] ?? '',
			'zip_code'       => $address['zip_code'] ?? '',
			'country_code'   => $address['country_code'] ?? '',
			'timezone'       => $address['timezone'] ?? null,
			'date_format'    => $address['date_format'] ?? 'Y-m-d',
			'time_format'    => $address['time_format'] ?? 24
		);

		global $wpdb;
		$address_id = $address['address_id'] ?? null;

		if ( ! empty( $address_id ) ) {
			// Update existing address with the ID
			$wpdb->update(
				DB::addresses(),
				$_address,
				array( 'address_id' => $address_id )
			);

		} else {
			// Create new address as ID not defined
			$wpdb->insert(
				DB::addresses(),
				$_address
			);

			$address_id = $wpdb->insert_id;
		}

		return $address_id;
	}

	/**
	 * Delete address by address ID
	 *
	 * @param int $address_id
	 * @return void
	 */
	public static function deleteAddress( $address_id ) {
		$ids    = is_array( $address_id ) ? $address_id : array( $address_id );
		$ids_in = implode( ',', $ids );

		global $wpdb;
		$wpdb->query(
			"DELETE FROM " . DB::addresses() . " WHERE address_id IN({$ids_in})"
		);
	}

	/**
	 * Get address by id
	 *
	 * @param int $address_id
	 * @return array|null
	 */
	public static function getAddressById( $address_id ) {
		global $wpdb;
		$address = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM " . DB::addresses() . " WHERE address_id=%d",
				$address_id
			),
			ARRAY_A
		);

		return empty( $address ) ? null : $address;
	}
}