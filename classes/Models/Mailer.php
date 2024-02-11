<?php
/**
 * Mailer functionalities wrapper
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;
use CrewHRM\Helpers\_String;
use CrewHRM\Helpers\File;
use CrewHRM\Main;

/**
 * Mailing class and methods
 */
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
	 * @param array $args Mailing args, especially to and subject.
	 * @return self
	 */
	public function setArgs( array $args ) {
		$this->args = $args;
		return $this;
	}

	/**
	 * Set the event
	 *
	 * @param string $event Event name to send mail for
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
	 * @param callable     $callback Callback function to be called if the event is enabled
	 * @return void
	 */
	public static function init( $event_s, callable $callback ) {
		if ( ! is_array( $event_s ) ) {
			$event_s = array( $event_s );
		}

		$enabled_events = Settings::getSetting( 'outgoing_email_events' );

		foreach ( $event_s as $event ) {
			$is_enabled = is_array( $enabled_events ) ? in_array( $event, $enabled_events, true ) : false;

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
	 * @param array $dynamics Dynamic data to apply into static html templates
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

	/**
	 * Get email 'from name'
	 *
	 * @return string
	 */
	public function get_from_name() {
		return $this->args['from_name'] ?? get_bloginfo( 'name' );
	}

	/**
	 * Set content type html
	 *
	 * @return string
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
	 * @param bool $add_path Whether to add path or not
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
				'path'                  => $add_path ? $path : null,
			);
		}

		return $mail_templates;
	}

	/**
	 * Generate preview URL for templates
	 *
	 * @param string $template
	 * @param string $nonce
	 * @param string $nonce_action
	 *
	 * @return string
	 */
	public static function getPreviewURL( string $nonce, string $nonce_action, $template = '' ) {
		return add_query_arg(
			array(
				'nonce'        => $nonce,
				'nonce_action' => $nonce_action,
				'action'       => Main::$configs->app_name . '_previewDevMail',
				'template'     => $template,
			),
			admin_url( 'admin-ajax.php' )
		);
	}

	/**
	 * Wrap email body with header footer and common layout
	 *
	 * @param string $template The template name to use for the event. In fact template and event name are same always.
	 * @param array  $dynamics Dynamic values to apply to the template
	 * @return string
	 */
	private function wrapWithLayout( string $template, array $dynamics ) {

		$mail_templates = self::getMailTemplates( true );

		if ( empty( $mail_templates[ $template ] ) ) {
			return false;
		}

		// Replace parameters in the template
		ob_start();
		include $mail_templates[ $template ]['path'];

		$contents = ob_get_clean();
		$contents = apply_filters( 'crewhrm_email_content_before_dynamics', $contents, $template, $dynamics );

		$contents = $this->applyDynamics( $contents, $dynamics, $template );
		$contents = apply_filters( 'crewhrm_email_content_after_dynamics', $contents, $template, $dynamics );

		// Wrap the content with comman layout template
		ob_start();
		require Main::$configs->dir . 'templates/email/layout.php';
		$final_body = str_replace( '{contents}', $contents, ob_get_clean() );
		return apply_filters( 'crewhrm_email_content_final', $final_body, $template, $dynamics );
	}

	/**
	 * Apply dynamic variables in static string
	 *
	 * @param string $contents HTML contents with variable placeholders
	 * @param array  $dynamics Key value paired dynamic values array
	 * @param string $event The event/template name to apply dynamic data to
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
