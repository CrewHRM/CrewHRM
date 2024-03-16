<?php
/**
 * Mail content previewer for developers.
 *
 * @package crewhrm
 */

namespace CrewHRM\Controllers;

use CrewHRM\Main;
use CrewHRM\Models\Mailer;

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
	 * Load mail contents in browser, for development only.
	 * e.g http://localhost:10043/wp-admin/admin-ajax.php?action=crewhrm_previewDevMail&nonce=1d27b5027b&nonce_action=_crewhrm_2024_03_16
	 * Get the nonce and action from crewmat object in browser console and replace in the URL when you test.
	 * 
	 * @param string $template The mail template to preview
	 * @return void
	 */
	public static function previewDevMail( string $nonce, string $nonce_action, string $template = '' ) {

		if ( 'development' !== Main::$configs->mode ) {
			return;
		}

		// Remove unwanted charecters from template name
		$template  = preg_replace( '/[^a-zA-Z0-9-]/', '', $template );
		$templates = Mailer::getMailTemplates( true );

		if ( empty( $template ) ) {
			foreach ( $templates as $id => $templ ) {
				$link = Mailer::getPreviewURL( $nonce, $nonce_action, $id );
				?>
					<a href="<?php echo esc_url( $link ); ?>">
						<?php echo esc_html( $id ); ?>
					</a>
					<br/>
				<?php
			}
			exit;
		}

		if ( empty( $templates[ $template ] ) ) {
			exit( esc_html__( 'The email template was not found to preview', 'crewhrm' ) );
		}

		$path = $templates[ $template ]['path'];

		if ( ! file_exists( $path ) ) {
			http_response_code( 404 );
			exit( esc_html__( 'Template file not found', 'crewhrm' ) );
		}

		// Render event template
		ob_start();
		include $path;
		$contents = ob_get_clean();

		// Render final body
		ob_start();
		include Main::$configs->dir . 'templates/email/layout.php';
		$final_body = str_replace( '{contents}', $contents, ob_get_clean() );

		echo $final_body;

		exit;
	}
}
