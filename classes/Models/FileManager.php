<?php

namespace CrewHRM\Models;

class FileManager {

	/**
	 * CrewHRM identifier meta key
	 *
	 * @var string
	 */
	public static $crewhrm_meta_key = 'crewhrm_application_file';

	/**
	 * Specify where to store files
	 *
	 * @var string
	 */
	public static $custom_dir = 'crewhrm-application-files';

	/**
	 * Replacable file id to make available in upload_dir hook callback
	 *
	 * @var int
	 */
	public static $content_id = 0;

	/**
	 * Alter upload directory by hook
	 *
	 * @param string $upload
	 * @return void
	 */
	public static function customUploadDirectory( $upload ) {
		// Define the new upload directory
		$upload_dir = '/' . self::$custom_dir . '/' . self::$content_id;

		// Get the current upload directory path and URL
		$upload_path = $upload['basedir'] . $upload_dir;
		$upload_url  = $upload['baseurl'] . $upload_dir;

		// Update the upload directory path and URL
		$upload['path']   = $upload_path;
		$upload['url']    = $upload_url;
		$upload['subdir'] = $upload_dir;

		return $upload;
	}
	
	/**
	 * Create custom directory for files
	 *
	 * @param int $content_id
	 * @return void
	 */
	private static function createUploadDir( $content_id ) {
		
		$wp_upload_dir = wp_upload_dir(); // Get the path and URL of the wp-uploads directory

		// Create the full path of the custom directory
		$custom_dir_path = $wp_upload_dir['basedir'] . '/' . self::$custom_dir . '/' . $content_id;
		$htaccess_path   = $wp_upload_dir['basedir'] . '/' . self::$custom_dir . '/.htaccess';

		// Create the directory if it doesn't exist
		if ( ! is_dir( $custom_dir_path ) ) {
			wp_mkdir_p( $custom_dir_path );
		}

		// Add direct file download restriction apache server.
		if ( ! file_exists( $htaccess_path ) ) {
			file_put_contents( $htaccess_path, 'deny from all' );
		}

		// To Do: nginx doesn't restrict per directory, rather show instruction in dashboard how to restrict directory.
	}

	/**
	 * Process upload of a file using native WP methods
	 *
	 * @param int $content_id
	 * @param array $file
	 * @param string $file_title
	 * @return void
	 */
	public static function uploadFile( $content_id, array $file, string $file_title ) {
		// Store to make available in upload_dir hook handler
		self::$content_id = $content_id;

		// File id place holder
		$attachment_id = null;

		// Create necessary directory if not created already
		self::createUploadDir( $content_id );

		// Add filters
		add_filter( 'upload_dir', array( __CLASS__, 'customUploadDirectory' ) );

		// Set the upload directory
		$upload_dir = wp_upload_dir()['path'];
		$file_title = preg_replace( '/-+/', '-', str_replace( ' ', '', $file_title ) );
		$file_name  = $file_title . '.' . pathinfo( $file['name'], PATHINFO_EXTENSION );
		$file_path  = $upload_dir . '/' . $file_name;

		// Alter the name and handle upload
		$file['name'] = $file_name;
		$upload       = wp_handle_upload( $file, array( 'test_form' => false ) );

		if ( isset( $upload['file'] ) ) {
			// Create a post for the file
			$attachment = array(
				'post_mime_type' => $upload['type'],
				'post_title'     => $file_title,
				'post_content'   => '',
				'post_status'    => 'private',
				'guid'           => $upload['url']
			);
			$attachment_id = wp_insert_attachment( $attachment, $file_path );
			require_once( ABSPATH . 'wp-admin/includes/image.php' );

			// Generate meta data for the file
			$attachment_data = wp_generate_attachment_metadata( $attachment_id, $file_path );
			wp_update_attachment_metadata( $attachment_id, $attachment_data );
			update_post_meta( $attachment_id, self::$crewhrm_meta_key, true );
		} else {
			// Error uploading the file
			error_log( __FILE__ . ' ' . __LINE__ . ' ' . var_export( $upload['error'], true ) ) ;
		}

		// Remove filters
		remove_filter( 'upload_dir', array( __CLASS__, 'customUploadDirectory' ) );

		return $attachment_id;
	}

	/**
	 * Delete file for a single application
	 *
	 * @param int|array
	 * @return void
	 */
	public static function deleteFile( $release_ids ) {
		/* if ( ! is_array( $release_ids ) ) {
			$release_ids = array( $release_ids );
		}

		$implodes = implode( ',', $release_ids );
		if ( empty( $implodes ) ) {
			return;
		}

		global $wpdb;
		$file_ids = $wpdb->get_col(
			"SELECT file_id FROM " . self::table( 'releases' ) . " WHERE release_id IN (" . $implodes . ")"
		);

		if ( ! empty( $file_ids ) && is_array( $file_ids ) ) {
			// Now delete files one by one
			foreach ( $file_ids as $id ) {
				wp_delete_attachment( $id, true );
			}
		} */
	}
}