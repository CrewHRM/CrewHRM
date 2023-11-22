<?php
/**
 * Plugin Name: CrewHRM
 * Plugin URI: https://getcrewhrm.com/pricing/
 * Description: Post jobs on your site and hire talent - all inside your website for free!
 * Author: CrewHRM
 * Version: 1.0.4
 * Author URI: https://getcrewhrm.com
 * Requires at least: 5.3
 * Tested up to: 6.3.1
 * Requires PHP: 7.4
 * Text Domain: crewhrm
 *
 * @package crewhrm
 */

// Load App
require_once __DIR__ . '/classes/Main.php';

// Initialize Plugin
( new \CrewHRM\Main() )->init(
	(object) array(
		'app_name'  => 'crewhrm',
		'db_prefix' => 'crewhrm_',
		'mode'      => 'development',
		'file'      => __FILE__,
	)
);
