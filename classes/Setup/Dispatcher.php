<?php
/**
 * The dispatcher where all the CrewHRM ajax request pass through after validation
 *
 * @package crewhrm
 */

namespace CrewHRM\Setup;

use CrewHRM\Controllers\AddonController;
use CrewHRM\Controllers\ApplicationHandler;
use CrewHRM\Controllers\EmployeeController;
use CrewHRM\Main;
use CrewHRM\Models\User;

use CrewHRM\Controllers\JobManagement;
use CrewHRM\Controllers\MailPreview;
use CrewHRM\Controllers\MediaHandler;
use CrewHRM\Controllers\PluginSettings;
use CrewHRM\Helpers\_Array;
use Error;

/**
 * Dispatcher class
 */
class Dispatcher {
	/**
	 * Controlles class array
	 *
	 * @var array
	 */
	private static $controllers = array(
		AddonController::class,
		PluginSettings::class,
		JobManagement::class,
		ApplicationHandler::class,
		MediaHandler::class,
		MailPreview::class,
		EmployeeController::class,
	);

	/**
	 * Dispatcher registration in constructor
	 *
	 * @return void
	 */
	public function __construct() {
		// Register ajax handlers only if it is ajax call
		if ( ! wp_doing_ajax() ) {
			return;
		}

		add_action( 'plugins_loaded', array( $this, 'registerControllers' ), 11 );
	}

	/**
	 * Register ajax request handlers
	 *
	 * @throws Error If there is any duplicate ajax handler across controllers.
	 * @return void
	 */
	public function registerControllers() {

		$registered_methods = array();
		$controllers        = apply_filters( 'crewhrm_controllers', self::$controllers );

		// Loop through controllers classes
		foreach ( $controllers as $class ) {

			// Loop through controller methods in the class
			foreach ( $class::PREREQUISITES as $method => $prerequisites ) {
				if ( in_array( $method, $registered_methods, true ) ) {
					// translators: Show the duplicate registered endpoint
					throw new Error( sprintf( esc_html__( 'Duplicate endpoint %s not possible', 'hr-management' ), esc_html( $method ) ) );
				}

				// Determine ajax handler types
				$handlers    = array();
				$handlers [] = 'wp_ajax_' . Main::$configs->app_name . '_' . $method;

				// Check if norpriv necessary
				if ( ( $prerequisites['nopriv'] ?? false ) === true ) {
					$handlers[] = 'wp_ajax_nopriv_' . Main::$configs->app_name . '_' . $method;
				}

				// Loop through the handlers and register
				foreach ( $handlers as $handler ) {
					add_action(
						$handler,
						function() use ( $class, $method, $prerequisites ) {
							$this->dispatch( $class, $method, $prerequisites );
						}
					);
				}

				$registered_methods[] = $method;
			}
		}
	}

	/**
	 * Dispatch request to target handler after doing verifications
	 *
	 * @param string $class         The class to dispatch the request to
	 * @param string $method        The method of the class to invoke
	 * @param array  $prerequisites Controller access prerequisites
	 *
	 * @return void
	 */
	public function dispatch( $class, $method, $prerequisites ) {

		// Nonce verification
		$matched = wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) ), sanitize_text_field( wp_unslash( $_POST['nonce_action'] ?? '' ) ) );
		$matched = $matched || wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['nonce'] ?? '' ) ), sanitize_text_field( wp_unslash( $_GET['nonce_action'] ?? '' ) ) );
		if ( ! $matched ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Nonce verification failed!', 'hr-management' ) ) );
		}

		// Validate access privilege
		$required_roles = $prerequisites['role'] ?? array();
		$required_roles = is_array( $required_roles ) ? $required_roles : array( $required_roles );
		$required_roles = apply_filters( 'crewhrm_hr_roles', $required_roles );
		if ( ! User::validateRole( get_current_user_id(), $required_roles ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Access Denied!', 'hr-management' ) ) );
		}

		// Now pass to the action handler function
		if ( ! class_exists( $class ) || ! method_exists( $class, $method ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Invalid Endpoint!', 'hr-management' ) ) );
		}

		// Prepare request data
		$is_post = strtolower( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_METHOD'] ?? '' ) ) ) === 'post';
		$params  = _Array::getMethodParams( $class, $method );

		// Pick only the used arguments in the mathod from request data
		$args = array();
		foreach ( $params as $param => $configs ) {
			$args[ $param ] = wp_unslash( ( $is_post ? ( $_POST[ $param ] ?? null ) : ( $_GET[ $param ] ?? null ) ) ?? $_FILES[ $param ] ?? $configs['default'] ?? null );
		}

		// Sanitize and type cast
		$args = _Array::sanitizeRecursive( $args );

		// Now verify all the arguments expected data types after casting
		foreach ( $args as $name => $value ) {

			// The request data value
			$arg_type = gettype( $value );

			// The accepted type by the method
			$param_type = $params[ $name ]['type'];

			// Check if request data type and accepted type matched
			if ( $arg_type != $param_type ) {

				// If not matched, however accpets string but passed in, then convert the into to string and pass to the method.
				// Because so far there's a senario where single job view page can pass both job ID or slug collected from URL.
				// And in fact there's no issue to treat a numeric value as string in this plugin so far.
				if ( 'string' === $param_type && 'integer' === $arg_type ) {
					$args[ $name ] = (string) $value;
				} else {
					wp_send_json_error( array( 'message' => esc_html__( 'Invalid request data!', 'hr-management' ) ) );
				}
			}
		}

		// Then pass to method with spread as the parameter count is variable.
		$args = array_values( $args );
		$class::$method( ...$args );
	}
}
