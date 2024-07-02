<?php
/**
 * Plugin Name: Crew HRM
 * Plugin URI: https://getcrewhrm.com/pricing/
 * Description: Post jobs on your site and hire talent - all inside your website for free!
 * Author: Crew HRM
 * Version: 1.1.1
 * Author URI: https://getcrewhrm.com
 * Requires at least: 5.3
 * Tested up to: 6.5.4
 * Requires PHP: 7.4
 * License: GPLv3
 * License URI: https://opensource.org/licenses/GPL-3.0
 * Text Domain: hr-management
 *
 * @package crewhrm
 */

if ( ! defined( 'ABSPATH' ) ) { exit;
}

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
