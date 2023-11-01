<?php
namespace CrewHRM\Updater;

use stdClass;

/**
 * This is a unified class for custom WordPress themes and plugins update. 
 */
class Updater {
	private $main_file_path;
	private $license_page_parent;
	private $product_name;
	private $product_title;
	private $product_basename;
	private $url_slug;
	private $update_hook_prefix;
	private $is_plugin;
	private $product_version;
	private $product_slug;
	private $license_option_key;
	private $activate_action;
	private $activate_nonce;
	private $api_endpoint;
	public  $license;
	private $purchase_link; // To be used in form file

	/**
	 * Updater constructor
	 *
	 * @param array $config
	 */
	function __construct( array $configs ) {
		// Arguments
		$this->main_file_path      = $configs['main_file'];
		$this->product_name        = $configs['product_name'];
		$this->product_title       = $configs['product_title'];
		$this->product_version     = $configs['current_version'];
		$this->product_basename    = $configs['basename'];
		$this->api_endpoint        = $configs['api_endpoint'];
		$this->license_page_parent = $configs['root_menu_slug'] ?? null;
		$this->purchase_link       = $configs['purchase_link'] ?? null;
		$this->update_hook_prefix  = ( $configs['continuous_update_check'] ?? false ) ? '' : 'pre_set_';

		// Determine URL to this updater page
		$this->is_plugin          = strpos( str_replace( '\\', '/', $this->main_file_path ) , 'wp-content/plugins' );
		$sep                      = $this->is_plugin ? '/wp-content/plugins/' : '/wp-content/themes/';
		$updater_full_path        = str_replace( '\\', '/', __DIR__ );
		$updater_rel_path         = substr( $updater_full_path, strpos( $updater_full_path, $sep ) + strlen( $sep ) ) . '/';
		$this->product_slug       = substr( $updater_rel_path, 0, strpos( $updater_rel_path, '/' ) );
		$this->url_slug           = "{$this->product_slug}-license-setup";
		$this->license_option_key = "{$this->product_slug}-license-data";
		$this->activate_action    = 'activate_license_key_' . $this->product_slug;
		$this->activate_nonce     = 'activate_license_key_nonce_' . $this->product_slug;

		// Register license page hooks if parent page slug defined, it means the content is not free and requires license activation to get updates. 
		if ( $this->license_page_parent ) {
			add_action( 'admin_menu', array( $this, 'add_license_page' ), 20 );
			add_action( 'admin_notices', array( $this, 'show_inactive_license_notice' ) );
			add_action( 'wp_ajax_' . $this->activate_action, array( $this, 'license_key_submit' ) );
		}

		// Register plugin and theme api request hooks
		if ( $this->is_plugin ) {
			add_filter( 'plugins_api', array( $this, 'plugin_info' ), 20, 3 );
			add_filter( $this->update_hook_prefix . 'site_transient_update_plugins', array( $this, 'check_for_update' ) );
		} else {
			add_filter( $this->update_hook_prefix . 'site_transient_update_themes', array( $this, 'check_for_update' ) );
		}
	}

	/**
	 * Add license key submission as a sub menu under defined parent.
	 *
	 * @return void
	 */
	public function add_license_page() {
		add_submenu_page(
			$this->license_page_parent,
			$this->product_title . ' License', 
			__( 'License' ), 
			'manage_options', 
			$this->url_slug, 
			array( $this, 'license_form' ) 
		);
	}

	/**
	 * License key submission page html contents
	 *
	 * @return void
	 */
	public function license_form() {
		// Refresh license state before page load
		$this->APICall();

		// Load the form now
		include __DIR__ . '/license-form.php';
	}

	/**
	 * Return prepared request
	 *
	 * @param string|null $action
	 * @return object|null
	 */
	private function APICall( $action = null, $license_key = null ) {
		if ( ! $license_key ) {
			$license_info = $this->get_license();
			$license_key  = is_array( $license_info ) ? ( $license_info['license_key'] ?? '' ) : '';
		}

		$payload =  array(
			'license_key'  => $license_key,
			'endpoint'     => get_home_url(),
			'product_name' => $this->product_name,
			'action'       => $action ?? ( $this->license_page_parent ? 'update-check' : 'update-check-free' ),
		);

		$request = wp_remote_post( $this->api_endpoint, array( 'body' => $payload ) );
		$response = ( ! is_wp_error( $request ) && is_array( $request ) ) ? @json_decode( $request['body'] ?? null ) : null;

		// Set fall back
		$response          = is_object( $response ) ? $response : new stdClass();
		$response->success = $response->success ?? false;
		$response->data    = $response->data ?? new stdClass();

		error_log( var_export( $response, true ) );
		
		// Deactivate key if any request send falsy
		if ( $response && isset( $response->data->activated ) && $response->data->activated === false ) {
			update_option(
				$this->license_option_key, 
				array( 
					'activated'   => false, 
					'license_key' => $license_key,
					'message'     => __( 'The license key is expired or revoked!' ) 
				) 
			);
		}

		return $response;
	}

