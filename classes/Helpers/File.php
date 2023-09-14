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
	 * Organize upload files
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
}