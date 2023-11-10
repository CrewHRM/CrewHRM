<?php

namespace CrewHRM\Setup;

use CrewHRM\Models\Mailer;
use CrewHRM\Models\Settings;

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
			function( Mailer $mailer ) use( $application ) {

				$args = array(
					'to'           => $application['email'],
					'subject'      => __( 'Application received', 'crewhrm' ),
				);

				// The dynamic data to apply into static contents
				$dynamics = array(
					'candidate_name' => "{$application['first_name']} {$application['last_name']}",
					'company_name'   => Settings::getSetting( 'company_name', '' ),
					'primary_email'  => Settings::getRecruiterEmail()
				);

				$mailer->setArgs( $args )->send( $dynamics );
			}
		);
	}
}
