<?php
/**
 * Plugin Name: CrewHRM
 * Plugin URI: https://getcrewhrm.com/pricing/
 * Description: The best HRM plugin for online recruitment management. CrewHRM offers a complete solution from creating job posts, sharing them online, managing submissions, screening, asses, and hiring!
 * Author: CrewHRM
 * Version: 1.0.0
 * Author URI: https://getcrewhrm.com
 * Requires at least: 5.3
 * Tested up to: 6.3
 * Text Domain: crewhrm
 *
 * @package crewhrm
 */

// Load autoloader
require_once __DIR__ . '/classes/Main.php';

// Initialize Plugin
( new \CrewHRM\Main() )->init(
	(object) array(
		'app_name'       => 'crewhrm',
		'root_menu_slug' => 'crewhrm',
		'db_prefix'      => 'crewhrm_',
		'version'        => '1.0.0',
		'mode'           => 'development',
		'file'           => __FILE__,
		'dir'            => __DIR__ . DIRECTORY_SEPARATOR,
		'url'            => plugin_dir_url( __FILE__ ),
		'dist_url'       => plugin_dir_url( __FILE__ ) . 'dist/',
	)
);
