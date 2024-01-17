<?php
/**
 * Gutenberg blocks
 *
 * @package crewhrm
 */

namespace CrewHRM\Setup;

use CrewHRM\Helpers\Utilities;
use CrewHRM\Main;
use CrewHRM\Models\Department;

/**
 * Block registrar class
 */
class Blocks {
	/**
	 * Registrar constructor
	 */
	public function __construct() {
		if ( function_exists( 'register_block_type' ) ) {
			add_action( 'init', array( $this, 'registerBlock' ) );
			add_filter( 'crewhrm_frontend_data', array( $this, 'addDepartmentsToVariables' ) );
		}
	}

	/**
	 * Register blocks
	 *
	 * @return void
	 */
	public function registerBlock() {
		wp_register_script(
			'crewhrm-block-editor',
			Main::$configs->dist_url . 'blocks-editor.js',
			array(),
			Main::$configs->version,
			true
		);

		register_block_type(
			'crewhrm/careers',
			array(
				'editor_script' => 'crewhrm-block-editor',
			)
		);
	}

	/**
	 * Add departments array to JS variable as it is necessary for careers block in gutenberg editor
	 *
	 * @param array $data Existing JS variables
	 *
	 * @return array
	 */
	public function addDepartmentsToVariables( array $data ) {
		if ( Utilities::isGutenbergEditor() && ! isset( $data['departments'] ) ) {
			$data['departments'] = Department::getDepartments();
		}
		return $data;
	}
}
