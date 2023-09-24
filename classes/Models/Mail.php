<?php
/**
 * Mail handler
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

/**
 * Mailer class
 */
class Mail {
	/**
	 * Args to send mail
	 *
	 * @var array
	 */
	private $args;

	/**
	 * Mailer constructor
	 *
	 * @param array $args Mail data
	 * @return void
	 */
	public function __construct( array $args ) {
		$this->args = $args;
	}

	/**
	 * Trigger mail sending
	 *
	 * @return bool
	 */
	public function send() {
		$subject = $this->args['subject'] ?? null;
		$body    = $this->args['body'] ?? '';
		$to      = $this->args['to'] ?? '';

		// Attachment array
		$attachments = $this->args['attachments'] ?? array();

		// Mail content type headers
		$headers = array(
			'Content-Type: text/html; charset=UTF-8',
		);

		// Register mailer from address hook
		add_filter( 'wp_mail_from', array( $this, 'get_from_address' ) );

		// Send mail
		$sent = wp_mail( $to, $subject, $body, $headers, $attachments );

		// Remove the hook
		remove_filter( 'wp_mail_from', array( $this, 'get_from_address' ) );

		return $sent;
	}

	/**
	 * Assign custom from address
	 *
	 * @return string
	 */
	public function get_from_address() {
		return $this->args['from_address'] ?? Settings::getRecruiterEmail();
	}
}
