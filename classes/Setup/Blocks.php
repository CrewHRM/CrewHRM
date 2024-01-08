<?php
/**
 * Gutenberg blocks
 *
 * @package crewhrm
 */

namespace CrewHRM\Setup;

use CrewHRM\Main;

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
}
