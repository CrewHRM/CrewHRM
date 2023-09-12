-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 12, 2023 at 03:36 AM
-- Server version: 8.0.16
-- PHP Version: 8.0.0

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
  `street_address` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `province` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `zip_code` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `country_code` varchar(5) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `timezone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `date_format` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `time_format` tinyint(3) UNSIGNED DEFAULT '24' COMMENT '12 or 24 based',
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
  `email` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(10) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `cover_letter` longtext COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `resume_file_id` bigint(20) UNSIGNED NOT NULL,
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
  `meta_key` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `meta_value` longtext NOT NULL,
  PRIMARY KEY (`meta_id`),
  KEY `object_id` (`object_id`,`meta_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_departments`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_departments` (
  `department_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `parent_id` bigint(20) UNSIGNED NOT NULL,
  `sequence` smallint(5) UNSIGNED NOT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_jobmeta`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_jobmeta` (
  `meta_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `object_id` bigint(20) UNSIGNED NOT NULL,
  `meta_key` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `meta_value` longtext COLLATE utf8mb4_unicode_520_ci NOT NULL,
  PRIMARY KEY (`meta_id`),
  KEY `object_id` (`object_id`,`meta_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wp_crewhrm_jobs`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_jobs` (
  `job_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `job_code` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `job_title` mediumtext COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `job_description` longtext COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `job_status` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT 'draft, publish or archive. Once published, draft copies will be saved in meta instead to show prompt in editor. ',
  `department_id` bigint(20) UNSIGNED NOT NULL,
  `vacancy` mediumint(8) UNSIGNED DEFAULT NULL,
  `address_id` bigint(20) UNSIGNED DEFAULT NULL,
  `currency` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `salary_a` mediumint(8) UNSIGNED DEFAULT NULL COMMENT 'To support salary range like 2000-4000. Second portion will go into salary_b column.',
  `salary_b` mediumint(8) UNSIGNED DEFAULT NULL,
  `salary_basis` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'daily, weekly, monthly, yearly',
  `employment_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'part_time, full_time, contract, temporary, trainee',
  `experience_level` varchar(20) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'beginner, intermediate, expert etc.',
  `experience_years` varchar(255) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `application_deadline` date DEFAULT NULL,
  `application_form` longtext COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`job_id`),
  KEY `job_status` (`job_status`,`department_id`,`salary_basis`,`employment_type`)
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
-- Table structure for table `wp_crewhrm_qna`
--

CREATE TABLE IF NOT EXISTS `wp_crewhrm_qna` (
  `qna_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `question` mediumtext COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `answer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT 'Maybe text, number, serialized data etc. And the answer will be prepared based on the question type.',
  `question_type` varchar(30) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `application_id` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`qna_id`)
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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
