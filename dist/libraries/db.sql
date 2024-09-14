-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 22, 2024 at 06:38 AM
-- Server version: 8.0.16
-- PHP Version: 8.1.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `local`
--

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_addresses`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_addresses` (
  `address_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `unit_flat` varchar(255) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `street_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `province` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `zip_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `country_code` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `timezone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  PRIMARY KEY (`address_id`),
  KEY `province` (`province`,`country_code`,`timezone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_applications`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_applications` (
  `application_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `job_id` bigint(20) UNSIGNED NOT NULL,
  `stage_id` bigint(20) UNSIGNED DEFAULT NULL,
  `address_id` bigint(20) UNSIGNED DEFAULT NULL,
  `first_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `last_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `cover_letter` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  `resume_file_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_complete` tinyint(1) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'It will be null until all the files are uploaded one by one. Null means application not completed yet. ',
  `application_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`application_id`),
  KEY `job_id` (`job_id`,`stage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_appmeta`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_appmeta` (
  `meta_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `object_id` bigint(20) UNSIGNED NOT NULL,
  `meta_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `meta_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  PRIMARY KEY (`meta_id`),
  KEY `object_id` (`object_id`,`meta_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_comments`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_comments` (
  `comment_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `comment_content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `comment_type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'text',
  `comment_parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `application_id` bigint(20) UNSIGNED NOT NULL,
  `commenter_id` bigint(20) UNSIGNED NOT NULL,
  `comment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment_edit_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_departments`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_departments` (
  `department_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sequence` smallint(5) UNSIGNED NOT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_employee_meta`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_employee_meta` (
  `meta_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `object_id` bigint(20) UNSIGNED NOT NULL,
  `meta_key` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `meta_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  PRIMARY KEY (`meta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_employments`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_employments` (
  `employment_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_user_id` bigint(20) UNSIGNED NOT NULL,
  `designation` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `employment_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'full_time, part_time, contract, temporary or trainee',
  `employment_status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'active, inactive, resigned, laid_off or terminated',
  `annual_gross_salary` bigint(20) UNSIGNED DEFAULT NULL,
  `salary_currency` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `reporting_person_user_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'The user ID of reporting person. Ideally the reporting person is also an employee.',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `attendance_type` varchar(10) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'on_site, remote or hybrid',
  `is_provisional` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `probation_end_date` date DEFAULT NULL,
  `weekly_working_hour` tinyint(3) UNSIGNED DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  PRIMARY KEY (`employment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_employment_meta`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_employment_meta` (
  `meta_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `object_id` bigint(20) UNSIGNED NOT NULL,
  `meta_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `meta_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  PRIMARY KEY (`meta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_events`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_events` (
  `event_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  `starts_at` timestamp NOT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `channel` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT 'zoom, meet, in_person etc.',
  `event_dest` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci COMMENT 'zoom or meet id, address id etc.',
  `password` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `application_id` bigint(20) UNSIGNED DEFAULT NULL,
  `host_id` bigint(20) UNSIGNED NOT NULL,
  `creator_id` bigint(20) UNSIGNED NOT NULL COMMENT 'The user ID who creates event',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_event_attendees`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_event_attendees` (
  `attendee_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'If the attendee is not registered user, just invited through email. ',
  PRIMARY KEY (`attendee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_jobmeta`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_jobmeta` (
  `meta_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `object_id` bigint(20) UNSIGNED NOT NULL,
  `meta_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `meta_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  PRIMARY KEY (`meta_id`),
  KEY `object_id` (`object_id`,`meta_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_jobs`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_jobs` (
  `job_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `job_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `job_title` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `job_slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `job_description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `job_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT 'draft, publish or archive. Once published, draft copies will be saved in meta instead to show prompt in editor. ',
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `vacancy` mediumint(8) UNSIGNED DEFAULT NULL,
  `address_id` bigint(20) UNSIGNED DEFAULT NULL,
  `currency` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `salary_a` mediumint(8) UNSIGNED DEFAULT NULL COMMENT 'To support salary range like 2000-4000. Second portion will go into salary_b column.',
  `salary_b` mediumint(8) UNSIGNED DEFAULT NULL,
  `salary_basis` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'daily, weekly, monthly, yearly',
  `employment_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'part_time, full_time, contract, temporary, trainee',
  `attendance_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `experience_level` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'beginner, intermediate, expert etc.',
  `experience_years` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `application_deadline` timestamp NULL DEFAULT NULL,
  `application_form` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`job_id`),
  UNIQUE KEY `job_slug` (`job_slug`),
  KEY `job_status` (`job_status`,`department_id`,`salary_basis`,`employment_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_leaves`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_leaves` (
  `leave_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `request_note` text COLLATE utf8mb4_unicode_520_ci,
  `rejection_note` text COLLATE utf8mb4_unicode_520_ci,
  `leave_status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT 'pending, cancelled, approved, rejected',
  `leave_type` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT 'sick, parental, maternity, paternity, annual etc. Also unpaid, however unpaid has special usage in backend functionalities. ',
  `employee_user_id` bigint(20) UNSIGNED NOT NULL,
  `reviewer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `request_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `action_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`leave_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_pipeline`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_pipeline` (
  `pipeline_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `application_id` bigint(20) UNSIGNED NOT NULL,
  `stage_id` int(10) UNSIGNED NOT NULL,
  `action_taker_id` bigint(20) UNSIGNED NOT NULL,
  `action_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pipeline_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_stages`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_stages` (
  `stage_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `stage_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `job_id` bigint(20) UNSIGNED NOT NULL,
  `sequence` tinyint(3) UNSIGNED NOT NULL,
  PRIMARY KEY (`stage_id`),
  KEY `job_id` (`job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_weekly_schedules`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_weekly_schedules` (
  `schedule_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `employment_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'Null means global settings, otherwise for specific employment',
  `week_day` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT 'monday, tuesday and so on',
  `time_starts` time NOT NULL,
  `time_ends` time NOT NULL,
  `enable` tinyint(1) UNSIGNED NOT NULL,
  PRIMARY KEY (`schedule_id`),
  KEY `week_day` (`week_day`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Alter structure for table `wp_crewhrm_jobs`
--

ALTER TABLE `wp_crewhrm_jobs` MODIFY `salary_a` INT UNSIGNED;

ALTER TABLE `wp_crewhrm_jobs` MODIFY `salary_b` INT UNSIGNED;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
