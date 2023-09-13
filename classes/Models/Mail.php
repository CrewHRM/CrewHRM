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
		$subject         = $this->args['subject'] ?? null;
		$body            = $this->args['body'] ?? '';
		$to              = $this->args['to'] ?? '';
		$attachment_path = $this->args['attachment_path'] ?? null;
        $boundary        = md5(time());
		$headers         = array(
			'Content-Type: text/html; charset=UTF-8',
		);

        // Create the message body
        $message_body = "--$boundary\r\n";
        $message_body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $message_body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $message_body .= $body . "\r\n\r\n";

		if ( ! empty( $attachment_path ) ) {
			// Read the attachment file and encode it
			$file_content = file_get_contents($attachment_path);
			$file_encoded = base64_encode($file_content);

			// Add attachment to the message
			$message_body .= "--$boundary\r\n";
			$message_body .= "Content-Type: application/octet-stream; name=\"" . $_FILES['attachment']['name'] . "\"\r\n";
			$message_body .= "Content-Transfer-Encoding: base64\r\n";
			$message_body .= "Content-Disposition: attachment; filename=\"" . $_FILES['attachment']['name'] . "\"\r\n\r\n";
			$message_body .= chunk_split($file_encoded) . "\r\n";
		}
        
		// Register mailer from address hook
		add_filter( 'wp_mail_from', array( $this, 'get_from_address' ) );

		// Send mail
		$sent = wp_mail( $to, $subject, $message_body, $headers );

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
