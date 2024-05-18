<?php
/**
 * File uploader functionalities
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

use CrewHRM\Helpers\_String;

/**
 * File and directory handler class
 */
class FileManager {

	/**
	 * CrewHRM identifier meta key
	 *
	 * @var string
	 */
	public static $crewhrm_meta_key = 'crewhrm_application_file';

	/**
	 * The directory to store file
	 *
	 * @var string
	 */
	private $dir;

	/**
	 * Replacable file id to make available in upload_dir hook callback
	 *
	 * @var int
	 */
	private $content_id = 0;

	public function __construct( $content_id, $file_of ) {

		$this->content_id = $content_id;

		// For now either employee or application.
		// Employee means the files is of employee user, application means it is related to job application rather.
		$this->dir = $file_of === 'employee' ? 'crewhrm-employee-files' : 'crewhrm-application-files';
	}

	/**
	 * Alter upload directory by hook
	 *
	 * @param array $upload Dir configs
	 * @return array
	 */
	public function customUploadDirectory( $upload ) {
		// Define the new upload directory
		$upload_dir = '/' . $this->dir . '/' . $this->content_id;

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
	 * @return void
	 */
	private function createUploadDir() {

		$wp_upload_dir = wp_upload_dir(); // Get the path and URL of the wp-uploads directory

		// Create the full path of the custom directory
		$custom_dir_path = $wp_upload_dir['basedir'] . '/' . $this->dir . '/' . $this->content_id;
		$htaccess_path   = $wp_upload_dir['basedir'] . '/' . $this->dir . '/.htaccess';

		// Create the directory if it doesn't exist
		if ( ! is_dir( $custom_dir_path ) ) {
			wp_mkdir_p( $custom_dir_path );
		}

		// Add direct file download restriction apache server.
		if ( ! file_exists( $htaccess_path ) ) {
			self::putContents( $htaccess_path, 'deny from all' );
		}

		// To Do: nginx doesn't restrict per directory, rather show instruction in dashboard how to restrict directory.
	}

	/**
	 * Process upload of a file using native WP methods
	 *
	 * @param array $file File array with size, tmp_name etc.
	 * @return int|null
	 */
	public function uploadFile( array $file ) {

		// File id place holder
		$attachment_id = null;

		// Create necessary directory if not created already
		self::createUploadDir();

		// Add filters
		add_filter( 'upload_dir', array( $this, 'customUploadDirectory' ) );

		// Alter the name and handle upload
		$upload = wp_handle_upload( $file, array( 'test_form' => false ) );

		if ( isset( $upload['file'] ) ) {
			// Create a post for the file
			$attachment    = array(
				'post_mime_type' => $upload['type'],
				'post_title'     => $file['name'],
				'post_content'   => '',
				'post_status'    => 'private',
				'guid'           => $upload['url'],
			);
			$attachment_id = wp_insert_attachment( $attachment, $upload['file'] );
			require_once ABSPATH . 'wp-admin/includes/image.php';

			// Generate meta data for the file
			$attachment_data = wp_generate_attachment_metadata( $attachment_id, $upload['file'] );
			wp_update_attachment_metadata( $attachment_id, $attachment_data );
			update_post_meta( $attachment_id, self::$crewhrm_meta_key, $this->content_id );
		} else {
			$attachment_id = null;
		}

		// Remove filters
		remove_filter( 'upload_dir', array( __CLASS__, 'customUploadDirectory' ) );

		return $attachment_id;
	}

	/**
	 * Put file contents into file system
	 *
	 * @param string $file_path The path to write content to
	 * @param string $content_to_write The content to write into file system
	 *
	 * @return bool
	 */
	public static function putContents( $file_path, $content_to_write ) {
		// Make sure the WP_Filesystem class is loaded
		if ( ! class_exists( 'WP_Filesystem' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		// Initialize the WP_Filesystem
		if ( ! WP_Filesystem() ) {
			// Unable to initialize the filesystem
			return false;
		}

		// Use WP_Filesystem to write content to the file
		global $wp_filesystem;
		$result = $wp_filesystem->put_contents( $file_path, $content_to_write, FS_CHMOD_FILE );

		// Check if the content was successfully written
		return false !== $result;
	}

	/**
	 * Delete WP files
	 *
	 * @param int|array $file_id File ID or array of files IDs
	 * @param bool      $force_delete Whether to delete permanently
	 *
	 * @return void
	 */
	public static function deleteFile( $file_id, $force_delete = true ) {
		if ( ! is_array( $file_id ) ) {
			$file_id = array( $file_id );
		}

		// Loop through file IDs and delete
		foreach ( $file_id as $id ) {
			if ( ! empty( $id ) && is_numeric( $id ) ) {
				wp_delete_attachment( $id, $force_delete );
			}
		}
	}

	/**
	 * Search for media
	 *
	 * @param stirng $keyword
	 * @param string $mime
	 * @param array  $exclude
	 *
	 * @return array
	 */
	public static function searchMedia( string $keyword, string $mime, array $exclude ) {

		global $wpdb;

		$where_clause = '';

		// Keyword filter
		$where_clause .= $wpdb->prepare( ' AND post_title LIKE %s', "%{$wpdb->esc_like( $keyword )}%" );

		// Mime type filter
		if ( ! empty( $mime ) ) {
			$where_clause .= $wpdb->prepare( ' AND post_mime_type=%d', $mime );
		}

		// Exclude certain IDs from result
		if ( ! empty( $exclude ) ) {
			$ids_places    = _String::getPlaceHolders( $exclude );
			$where_clause .= " AND ID NOT IN ({$ids_places})";
		}

		$results = $wpdb->get_results(
			"SELECT 
				* 
			FROM 
				{$wpdb->posts} 
			WHERE 
				post_type = 'attachment'
				{$where_clause}
			LIMIT 50",
			ARRAY_A
		);

		$media_array = array();

		foreach ( $results as $result ) {
			$media_array[] = array(
				'id'            => (int) $result['ID'],
				'label'         => $result['post_title'],
				// 'unique_name'   => $result['post_name'],
				'thumbnail_url' => get_the_post_thumbnail_url( $result['ID'] ),
				'permalink'     => get_post_permalink( $result['ID'] ),
			);
		}

		return $media_array;
	}
}
