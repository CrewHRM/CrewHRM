<?php

namespace CrewHRM\Setup;

use CrewHRM\Models\Mailer;

class Mails {
	public function __construct() {
		// Send application confirmation. Execute this hook as last as possible.
		add_action( 'crewhrm_job_application_created', array( $this, 'sendApplicationConfirmation' ), 100, 3 );
	}

	/**
	 * Send confirmation email to candidate on job application created
	 *
	 * @param int $application_id Newly created application ID
	 * @param array $application  The application array
	 * @return void
	 */
	public function sendApplicationConfirmation( $application_id, $application ) {

		Mailer::init(
			'application-confirmation',
			function( Mailer $instance ) use( $application ) {

				$args = array(
					'to'      => $application['email'],
					'subject' => __( 'Application received', 'crewhrm' )
				);

				// The dynamic data to apply into static contents
				$dynamics = array(
					'first_name' => $application['first_name']
				);

				error_log( 'Here' );

				$instance->setArgs( $args )->send( $dynamics );
			}
		);
	}
}
