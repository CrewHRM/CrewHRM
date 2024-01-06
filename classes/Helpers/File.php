<?php
/**
 * File related activities
 *
 * @package crewhrm
 */

namespace CrewHRM\Helpers;

use CrewHRM\Main;

/**
 * File handler class
 */
class File {
	/**
	 * Find file object in array and assign dynamic file URL
	 *
	 * @param array $contents The content array to assign dynamic url to
	 * @return array
	 */
	public static function applyDynamics( array $contents ) {
		// Loop through array contents
		foreach ( $contents as $index => $content ) {

			if ( is_array( $content ) ) {
				if ( isset( $content['file_id'], $content['file_url'] ) ) {
					// Assign dynamic url replace for host change support
					$contents[ $index ]['file_url'] = self::getRestrictedFileURL( $content['file_id'] );
				}

				$contents[ $index ] = self::applyDynamics( $content );
			}
		}

		return $contents;
	}

	/**
	 * Delete WP files
	 *
	 * @param int|array $file_id      File ID or array of files IDs
	 * @param bool      $force_delete Whether to bypass trash and delete permanently. Default false which means move to trash.
	 * @return void
	 */
	public static function deleteFile( $file_id, $force_delete = false ) {
		if ( ! is_array( $file_id ) ) {
			$file_id = array( $file_id );
		}

		foreach ( $file_id as $id ) {
			wp_delete_attachment( $id, $force_delete );
		}
	}

	/**
	 * Organize uploaded files hierarchy
	 *
	 * @param array $file_s The file holder array to organize
	 * @return array
	 */
	public static function organizeUploadedHierarchy( array $file_s ) {
		$new_array = array();

		$columns = array( 'name', 'size', 'type', 'tmp_name', 'error' );

		// Loop through data types like name, tmp_name etc.
		foreach ( $columns as $column ) {

			if ( ! isset( $file_s[ $column ] ) ) {
				continue;
			}

			// Loop through data
			foreach ( $file_s[ $column ] as $post_name => $data_list ) {

				if ( ! isset( $new_array[ $post_name ] ) ) {
					$new_array[ $post_name ] = array();
				}

				if ( ! is_array( $data_list ) ) {
					$new_array[ $post_name ][ $column ] = $data_list;
					continue;
				}

				foreach ( $data_list as $index => $data ) {
					if ( ! isset( $new_array[ $post_name ][ $index ] ) ) {
						$new_array[ $post_name ][ $index ] = array();
					}

					$new_array[ $post_name ][ $index ][ $column ] = $data;
				}
			}
		}

		return $new_array;
	}

	/**
	 * Generate restricted file link to access application files
	 *
	 * @param integer $file_id File ID to generate URL for
	 * @return string
	 */
	public static function getRestrictedFileURL( int $file_id ) {
		$ajaxurl      = admin_url( 'admin-ajax.php' );
		$nonce_action = '_crewhrm_' . str_replace( '-', '_', gmdate( 'Y-m-d' ) );
		$nonce        = wp_create_nonce( $nonce_action );

		$args = array(
			'action'       => 'crewhrm_loadFile',
			'file_id'      => $file_id,
			'nonce'        => $nonce,
			'nonce_action' => $nonce_action,
		);

		return add_query_arg( $args, $ajaxurl );
	}

	/**
	 * List files in a directory
	 *
	 * @param string $directory The directory to list files in
	 * @return array
	 */
	public static function getFilesInDirectory( string $directory ) {

		$files = array();

		// Check if the directory exists
		if ( is_dir( $directory ) ) {
			$iterator = new \DirectoryIterator( $directory );

			foreach ( $iterator as $file_info ) {
				if ( $file_info->isFile() ) {
					$filename           = pathinfo( $file_info->getFilename(), PATHINFO_FILENAME );
					$files[ $filename ] = $file_info->getPathname();
				}
			}
		}

		return $files;
	}
}