	/**
	 * Activate license key on submit
	 *
	 * @return void
	 */
	public function license_key_submit() {

		if ( ! isset( $_POST['nonce'], $_POST['product_title'], $_POST[ 'license_key' ] ) || $_POST['product_title'] !== $this->product_name || empty( $_POST[ 'license_key' ] ) ) {
			wp_send_json_error( array( 'message' => __( 'Invalid data!', 'crewhrm-pro') ) );
			exit;
		}

		if ( ! wp_verify_nonce( $_POST['nonce'], $this->activate_nonce ) ) {
			wp_send_json_error( array( 'message' => __( 'Session expired! Reload the page and try again please.', 'crewhrm-pro' ) ) );
			exit;
		}
			
		$license_key = wp_unslash( $_POST[ 'license_key' ] );
		$response    = $this->APICall( 'activate-license', $license_key );

		if ( $response->success ) {
			$license_info = array(
				'license_key' => $license_key,
				'activated'   => $response->data->activated ? true : false,
				'licensee'    => $response->data->licensee ?? null,
				'expires_on'  => $response->data->expires_on ?? null,
				'plan_name'   => $response->data->plan_name ?? null,
				'message'     => $response->data->message ?? null,
			);

			update_option($this->license_option_key, $license_info);
			wp_send_json_success( array( 'message' => $license_info['message'] ) );
		} else {
			error_log( var_export( $response, true ) );
			wp_send_json_error(
				array(
					'message' => $response->data->message ?? __( 'Request error! The license key is not correct or could not connect to the validator server.', 'crewhrm-pro' )
				)
			);
		}

		exit;
	}

	/**
	 * @param $res
	 * @param $action
	 * @param $args
	 *
	 * @return bool|\stdClass
	 *
	 * Get the plugin info from server
	 */
	function plugin_info( $res, $action, $args ) {

		// do nothing if this is not about getting plugin information and not about this content.
		if ( $action !== 'plugin_information' || ( $this->product_slug !== $args->slug && $this->product_basename !== $args->slug ) ) {
			return false;
		}

		$remote       = $this->APICall();
		$res          = new \stdClass();
		$res->slug    = $this->product_slug;
		$res->name    = $this->product_title;
		$res->version = $this->product_version;
		
		if ( $remote->success ) {
			$res->version      = $remote->data->version;
			$res->last_updated = date_format( date_create( '@' . $remote->data->release_timestamp ), "Y-m-d H:i:s" );
			$res->sections     = array(
				'changelog' => nl2br( $remote->data->changelog ),
			);
		}
		
		return $res;
	}

	/**
	 * @param $transient
	 *
	 * @return mixed
	 */
	public function check_for_update( $transient ) {
		$update_info = null;
		$request_body = $this->APICall();
		if ( $request_body->success && version_compare( $this->product_version, $request_body->data->version, '<' ) ) {
			$update_info = array(
				'new_version'   => $request_body->data->version,
				'package'       => $request_body->data->download_url,
				'slug'          => $this->product_basename,
				'url'           => $request_body->data->product_permalink,
			);
		}

		// Now update this content data in the transient
		$transient->response[ $this->product_basename ] = $update_info ? ( $this->is_plugin ? (object)$update_info : $update_info ) : null;

		return $transient;
	}

	/**
	 * Show license notice at the top if no key assigned or assigned on not valid anymore
	 *
	 * @return void
	 */
	public function show_inactive_license_notice() {
		$license = $this->get_license();
		if ( ! is_array( $license ) || $license['activated'] ?? false ) {
			return;
		}

		$class = 'notice notice-error';
		$message = sprintf(
			__('There is an error with your %s License. Automatic update has been turned off, %s Please check license %s.', $this->url_slug), 
			$this->product_title, 
			" <a href='" . admin_url( 'admin.php?page=' . $this->url_slug ) . "'>", 
			'</a>'
		);

		printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr($class), $message);
	}

	/**
	 * Get saved license
	 *
	 * @return void
	 */
	private function get_license() {
		// Get from option. Not submitted yet if it is empty.
		$license_option = get_option( $this->license_option_key, null );
		if ( empty( $license_option ) ) {
			return null;
		}

		// Unsrialize the license info
		$license = maybe_unserialize( $license_option );
		$license = is_array( $license ) ? $license : array();

		$keys = array(
			'activated',
			'license_key',
			'licensee',
			'expires_on',
			'plan_name',
			'message'
		);

		foreach ( $keys as $key ) {
			$license[ $key ] = ! empty( $license[ $key ] ) ? $license[ $key ] : null;
		}

		return $license;
	}
}
