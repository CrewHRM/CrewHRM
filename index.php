<?php
/**
 * Plugin Name: Crew HRM
 * Plugin URI: https://example.com
 * Description: HR Management system
 * Author: Crew
 * Version: 1.0.0
 * Author URI: https://crew.com
 * Requires at least: 5.3
 * Tested up to: 6.2
 * Text Domain: crewhrm
 */

// Load autoloader
require_once __DIR__ . '/vendor/autoload.php';

// Initialize Plugin
(new \CrewHRM\Main())->init( (object) array(
	'root_menu_slug' => 'crewhrm',
	'db_prefix'      => 'crewhrm_',
	'version'        => '1.0.0',
	'dir'            => __DIR__ . '/',
	'url'            => plugin_dir_url( __FILE__ ),
	'dist_url'       => plugin_dir_url( __FILE__ ) . 'dist/',
	'current_url'    => "http".((!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!='off')?'s':'').'://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']
) );