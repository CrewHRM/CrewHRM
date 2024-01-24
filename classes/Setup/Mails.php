<?php
/**
 * Mailing events setup
 *
 * @package crewhrm
 */

namespace CrewHRM\Setup;

use CrewHRM\Main;
use CrewHRM\Models\Mailer;
use CrewHRM\Models\Settings;

/**
 * Setup class
 */
class Mails {
	/**
	 * Register the events for free version
	 */
	public function __construct() {
		// Send application confirmation. Execute this hook as last as possible.
		add_action( 'crewhrm_job_application_created', array( $this, 'sendApplicationConfirmation' ), 100, 3 );

		if ( 'development' === Main::$configs->mode ) {
			add_filter( 'crewhrm_frontend_data', array( $this, 'provideMailPreviewURL' ) );
		}
	}

	/**
	 * Provide dynamic URL to mail preview only in development mode
	 *
	 * @param array $data
	 * @return array
	 */
	public function provideMailPreviewURL( array $data ) {
		$data['mail_preview_url'] = Mailer::getPreviewURL( $data['nonce'], $data['nonce_action'] );
		return $data;
	}

	/**
	 * Send confirmation email to candidate on job application created
	 *
	 * @param int   $application_id Newly created application ID
	 * @param array $application    The application array
	 * @return void
	 */
	public function sendApplicationConfirmation( $application_id, $application ) {

		Mailer::init(
			'application-confirmation',
			function( Mailer $mailer ) use ( $application ) {

				$args = array(
					'to'      => $application['email'],
					'subject' => esc_html__( 'Application received', 'hr-management' ),
				);

				// The dynamic data to apply into static contents
				$dynamics = array(
					'candidate_name' => $application['first_name'],
					'company_name'   => Settings::getSetting( 'company_name', '' ),
					'primary_email'  => Settings::getRecruiterEmail(),
				);

				$mailer->setArgs( $args )->send( $dynamics );
			}
		);
	}
}
