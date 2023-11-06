<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_String;
use CrewHRM\Helpers\File;
use CrewHRM\Main;

class Mailer {
	
	/**
	 * Args to send mail
	 *
	 * @var array
	 */
	private $args;

	/**
	 * The event template/event is working on
	 *
	 * @var string
	 */
	private $event;

	/**
	 * Undocumented function
	 *
	 * @param array $args
	 * @return self
	 */
	public function setArgs( array $args ) {
		$this->args = $args;
		return $this;
	}

	/**
	 * Set the event
	 *
	 * @param string $event
	 * @return self
	 */
	public function setEvent( string $event ) {
		$this->event = $event;
		return $this;
	}

	/**
	 * Check if a specific event enabled or not
	 *
	 * @param string $event The event name
	 * @return boolean
	 */
	public static function isEventEnabled( string $event ) {
		$events = Settings::getSetting( 'outgoing_email_events' );
		error_log( var_export( $events, true ) );
		return is_array( $events ) ? in_array( $event, $events ) : false;
	}

	/**
	 * Undocumented function
	 *
	 * @param string $event
	 * @param callable $callback
	 * @return self
	 */
	public static function init( string $event, callable $callback ) {
		if ( self::isEventEnabled( $event ) ) {
			$callback( ( new self( array() ) )->setEvent( $event ) );
		} else {
			error_log( 'Not enabled ' . $event );
		}
	}

	/**
	 * Trigger mail sending.
	 * Template and event name must be same. 
	 * It means the same name must be used in favor of pointing to each other anywhere.
	 *
	 * @param string $template The event name/template file name to use. 
	 * @param array  $dynamics Dynamic data to apply into static html templates
	 * @return bool
	 */
	public function send( array $dynamics ) {
		
		$subject     = $this->args['subject'] ?? null;
		$to          = $this->args['to'] ?? '';
		$attachments = $this->args['attachments'] ?? array();

		// Mail content type headers
		$headers = array(
			'Content-Type: text/html; charset=UTF-8',
		);

		// Prepare email body
		$body = $this->wrapWithLayout( $this->event, $dynamics );

		if ( empty( $body ) ) {
			trigger_error( 'Could not generate CrewHRM email for ' . $this->event, E_USER_WARNING );
			return false;
		}

		// Register mailer from address hook
		add_filter( 'wp_mail_from', array( $this, 'get_from_address' ) );
		add_filter( 'wp_mail_from_name', array( $this, 'get_from_name' ) );
		add_filter( 'wp_mail_content_type', array( $this, 'get_content_type' ) );

		// Send mail
		$sent = wp_mail( $to, $subject, $body, $headers, $attachments );

		// Remove the hook
		remove_filter( 'wp_mail_from_name', array( $this, 'get_from_name' ) );
		remove_filter( 'wp_mail_from', array( $this, 'get_from_address' ) );
		remove_filter( 'wp_mail_content_type', array( $this, 'get_content_type' ) );

		return $sent;
	}

	public function get_from_name() {
		return $this->args['from_address'] ?? get_bloginfo( 'name' );
	}

	/**
	 * Set content type html
	 *
	 * @return void
	 */
	public function get_content_type() {
		return 'text/html';
	}

	/**
	 * Assign custom from address
	 *
	 * @return string
	 */
	public function get_from_address() {
		return $this->args['from_address'] ?? Settings::getRecruiterEmail();
	}

	/**
	 * Wrap email body with header footer and common layout
	 *
	 * @param string $event The event name to use template based on
	 * @param string $body The body to wrap
	 * @return string
	 */
	private function wrapWithLayout( string $template, array $dynamics ) {

		$mail_templates = File::getFilesInDirectory( Main::$configs->dir . 'templates/email/event-templates/' );
		$mail_templates = apply_filters( 'crewhrm_email_templates', $mail_templates );
		
		if ( empty( $mail_templates[ $template ] ) ) {
			trigger_error( 'Email template not found:' . $template, E_USER_WARNING );
			return false;
		}

		// Enclose parameters with brackets to search
		$finds = array_keys( $dynamics );
		$finds = array_map(
			function( $find ) {
				return '{' . $find . '}';
			},
			$finds
		);

		// Get data to replace
		$replaces = array_values( $dynamics );
		
		// Replace parameters in the template
		ob_start();
		include $mail_templates[ $template ];
		$contents = ob_get_clean();
		$contents = str_replace( $finds, $replaces, $contents );
		
		// Note: This $contents variable is used in the file included below.

		ob_start();
		require Main::$configs->dir . 'templates/email/layout.php';
		return ob_get_clean();
	}
}
