<?php
/**
 * Mail content previewer for developers.
 *
 * @package crewhrm
 */

namespace CrewHRM\Setup;

use CrewHRM\Main;

/**
 * Preview controllers
 */
class MailPreview {

	const PATH = 'crewhrm-mail-preview';

	/**
	 * Previewer register in constructor
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'previewMailTemplate' ) );
	}

	/**
	 * Load mail contents in browser
	 *
	 * @return void
	 */
	public function previewMailTemplate() {
		$url     = ( is_ssl() ? 'https' : 'http' ) . '://' . wp_unslash( $_SERVER['HTTP_HOST'] ?? '' ) . wp_unslash( $_SERVER['REQUEST_URI'] ?? '' ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$parsed  = wp_parse_url( $url );
		$target  = get_home_url() . '/' . self::PATH . '/';
		$current = $parsed['scheme'] . '://' . $parsed['host'] . ( ! empty( $parsed['port'] ) ? ':' . $parsed['port'] : '' ) . ( $parsed['path'] ?? '' );

		if ( $target !== $current ) {
			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			http_response_code( 403 );
			exit( 'Access denied!' );
		}

		$template = preg_replace( '/[^a-zA-Z0-9-]/', '', sanitize_text_field( wp_unslash( $_GET['template'] ?? '' ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$path     = Main::$configs->dir . 'templates/email/event-templates/' . $template . '.php';

		if ( ! file_exists( $path ) ) {
			http_response_code( 404 );
			exit( 'Template not found' );
		}

		ob_start();
		include $path;
		$contents = ob_get_clean();

		include Main::$configs->dir . 'templates/email/layout.php';

		exit;
	}
}
