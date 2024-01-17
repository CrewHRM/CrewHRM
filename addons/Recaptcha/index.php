<?php
/**
 * Plugin Name: Crew HRM - reCaptcha integration
 * Plugin URI: https://getcrewhrm.com/pricing/
 * Description: reCaptcha integration addon for job application spam protection
 * Author: Crew HRM
 * Version: 1.0.0
 * Author URI: https://getcrewhrm.com
 * Requires at least: 5.3
 * Tested up to: 6.3
 * Text Domain: crewhrm
 * CrewHRM ID: recaptcha-integration
 * CrewHRM External: false
 * CrewHRM Controlled: true
 * CrewHRM Free Addon: true
 *
 * @package crewhrm
 */

if ( ! defined( 'ABSPATH' ) ) { exit;
}

// Load addon
require_once __DIR__ . '/classes/Main.php';
( new \CrewHRM\Addon\Recaptcha\Main() )->init( __FILE__ );
