<?php

namespace CrewHRM\Setup;

use CrewHRM\Main;

class MailPreview {

	const PATH = 'crewhrm-mail-preview';

	public function __construct() {
		add_action( 'init', array( $this, 'previewMailTemplate' ) );
	}

	public function previewMailTemplate() {
		$url     = ( is_ssl() ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
		$parsed  = parse_url( $url );
		$target  = get_home_url() . '/' . self::PATH . '/';
		$current = $parsed['scheme'] . '://' . $parsed['host'] . ( ! empty( $parsed['port'] ) ? ':' . $parsed['port'] : '' ) . ( $parsed['path'] ?? '' );
		
		if ( $target !== $current ) {
			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			http_response_code(403);
			exit( 'Access denied!' );
		}

		$template = preg_replace('/[^a-zA-Z0-9-]/', '', $_GET['template'] ?? '' );
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
