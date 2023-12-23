<?php
/**
 * Plugin Name: Crew HRM - Google reCAPTCHA
 * Plugin URI: https://getcrewhrm.com/pricing/
 * Description: Google reCAPTCHA addon for job application spam protection
 * Author: Crew HRM
 * Version: 1.0.0
 * Author URI: https://getcrewhrm.com
 * Requires at least: 5.3
 * Tested up to: 6.3
 * Text Domain: crewhrm
 * CrewHRM ID: google-recaptcha
 * CrewHRM External: false
 * CrewHRM Controlled: true
 */

// Load addon
require_once __DIR__ . '/classes/Main.php';
(new \CrewHRM\Addon\Recaptcha\Main)->init( __FILE__ );
