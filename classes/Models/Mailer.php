<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;
use CrewHRM\Helpers\_String;
use CrewHRM\Helpers\File;
use CrewHRM\Main;

class Mailer {
	
	/**
	 * Args to send mail
	 *
	 * @var array
	 */
	public $args;

	/**
	 * The event template/event is working on
	 *
	 * @var string
	 */
	public $event;

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
	 * Check if the event is enabled, and then execute handler.
	 *
	 * @param string|array $event_s Event or array of events for the templates with same variables. 
	 * @param callable $callback
	 * @return self
	 */
	public static function init( $event_s, callable $callback ) {
		if ( ! is_array( $event_s ) ) {
			$event_s = array( $event_s );
		}

		$enabled_events  = Settings::getSetting( 'outgoing_email_events' );

		foreach ( $event_s as $event ) {
			$is_enabled = is_array( $enabled_events ) ? in_array( $event, $enabled_events ) : false;

			if ( $is_enabled ) {
				$callback( ( new self( array() ) )->setEvent( $event ) );
			}
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
		
		$subject     = $this->applyDynamics( $this->args['subject'] ?? '', $dynamics, $this->event );
		$to          = $this->args['to'] ?? '';
		$attachments = $this->args['attachments'] ?? array();
		$body        = $this->wrapWithLayout( $this->event, $dynamics );
		$headers     = array(
			'Content-Type: text/html; charset=UTF-8',
		);

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
		return $this->args['from_name'] ?? get_bloginfo( 'name' );
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
	 * Get available email templates registered at run time.
	 *
	 * @return array
	 */
	public static function getMailTemplates( $add_path = false ) {
		$templates = File::getFilesInDirectory( Main::$configs->dir . 'templates/email/event-templates/' );

		$templates = apply_filters( 'crewhrm_email_templates', $templates );
		
		$mail_templates = array();
		foreach ( $templates as $filename => $path ) {
			
			$meta = _Array::getManifestArray( $path, ARRAY_A );	
			
			$mail_templates[ $filename ] = array(
				'id'                    => $filename,
				'label'                 => $meta['template_label'] ?? 'Untitled',
				'exclude_from_settings' => $meta['exclude_from_settings'] ?? false,
				'path'                  => $add_path ? $path : null
			);
		}

		return $mail_templates;
	}

	/**
	 * Wrap email body with header footer and common layout
	 *
	 * @param string $event The event name to use template based on
	 * @param string $body The body to wrap
	 * @return string
	 */
	private function wrapWithLayout( string $template, array $dynamics ) {

		$mail_templates = self::getMailTemplates( true );
		
		if ( empty( $mail_templates[ $template ] ) ) {
			trigger_error( 'Email template not found:' . $template, E_USER_WARNING );
			return false;
		}
		
		// Replace parameters in the template
		ob_start();
		include $mail_templates[ $template ]['path'];

		$contents = ob_get_clean();
		$contents = apply_filters( 'crewhrm_email_content_before_dynamics', $contents, $template, $dynamics );

		$contents = $this->applyDynamics( $contents, $dynamics, $template );
		$contents = apply_filters( 'crewhrm_email_content_after_dynamics', $contents, $template, $dynamics );
		
		// Note: This $contents variable is used in the file included below.

		ob_start();
		require Main::$configs->dir . 'templates/email/layout.php';
		return apply_filters( 'crewhrm_email_content_final', ob_get_clean(), $template, $dynamics );
	}

	/**
	 * Apply dynamic variables in static string
	 *
	 * @param string $contents
	 * @param array $dynamics
	 * @param array $event
	 * @return string
	 */
	private function applyDynamics( string $contents, array $dynamics, string $event ) {

		$dynamics = apply_filters( 'crewhrm_email_dynamics', $dynamics, $event );
		$finds    = array_keys( $dynamics );
		$finds    = array_map(
			function( $find ) {
				return '{' . $find . '}';
			},
			$finds
		);

		// Get data to replace
		$replaces = array_values( $dynamics );

		return str_replace( $finds, $replaces, $contents );
	}
}
