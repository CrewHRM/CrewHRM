<?php
/**
 * Mail content previewer for developers.
 *
 * @package crewhrm
 */

namespace CrewHRM\Controllers;

use CrewHRM\Helpers\_String;
use CrewHRM\Main;

/**
 * Preview controllers
 */
class MailPreview {

	const PREREQUISITES = array(
		'previewDevMail' => array(
			'role' => array( 'administrator' ),
		),
	);

	/**
	 * Load mail contents in browser
	 *
	 * @param array $data Request Data
	 * @return void
	 */
	public static function previewDevMail( array $data ) {

		$template = preg_replace( '/[^a-zA-Z0-9-]/', '', sanitize_text_field( wp_unslash( $data['template'] ?? '' ) ) );
		$path     = Main::$configs->dir . 'templates/email/event-templates/' . $template . '.php';

		if ( ! file_exists( $path ) ) {
			http_response_code( 404 );
			exit( 'Template not found' );
		}

		// Render event template
		ob_start();
		include $path;
		$contents = ob_get_clean();

		// Render final body
		ob_start();
		include Main::$configs->dir . 'templates/email/layout.php';
		$final_body = str_replace( '{contents}', $contents, ob_get_clean() );

		_String::applyKses( $final_body, true );

		exit;
	}
}
