<?php
/**
 * Third party integrations credential management
 *
 * @package crewhrm
 */

namespace CrewHRM\Helpers;

/**
 * Credential manager class
 */
class Credential {
	/**
	 * Option name to store credential
	 *
	 * @var string
	 */
	private $cred_name;

	/**
	 * The department ID to do operations for
	 *
	 * @var int
	 */
	private $department_id;

	/**
	 * Credential index
	 *
	 * @var int
	 */
	private $cred_index = null;

	/**
	 * Credential manager constructor
	 *
	 * @param string  $cred_name The unique name to CRUD values by
	 * @param integer $department_id The department ID to store credentials for. 0 means global. For now no department specific features BTW. So always 0.
	 */
	public function __construct( $cred_name, $department_id ) {
		$this->cred_name     = $cred_name;
		$this->department_id = $department_id;
	}

	/**
	 * Instance for meet
	 *
	 * @param integer $department_id The department ID to store credential for
	 * @return self
	 */
	public static function meet( $department_id = 0 ) {
		return new self( 'crewhrm-google-meet-credentials', $department_id );
	}

	/**
	 * Instance for zoom
	 *
	 * @param integer $department_id The department ID to store zoom credentials to
	 * @return self
	 */
	public static function zoom( $department_id = 0 ) {
		return new self( 'crewhrm-zoom-credentials', $department_id );
	}

	/**
	 * Instance for recaptcha credential
	 *
	 * @param integer $department_id The department ID to store zoom credentials to
	 * @return self
	 */
	public static function recaptcha( $department_id = 0 ) {
		return new self( 'crewhrm-recaptcha-credentials', $department_id );
	}

	/**
	 * Set index to get specific credential
	 *
	 * @param int $index The credential index to do operations on
	 * @return self
	 */
	public function setIndex( $index ) {
		$this->cred_index = $index;
		return $this;
	}

	/**
	 * Get all saved credentials of the department
	 *
	 * @param bool $get_entire Whether to get single department of entire.
	 * @return array
	 */
	private function getCredentials( $get_entire = false ) {

		$credentials = get_option( $this->cred_name );
		$fallback    = array( array() );

		// Set empty fallback that means not set
		if ( empty( $credentials ) || ! is_array( $credentials ) ) {
			$credentials = array(
				$this->department_id => $fallback,
			);
		}

		return $get_entire ? $credentials : array_values( $credentials[ $this->department_id ] ?? $fallback );
	}

	/**
	 * Modify credential/token in the last one and update whole
	 *
	 * @param string       $name The credential name
	 * @param string|array $value And credential value
	 * @return void
	 */
	public function addValue( $name, $value ) {
		$credentials                         = $this->getCredentials();
		$last_index                          = count( $credentials ) - 1;
		$credentials[ $last_index ][ $name ] = $value;

		$this->saveCredentials( $credentials );
	}

	/**
	 * Update credentials for a single department in the whole array and save
	 *
	 * @param array $credentials The credential
	 * @return void
	 */
	private function saveCredentials( $credentials ) {
		$credentials_entire                         = $this->getCredentials( true );
		$credentials_entire[ $this->department_id ] = $credentials;
		update_option( $this->cred_name, $credentials_entire );
	}

	/**
	 * Add empty array at the last
	 *
	 * @return void
	 */
	public function deleteCredential() {
		$credentials = $this->getCredentials();
		$last_index  = count( $credentials ) - 1;

		if ( ! empty( $credentials[ $last_index ] ?? null ) ) {
			$credentials[] = array();
			$this->saveCredentials( $credentials );
		}
	}

	/**
	 * Get latest or specific credential to interact with API
	 *
	 * @param string $key Credential key to get by
	 * @return array
	 */
	public function getCredential( $key = null ) {
		$credentials = $this->getCredentials();
		$pointer     = null === $this->cred_index ? count( $credentials ) - 1 : $this->cred_index;
		$latest      = $credentials[ $pointer ] ?? array();

		return $key ? ( $latest[ $key ] ?? null ) : $latest;
	}

	/**
	 * Get latest index especially to create meeting
	 *
	 * @return int
	 */
	public function getCurrentIndex() {
		return count( $this->getCredentials() ) - 1;
	}
}
