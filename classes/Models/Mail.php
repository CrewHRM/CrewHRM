<?php

namespace CrewHRM\Models;

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
	 * @param array $args
	 */
	public function __construct( array $args ) {
		$this->args = $args;
	}
	
	/**
	 * Trigger mail sending
	 *
	 * @return void
	 */
	public function send() {
		$subject = $this->args['subject'] ?? null;
		$body    = $this->args['body'] ?? '';
		$to      = $this->args['to'] ?? '';
		$header  = 'Content-Type: text/html' . "\r\n";

		// Register mailer from address hook
		add_filter( 'wp_mail_from', array( $this, 'get_from_address' ) );

		// Send mail
		$sent = wp_mail( $to, $subject, $body, $header);

		// Remove the hook
		remove_filter( 'wp_mail_from', array( $this, 'get_from_address' ) );

		return $sent;
	}

	/**
	 * Assign custom from address
	 *
	 * @return string
	 */
	public function get_from_address(){
		return $this->args['from_address'] ?? Settings::getRecruiterEmail();
	}
}
