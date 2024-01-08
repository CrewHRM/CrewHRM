<?php
/**
 * Media handler
 *
 * @package crewhrm
 */

namespace CrewHRM\Controllers;

/**
 * Media controller
 */
class MediaHandler {
	const PREREQUISITES = array(
		'loadFile' => array(
			'role' => array( 'administrator' ), // For now only administrator as only they need to review applications. Need to update later as per situation.
		),
	);

	/**
	 * Load file
	 *
	 * @param array $data Request data
	 * @return void
	 */
	public static function loadFile( array $data ) {
		$file_id = $data['file_id'] ?? 0;
		$path    = get_attached_file( $file_id );

		if ( empty( $path ) || ! is_readable( $path ) ) {
			http_response_code( 404 );
			exit;
		}

		$mime_type = mime_content_type( $path );
		$file_size = filesize( $path );

		nocache_headers();
		header( 'Content-Type: ' . $mime_type . '; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename=' . basename( $path ) );
		header( 'Content-Length: ' . $file_size );
		header( 'Pragma: no-cache' );
		header( 'Expires: 0' );
		readfile( $path );
		exit;
	}
}
