<?php

namespace CrewHRM\Helpers;

class File {
	/**
	 * Find file object in array and assign dynamic file URL
	 *
	 * @param array $contents
	 * @return array
	 */
	public static function applyDynamics( array $contents ) {
		// Loop through array contents
		foreach ( $contents as $index => $content ) {

			if ( is_array( $content ) ) {
				if ( isset( $content['file_id'], $content['file_url'] ) ) {
					// Assign dynamic url replace for host change support
					$contents[ $index ]['file_url'] = wp_get_attachment_url( $content['file_id'] );
				}

				$contents[ $index ] = self::applyDynamics( $content );
			}
		}

		return $contents;
	}

	/**
	 * Organize upload files hierarchically.
	 *
	 * @param array $files
	 * @return array
	 */
	public static function organizeUploadedFiles( array $files ) {
		$organizedFiles = [];

		foreach ($files as $key => $value) {
			if (is_array($value)) {
				foreach ($value as $index => $fileInfo) {
					$organizedFiles[$index][$key] = $fileInfo;
				}
			}
		}

		return $organizedFiles;
	}

	/**
	 * Delete WP files
	 *
	 * @param int|array $file_id File ID or array of files IDs
	 * @param bool $force_delete Whether to bypass trash and delete permanently. Default false which means move to trash.
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
}