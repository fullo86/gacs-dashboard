-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 09, 2026 at 10:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `genieacsv2`
--

-- --------------------------------------------------------

--
-- Table structure for table `configurations`
--

CREATE TABLE `configurations` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `config_key` varchar(100) NOT NULL,
  `config_value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Generic key-value configuration storage';

-- --------------------------------------------------------

--
-- Table structure for table `device_monitoring`
--

CREATE TABLE `device_monitoring` (
  `id` char(36) NOT NULL,
  `device_id` varchar(255) NOT NULL,
  `status` enum('online','offline') NOT NULL,
  `notified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Device status change history for monitoring and notifications';

-- --------------------------------------------------------

--
-- Table structure for table `genieacs_credentials`
--

CREATE TABLE `genieacs_credentials` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `host` varchar(255) NOT NULL,
  `port` int(11) DEFAULT 7557,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `is_connected` tinyint(1) DEFAULT 0,
  `last_test` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='GenieACS TR-069 ACS connection settings (single active config only)';

--
-- Dumping data for table `genieacs_credentials`
--

INSERT INTO `genieacs_credentials` (`id`, `user_id`, `host`, `port`, `username`, `password`, `role`, `is_connected`, `last_test`, `created_at`, `updated_at`) VALUES
('0ee8f065-9d0b-44f8-907d-d7d5da759a4b', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'genieacs.mljnet.id', 7557, '', '', 'user', 1, NULL, '2025-12-12 22:25:25', '2025-12-14 00:25:37');

-- --------------------------------------------------------

--
-- Table structure for table `mac_vendor_cache`
--

CREATE TABLE `mac_vendor_cache` (
  `oui` varchar(6) NOT NULL COMMENT 'First 6 characters of MAC address (OUI)',
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `vendor_name` varchar(255) NOT NULL,
  `cached_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cache for MAC address vendor lookups to reduce API calls';

--
-- Dumping data for table `mac_vendor_cache`
--

INSERT INTO `mac_vendor_cache` (`oui`, `user_id`, `vendor_name`, `cached_at`) VALUES
('000822', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('001242', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Millennial Net', '2025-12-28 03:43:59'),
('001678', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('003018', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('0045E2', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('00C30A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('00E04C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:43:59'),
('00EC0A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:48:23'),
('023204', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('0236C1', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('02370C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('023A58', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:20'),
('023CC4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 02:26:21'),
('025452', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('02844F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('04B167', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('04E598', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:19:33'),
('060477', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:22'),
('061BA3', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 04:16:02'),
('067739', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:20'),
('06AED4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 02:26:21'),
('06C587', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('06D8CB', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:20'),
('082802', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('087F98', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('0A0467', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('0A0B92', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('0A2E99', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('0A466E', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('0A5309', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('0A7088', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('0A9A4A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('0C9838', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('0CA8A7', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('0CC6FD', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('0E2355', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('0E3B33', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('0E5CAE', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:43:59'),
('0E6566', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('0EAB38', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('0EF8E7', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 04:41:14'),
('102B41', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:48:23'),
('120E69', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('12287F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('127DE6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('128C43', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('12DC5D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('145E69', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('160A31', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('163C1F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('165DE6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 07:16:25'),
('1676F9', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('169559', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:32'),
('16E65F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('16F440', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('1801F1', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('1802AE', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'vivo Mobile Communication Co., Ltd.', '2025-12-28 14:41:53'),
('18895B', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:52:47'),
('18D0C5', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('18D717', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 07:16:26'),
('1A24E5', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('1A30B0', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 04:41:14'),
('1A99A4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:48:23'),
('1AE6A4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('1C48CE', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('1C77F6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:21'),
('1E8A89', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('1EC85D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('1EDFE8', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 15:25:24'),
('2034FB', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('205EF7', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('2064CB', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('20BBBC', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('222C22', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 05:06:37'),
('224E12', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('2269EB', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:29'),
('227798', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:29'),
('22DC84', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('22DFA0', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:43:59'),
('24B2B9', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:29'),
('263979', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 02:26:21'),
('264480', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('265E43', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 04:41:14'),
('268549', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('2699D6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('26AB8F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('26AEAB', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:21'),
('26B267', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('26D8A8', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('283166', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('287B11', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('288335', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Samsung Electronics Co.,Ltd', '2025-12-31 00:48:22'),
('2A1A86', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('2A4B13', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:20'),
('2A62EA', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('2A9E13', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('2AD945', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('2AE158', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 05:53:08'),
('2AFF65', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:48:23'),
('2C5D34', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'GUANGDONG OPPO MOBILE TELECOMMUNICATIONS CORP.,LTD', '2025-12-28 14:19:32'),
('2CD066', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('2E19C2', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('2E3F13', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('2E6D78', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 05:35:21'),
('308216', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 04:41:14'),
('309435', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('30CBF8', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 15:05:17'),
('325ED4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('3262E2', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('32E1A0', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 15:25:23'),
('32F023', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('362054', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('36489C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('365338', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('369123', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('36B65C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('36E99F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 04:41:14'),
('381A52', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Seiko Epson Corporation', '2025-12-28 03:43:59'),
('3854F5', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('38A4ED', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('38BAF8', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('3A2319', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:31'),
('3A7C76', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:55:19'),
('3AB107', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('3AB671', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('3ACECC', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 05:21:56'),
('3E02A4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:22'),
('3E145E', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 07:16:26'),
('3E53C8', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('3E6DAD', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('3E9945', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('3ED4CA', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('40F4C9', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('42275A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 07:16:25'),
('42448E', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('42801B', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('42988C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('42BC80', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('42C9F6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('42D644', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:48:22'),
('42EA42', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('46694C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('46AD45', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('46B274', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 15:05:17'),
('46DD5C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:43:59'),
('4A0389', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('4A2F1B', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('4A342A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('4A7621', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('4A8514', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('4AE323', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('4C1A3D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('4C37DE', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('4C6F9C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('4E9E85', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('503CEA', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('505A65', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'AzureWave Technology Inc.', '2026-01-07 02:44:16'),
('508F4C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('52381D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('524C33', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('5266DB', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:43:59'),
('52C143', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:19:33'),
('52CCE5', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 15:05:17'),
('52DE26', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 02:26:22'),
('5419C8', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:53:27'),
('561528', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('564A9F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('564CDB', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('56BBB2', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:20'),
('56D00B', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('5885A2', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('58C6F0', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('5A29D9', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('5A4E82', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 05:21:56'),
('5A6983', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('5A7D43', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 04:59:11'),
('5A982F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('5AB0D0', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 04:16:02'),
('5CD06E', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('5E3E40', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 06:21:19'),
('5E47EC', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('5E724F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('5E8C22', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('5EC4EA', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:19:32'),
('5ED21A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('601D9D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('60AB14', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('60D4E9', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'GUANGDONG OPPO MOBILE TELECOMMUNICATIONS CORP.,LTD', '2025-12-28 15:05:17'),
('60DC81', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('621C95', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('623925', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:20'),
('62915F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('62F5C2', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('645725', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('64A200', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('661604', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('6643C8', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('665B5B', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('66698D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:52:46'),
('66EE3A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('6A5B58', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('6A5F3F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 04:41:13'),
('6A7BBC', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:41:53'),
('6A95C8', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('6AEAD1', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:20'),
('6CF784', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('6E4BC9', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('6E53E1', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('6E5F41', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('6E8FA3', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('6EB799', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:48:22'),
('700894', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-07 02:44:16'),
('70B7AA', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 04:03:28'),
('70DDA8', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('721E91', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('722F32', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('723F47', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:48:22'),
('725F15', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:20'),
('727E35', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('72809C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:34:03'),
('72A049', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('72A16F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('72D13F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 02:26:21'),
('7412BB', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('765676', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('76691C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('768116', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('7836CC', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('78D840', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('7A0DB7', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('7A6782', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('7A8D4D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('7A9BD6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('7AAE21', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:23'),
('7AE52E', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('7C03AB', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('7C2ADB', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('7E1F34', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('7E304A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 02:26:21'),
('7E353C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('7E556C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:48:23'),
('7E9232', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('7E9E3B', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('7EB098', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('8281B5', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('82B4DA', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:43:59'),
('82BF54', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('84E9C1', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('860031', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('863778', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('8687C7', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:53:27'),
('86BC76', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('86C710', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 03:25:57'),
('88D50C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'GUANGDONG OPPO MOBILE TELECOMMUNICATIONS CORP.,LTD', '2025-12-28 04:54:33'),
('8A541F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('8A5E72', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('8A7D3B', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:48:23'),
('8AA15E', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('8CBEBE', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('8CD9D6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('8E4C7E', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 05:25:47'),
('8E5B00', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('8E8511', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('8EDD99', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('8EE959', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('924393', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('9254D7', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('92608D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('9296A7', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 02:26:21'),
('92A5B7', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('92A98A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:34:03'),
('942DDC', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('948CD7', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('964ABF', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 09:09:32'),
('9664F9', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('96B85C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('96BB8E', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('96CB7D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('96F801', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('98A5F9', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('9A1B69', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('9A2AD3', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 02:26:21'),
('9A46CE', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('9A5136', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('9A54C3', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:41:54'),
('9A94A0', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:23'),
('9A9BE2', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:43:59'),
('9AA5FE', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:48:23'),
('9AA7AE', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 02:26:22'),
('9AAF41', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('9AB337', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('9AB81F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('9ACA8C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('9AF058', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:29'),
('9C67D6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('9C6B72', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('9C8281', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'vivo Mobile Communication Co., Ltd.', '2025-12-28 07:16:25'),
('9CE82B', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('9CF531', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('9E0DD9', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('9E1231', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 07:48:54'),
('9E5CC3', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('9E6EBF', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:31'),
('9E8D5B', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('9E914B', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('9EAFEF', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('A2123D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 06:23:35'),
('A22AF3', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('A26869', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('A29B9D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('A2AD8D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:20'),
('A2C4A1', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('A2C508', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('A4F05E', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:32'),
('A636A9', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:43:21'),
('A64EC4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('A64F9C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('A68940', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('A6993D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:31'),
('A6D8A4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:29'),
('A841F4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('AA1064', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('AA2B03', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('AA2B9D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('AA49C4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('AA7FD8', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:21'),
('AA90AA', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('AA917C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('AA9488', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 04:59:11'),
('AADF20', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('AAEDA1', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('AAEFC9', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('AC2334', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 15:08:12'),
('AE59DC', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('AE6B4A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 04:54:33'),
('AE7273', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 05:47:21'),
('AE9E2E', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('B26F2C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('B2ACB7', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('B2F3AA', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:51:07'),
('B4293D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('B60308', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('B6243A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 04:54:32'),
('B69600', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('B6E74E', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('BA3676', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('BA40DF', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:48:23'),
('BA8834', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('BAC124', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:19'),
('BAC127', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('BAD9EE', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('BAE316', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('BAEC8C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:29'),
('BC91B5', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('BE0232', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('BE1071', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 05:44:36'),
('BE42F1', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('BE494D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('BE5017', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 05:06:38'),
('BE8DF0', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('BEB47E', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 02:26:22'),
('BEB5AE', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('BEB60C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('BEEF3B', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 05:53:07'),
('C087EB', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('C0DF69', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('C217BA', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('C23E67', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('C2AE5C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:52:46'),
('C2C00D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('C440F6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('C4741E', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('C4BD8D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 04:41:14'),
('C4E1A1', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('C4E39F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('C4FE5B', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('C6468C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('C672E6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('C6EAA6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 04:59:14'),
('C82E02', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('C86E08', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('CA07A8', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('CA2F06', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('CA8AAA', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:20'),
('CA9628', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('CAB949', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('CAD4C1', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('CAEF3A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('CC2D83', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('CCF411', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('CE33A2', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:21'),
('CE47B7', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('CEB7CA', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('CEE4FA', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:43:59'),
('CEFE5A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('D01255', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Hui Zhou Gaoshengda Technology Co.,LTD', '2025-12-29 13:04:29'),
('D02AAA', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('D09C7A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('D09CAE', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('D0A46F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('D22178', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('D240C7', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:32'),
('D24FDD', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 07:16:25'),
('D27011', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('D2756D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 04:47:04'),
('D29BBD', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 05:06:37'),
('D2B259', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('D4BBC8', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('D60FE4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:20'),
('D632D9', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 02:26:21'),
('D63341', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:48:22'),
('D64809', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('D65ACC', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('D67298', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('D69CF5', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('D6CB43', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('D6E091', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('D6E20F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('D81EDD', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('D8CE3A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('DA1DC6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('DA3C17', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('DA4F61', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('DA56A6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:53:27'),
('DA5BDD', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('DA6D6D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 02:26:21'),
('DA6F12', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('DA73B6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('DA8D0A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:48:23'),
('DC2D04', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('DE00B8', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('DE1E58', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('DE3599', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('DE544E', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:43:59'),
('DEA8AA', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('DEC18B', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('DEEADE', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:21'),
('DEF187', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:20'),
('E01F88', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('E2633F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 02:26:22'),
('E29027', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('E2B91A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:29'),
('E2C183', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 02:26:21'),
('E2CF58', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('E2D43A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('E2F123', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('E433AE', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('E4C483', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'GUANGDONG OPPO MOBILE TELECOMMUNICATIONS CORP.,LTD', '2025-12-28 04:41:15'),
('E6743F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('E6AE87', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('E6C982', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 05:38:41'),
('E6CBE4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('E6D792', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('E6DEA4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('E8F408', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('EA0FE5', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('EA34FE', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-07 02:44:16'),
('EA51E8', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('EA9973', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('EAADA8', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:43:59'),
('EACE75', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:43:21'),
('EADF4C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('EAE41F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('EAF92D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:34:04'),
('EE220F', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 05:34:06'),
('EE6780', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('EEAE37', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:00'),
('EEAF28', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 06:21:19'),
('EEFDDD', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:19:34'),
('F20F41', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:31'),
('F20FB7', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-09 02:26:21'),
('F21FC4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-31 00:48:22'),
('F253B0', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('F282B6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('F2BCA4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('F2BF96', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('F2C83D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:31'),
('F2CD43', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('F2F94D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 04:54:31'),
('F2F94E', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('F460E2', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('F62678', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('F637A3', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('F65A49', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('F663CD', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('F67F79', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('F6D4C4', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('F6D66D', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:20'),
('F6DF08', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30'),
('FA2009', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 14:11:20'),
('FA60C0', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('FAC2CF', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2026-01-05 01:17:02'),
('FAD938', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:04'),
('FADDEE', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 15:08:12'),
('FAF33A', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:01'),
('FCE998', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Apple, Inc.', '2026-01-09 02:26:23'),
('FE0B88', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:03'),
('FE0CE6', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-28 03:44:02'),
('FEB29C', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'Unknown Device', '2025-12-29 13:04:30');

-- --------------------------------------------------------

--
-- Table structure for table `map_connections`
--

CREATE TABLE `map_connections` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `from_item_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `to_item_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `connection_type` enum('online','offline') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'online',
  `path_coordinates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `map_items`
--

CREATE TABLE `map_items` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `item_type` enum('server','isp','mikrotik','olt','odc','odp','onu') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `parent_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `genieacs_device_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('online','offline','unknown') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'unknown',
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mikrotik_credentials`
--

CREATE TABLE `mikrotik_credentials` (
  `id` char(36) NOT NULL,
  `host` varchar(255) NOT NULL,
  `port` int(11) DEFAULT 8728,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_connected` tinyint(1) DEFAULT 0,
  `last_test` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='MikroTik RouterOS API connection settings (single active config only)';

-- --------------------------------------------------------

--
-- Table structure for table `odc_config`
--

CREATE TABLE `odc_config` (
  `id` char(36) NOT NULL,
  `map_item_id` char(36) NOT NULL,
  `olt_pon_port_id` int(11) DEFAULT NULL,
  `server_id` int(11) DEFAULT NULL COMMENT 'Reference to parent Server for child ODCs',
  `server_pon_port` int(11) DEFAULT NULL,
  `port_count` int(11) NOT NULL,
  `parent_attenuation_db` decimal(5,2) DEFAULT 0.00,
  `calculated_power` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ODC configuration with port management';

-- --------------------------------------------------------

--
-- Table structure for table `odp_config`
--

CREATE TABLE `odp_config` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `map_item_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `odc_port` int(11) DEFAULT NULL,
  `input_power` decimal(5,2) DEFAULT NULL,
  `parent_odp_port` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'For cascading ODPs: port from parent ODP (e.g., "20%", "80%")',
  `port_count` int(11) NOT NULL,
  `use_splitter` tinyint(1) DEFAULT 0,
  `use_secondary_splitter` tinyint(1) DEFAULT 0 COMMENT 'Enable secondary/cascading splitter',
  `secondary_splitter_ratio` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Secondary splitter ratio (e.g., "1:2", "1:8")',
  `custom_secondary_ratio_output_port` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'For custom secondary ratios: which port user selected',
  `splitter_ratio` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'e.g., "1:2", "1:8", "20:80", "30:70", "50:50"',
  `custom_ratio_output_port` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'For custom ratios (20:80, 30:70, 50:50): which port user selected for output',
  `calculated_power` decimal(5,2) DEFAULT NULL COMMENT 'Power AFTER splitter (user-facing value)',
  `port_rx_power` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `olt_config`
--

CREATE TABLE `olt_config` (
  `id` char(36) NOT NULL,
  `map_item_id` char(36) NOT NULL,
  `output_power` decimal(5,2) DEFAULT 2.00,
  `pon_count` int(11) DEFAULT 1,
  `attenuation_db` decimal(5,2) DEFAULT 0.00,
  `olt_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='OLT configuration with PON ports';

-- --------------------------------------------------------

--
-- Table structure for table `olt_pon_ports`
--

CREATE TABLE `olt_pon_ports` (
  `id` char(36) NOT NULL,
  `olt_item_id` char(36) NOT NULL,
  `pon_number` int(11) NOT NULL,
  `output_power` decimal(5,2) DEFAULT 9.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Individual OLT PON port power settings';

-- --------------------------------------------------------

--
-- Table structure for table `onu_config`
--

CREATE TABLE `onu_config` (
  `id` char(36) NOT NULL,
  `map_item_id` char(36) NOT NULL,
  `odp_port` int(11) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `genieacs_device_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ONU/ONT customer premises equipment configuration';

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires` date NOT NULL,
  `used` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `user_id`, `token`, `expires`, `used`, `created_at`, `updated_at`) VALUES
('2e3b786c-39f4-4752-9a7c-4b633c2413d7', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'cf82378573d080ef67e9f82dcddb53dee1ebe9b8bae1c306761c308eb3b886a8', '2026-01-05', 0, '2026-01-05 02:19:19', '2026-01-05 02:19:19');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `role_name` varchar(15) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', '2025-11-30 20:48:23', '2025-11-30 20:48:23'),
(2, 'Users', '2025-11-30 20:48:23', '2025-11-30 20:48:23');

-- --------------------------------------------------------

--
-- Table structure for table `server_pon_ports`
--

CREATE TABLE `server_pon_ports` (
  `id` char(36) NOT NULL,
  `map_item_id` char(36) NOT NULL,
  `port_number` int(11) NOT NULL,
  `output_power` decimal(5,2) DEFAULT 2.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Server PON port output power configuration';

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` char(36) NOT NULL,
  `device_id` varchar(50) NOT NULL,
  `tags` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `telegram_callback_cache`
--

CREATE TABLE `telegram_callback_cache` (
  `id` char(36) NOT NULL,
  `cache_key` varchar(255) NOT NULL,
  `cache_data` text NOT NULL COMMENT 'Serialized or JSON data',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Stores pagination and button state for inline keyboards';

-- --------------------------------------------------------

--
-- Table structure for table `telegram_config`
--

CREATE TABLE `telegram_config` (
  `id` char(36) NOT NULL,
  `bot_token` varchar(255) NOT NULL,
  `chat_id` varchar(100) NOT NULL,
  `is_connected` tinyint(1) DEFAULT 0,
  `last_test` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Telegram bot API configuration (single active config only)';

-- --------------------------------------------------------

--
-- Table structure for table `telegram_permissions`
--

CREATE TABLE `telegram_permissions` (
  `id` char(36) NOT NULL,
  `permission_key` varchar(100) NOT NULL COMMENT 'Unique permission identifier',
  `permission_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL COMMENT 'device, report, notification, map, admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Available permissions for role-based access control';

--
-- Dumping data for table `telegram_permissions`
--

INSERT INTO `telegram_permissions` (`id`, `permission_key`, `permission_name`, `description`, `category`) VALUES
('07h9ie30-6i1d-4f7g-4h8e-3d4i2j7k9l0m', 'report.view', 'View Reports', 'Generate on-demand reports', 'report'),
('18i0jf41-7j2e-4g8h-5i9f-4e5j3k8l0m1n', 'report.schedule', 'Schedule Reports', 'Create and manage report schedules', 'report'),
('29j1kg52-8k3f-4h9i-6j0g-5f6k4l9m1n2o', 'map.view', 'View Map', 'View device locations and GPS', 'map'),
('30k2lh63-9l4g-4i0j-7k1h-6g7l5m0n2o3p', 'admin.user_manage', 'Manage Users', 'Add, edit, remove users and roles', 'admin'),
('41l3mi74-0m5h-4j1k-8l2i-7h8m6n1o3p4q', 'admin.config', 'System Configuration', 'Access system configuration', 'admin'),
('a1f3b8e4-9c4f-4c1a-8b2d-7f8e6d1a2c3b', 'device.view', 'View Devices', 'View device list and details', 'device'),
('b2c4d9f5-1d6e-4a2b-9c3f-8e9f7d2b4d5e', 'device.summon', 'Summon Devices', 'Trigger device connection request', 'device'),
('c3d5eaf6-2e7f-4b3c-0d4a-9f0e8c3f5e6d', 'device.edit_wifi', 'Edit WiFi', 'Change device WiFi configuration', 'device'),
('d4e6fb07-3f8a-4c4d-1e5b-0a1f9d4g6h7i', 'device.search', 'Search Devices', 'Search and filter devices', 'device'),
('e5f7gc18-4g9b-4d5e-2f6c-1b2g0h5i7j8k', 'notification.subscribe', 'Subscribe Notifications', 'Subscribe to device notifications', 'notification'),
('f6g8hd29-5h0c-4e6f-3g7d-2c3h1i6j8k9l', 'notification.view', 'View Subscriptions', 'View own subscriptions', 'notification');

-- --------------------------------------------------------

--
-- Table structure for table `telegram_report_logs`
--

CREATE TABLE `telegram_report_logs` (
  `id` char(36) NOT NULL,
  `chat_id` varchar(255) NOT NULL,
  `report_type` enum('daily','weekly') NOT NULL,
  `report_date` date NOT NULL COMMENT 'Date the report covers',
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_devices` int(11) NOT NULL DEFAULT 0,
  `online_devices` int(11) NOT NULL DEFAULT 0,
  `offline_devices` int(11) NOT NULL DEFAULT 0,
  `new_online_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Devices that came online',
  `new_offline_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Devices that went offline',
  `offline_24h_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Devices offline > 24 hours',
  `poor_signal_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Devices with poor signal (<-25 dBm)',
  `report_data` text DEFAULT NULL COMMENT 'JSON data with detailed statistics'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='History of all sent reports for analytics';

-- --------------------------------------------------------

--
-- Table structure for table `telegram_report_schedules`
--

CREATE TABLE `telegram_report_schedules` (
  `id` char(36) NOT NULL,
  `chat_id` varchar(255) NOT NULL,
  `report_type` enum('daily','weekly') NOT NULL DEFAULT 'daily',
  `schedule_time` time NOT NULL DEFAULT '08:00:00' COMMENT 'Time to send report (HH:MM:SS)',
  `schedule_day` tinyint(1) DEFAULT NULL COMMENT 'Day of week for weekly reports (0=Sunday, 6=Saturday)',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='User preferences for automated daily/weekly reports';

-- --------------------------------------------------------

--
-- Table structure for table `telegram_role_permissions`
--

CREATE TABLE `telegram_role_permissions` (
  `id` char(36) NOT NULL,
  `role` enum('admin','operator','viewer') NOT NULL,
  `permission_key` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Maps permissions to roles for access control';

--
-- Dumping data for table `telegram_role_permissions`
--

INSERT INTO `telegram_role_permissions` (`id`, `role`, `permission_key`) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'admin', 'admin.config'),
('c9bf9e57-1685-4c89-bafb-ff5af830be8a', 'admin', 'admin.user_manage'),
('3fa85f64-5717-4562-b3fc-2c963f66afa6', 'admin', 'device.edit_wifi'),
('e7d13b5f-7b42-4f0c-8c59-d8c8f0b7c4ee', 'admin', 'device.search'),
('6fa459ea-ee8a-3ca4-894e-db77e160355e', 'admin', 'device.summon'),
('16fd2706-8baf-433b-82eb-8c7fada847da', 'admin', 'device.view'),
('7c9e6679-7425-40de-944b-e07fc1f90ae7', 'admin', 'map.view'),
('123e4567-e89b-12d3-a456-426614174000', 'admin', 'notification.subscribe'),
('123e4567-e89b-12d3-a456-426614174001', 'admin', 'notification.view'),
('123e4567-e89b-12d3-a456-426614174002', 'admin', 'report.schedule'),
('123e4567-e89b-12d3-a456-426614174003', 'admin', 'report.view'),
('123e4567-e89b-12d3-a456-426614174004', 'operator', 'device.search'),
('123e4567-e89b-12d3-a456-426614174005', 'operator', 'device.summon'),
('123e4567-e89b-12d3-a456-426614174006', 'operator', 'device.view'),
('123e4567-e89b-12d3-a456-426614174007', 'operator', 'map.view'),
('123e4567-e89b-12d3-a456-426614174008', 'operator', 'notification.subscribe'),
('123e4567-e89b-12d3-a456-426614174009', 'operator', 'notification.view'),
('123e4567-e89b-12d3-a456-426614174010', 'operator', 'report.schedule'),
('123e4567-e89b-12d3-a456-426614174011', 'operator', 'report.view'),
('123e4567-e89b-12d3-a456-426614174012', 'viewer', 'device.search'),
('123e4567-e89b-12d3-a456-426614174013', 'viewer', 'device.view'),
('123e4567-e89b-12d3-a456-426614174014', 'viewer', 'map.view'),
('123e4567-e89b-12d3-a456-426614174015', 'viewer', 'notification.view'),
('123e4567-e89b-12d3-a456-426614174016', 'viewer', 'report.view');

-- --------------------------------------------------------

--
-- Table structure for table `telegram_subscriptions`
--

CREATE TABLE `telegram_subscriptions` (
  `id` char(36) NOT NULL,
  `chat_id` varchar(255) NOT NULL,
  `device_id` varchar(255) NOT NULL,
  `device_serial` varchar(255) DEFAULT NULL,
  `subscribed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='User subscriptions for device status notifications';

-- --------------------------------------------------------

--
-- Table structure for table `telegram_users`
--

CREATE TABLE `telegram_users` (
  `id` char(36) NOT NULL,
  `chat_id` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL COMMENT 'Telegram username',
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `role` enum('admin','operator','viewer') NOT NULL DEFAULT 'viewer',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_activity` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Telegram bot users with role-based access control';

-- --------------------------------------------------------

--
-- Stand-in structure for view `telegram_user_permissions`
-- (See below for the actual view)
--
CREATE TABLE `telegram_user_permissions` (
`chat_id` varchar(255)
,`username` varchar(255)
,`role` enum('admin','operator','viewer')
,`is_active` tinyint(1)
,`permission_key` varchar(100)
,`permission_name` varchar(255)
,`category` varchar(50)
);

-- --------------------------------------------------------

--
-- Table structure for table `telegram_user_sessions`
--

CREATE TABLE `telegram_user_sessions` (
  `id` char(36) NOT NULL,
  `chat_id` varchar(255) NOT NULL,
  `session_type` varchar(50) NOT NULL COMMENT 'editwifi, search, etc',
  `session_data` text DEFAULT NULL COMMENT 'JSON data for the session',
  `current_step` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Stores multi-step wizard sessions (WiFi edit, etc)';

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `order_id` varchar(50) NOT NULL,
  `service` varchar(50) NOT NULL,
  `gross_amount` int(11) NOT NULL,
  `status` varchar(10) NOT NULL,
  `start_date` varchar(15) NOT NULL,
  `end_date` varchar(15) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `order_id`, `service`, `gross_amount`, `status`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
('45c51452-b3fc-41d0-86d3-a2378aa19cde', '6df562ce-9243-4d52-96bc-e725420fb61d', 'ORD-OQ1GYUZE', '6 Months Plan', 180000, 'inactive', '2026-01-07T08:3', '2026-07-07T08:3', '2026-01-07 08:38:53', '2026-01-07 08:38:53'),
('9da1a106-5ec8-42b8-a680-96df9042939d', '1be06acd-6d8b-47cf-a2b2-41db67746260', 'ORD-NPYPXRBO', '1 Month Plan', 1, 'inactive', '2026-01-08T05:1', '2026-02-08T05:1', '2026-01-08 05:11:12', '2026-01-08 05:11:12');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_detail`
--

CREATE TABLE `transaction_detail` (
  `id` char(36) NOT NULL,
  `transaction_id` char(36) DEFAULT NULL,
  `order_id` varchar(50) NOT NULL,
  `status_code` char(3) NOT NULL DEFAULT '000',
  `transaction_status` varchar(100) NOT NULL DEFAULT 'pending',
  `payment_type` varchar(50) NOT NULL,
  `transaction_time` datetime NOT NULL,
  `bank` varchar(20) DEFAULT NULL,
  `va_number` varchar(50) DEFAULT NULL,
  `pdf_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `username` varchar(100) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` char(13) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` smallint(6) NOT NULL,
  `activation_token` varchar(255) DEFAULT NULL,
  `active_trx` smallint(6) NOT NULL DEFAULT 0,
  `role_id` bigint(20) NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'default.png',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Web dashboard user authentication';

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `first_name`, `last_name`, `phone`, `email`, `password`, `status`, `activation_token`, `active_trx`, `role_id`, `image`, `created_at`, `updated_at`) VALUES
('1be06acd-6d8b-47cf-a2b2-41db67746260', 'fullo', 'M Taufik', 'Saefulloh', '08123456789', 'fullo@email.com', '$2b$12$4BIFbrIz0EZaT6qq63YFAezonx6OXDODcGsrc71YFopxucoNbdX3a', 1, '', 1, 2, 'default.png', '2025-12-05 07:34:40', '2026-01-09 02:22:18'),
('6df562ce-9243-4d52-96bc-e725420fb61d', 'user', 'User', '', '08123456789', 'user@email.com', '$2b$12$unHrUZyKODwif0tMdoIMRuuVjoSl0ZRqJCHU.K1nIqUOdik.ooD3G', 1, '30a74eb36365061314c9a0ed0618ecf667d86bd5f899ed1831bc71b2ab76e404', 0, 2, 'default.png', '2026-01-07 07:01:50', '2026-01-07 07:02:23'),
('a30082d8-92a7-4c4f-9cd7-6d3fdedc293b', 'TESTTTT111', 'testtt', 'testttt', '0812345678', 'fulllo76@protonmail.com', '$2b$12$KKy7ztetQ1LJHPCE9FJYMeIess6aDs8Q03WbW5jmZMZbAav7lyTYG', 0, '1cd22c5d5b1257498810ae2598facac4248cd263799a8ff7f1806ee8aedd3258', 0, 2, 'default.png', '2026-01-05 02:17:51', '2026-01-05 02:17:51');

-- --------------------------------------------------------

--
-- Structure for view `telegram_user_permissions`
--
DROP TABLE IF EXISTS `telegram_user_permissions`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `telegram_user_permissions`  AS SELECT `tu`.`chat_id` AS `chat_id`, `tu`.`username` AS `username`, `tu`.`role` AS `role`, `tu`.`is_active` AS `is_active`, `tp`.`permission_key` AS `permission_key`, `tp`.`permission_name` AS `permission_name`, `tp`.`category` AS `category` FROM ((`telegram_users` `tu` join `telegram_role_permissions` `trp` on(`tu`.`role` = `trp`.`role`)) join `telegram_permissions` `tp` on(`trp`.`permission_key` = `tp`.`permission_key`)) WHERE `tu`.`is_active` = 1 ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `configurations`
--
ALTER TABLE `configurations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `config_key` (`config_key`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `device_monitoring`
--
ALTER TABLE `device_monitoring`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_device_id` (`device_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `genieacs_credentials`
--
ALTER TABLE `genieacs_credentials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_host_port` (`host`,`port`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `mac_vendor_cache`
--
ALTER TABLE `mac_vendor_cache`
  ADD PRIMARY KEY (`oui`),
  ADD KEY `idx_cached_at` (`cached_at`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `map_connections`
--
ALTER TABLE `map_connections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `from_item_id` (`from_item_id`),
  ADD KEY `to_item_id` (`to_item_id`);

--
-- Indexes for table `map_items`
--
ALTER TABLE `map_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `idx_genieacs_device_id` (`genieacs_device_id`);

--
-- Indexes for table `mikrotik_credentials`
--
ALTER TABLE `mikrotik_credentials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_host_port` (`host`,`port`);

--
-- Indexes for table `odc_config`
--
ALTER TABLE `odc_config`
  ADD PRIMARY KEY (`id`),
  ADD KEY `map_item_id` (`map_item_id`);

--
-- Indexes for table `odp_config`
--
ALTER TABLE `odp_config`
  ADD PRIMARY KEY (`id`),
  ADD KEY `map_item_id` (`map_item_id`);

--
-- Indexes for table `olt_config`
--
ALTER TABLE `olt_config`
  ADD PRIMARY KEY (`id`),
  ADD KEY `map_item_id` (`map_item_id`);

--
-- Indexes for table `olt_pon_ports`
--
ALTER TABLE `olt_pon_ports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_olt_pon` (`olt_item_id`,`pon_number`);

--
-- Indexes for table `onu_config`
--
ALTER TABLE `onu_config`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `genieacs_device_id` (`genieacs_device_id`),
  ADD KEY `map_item_id` (`map_item_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `server_pon_ports`
--
ALTER TABLE `server_pon_ports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_server_port` (`map_item_id`,`port_number`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `telegram_callback_cache`
--
ALTER TABLE `telegram_callback_cache`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cache_key` (`cache_key`),
  ADD KEY `idx_expires_at` (`expires_at`);

--
-- Indexes for table `telegram_config`
--
ALTER TABLE `telegram_config`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_bot_token` (`bot_token`);

--
-- Indexes for table `telegram_permissions`
--
ALTER TABLE `telegram_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_permission_key` (`permission_key`);

--
-- Indexes for table `telegram_report_logs`
--
ALTER TABLE `telegram_report_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chat_id` (`chat_id`),
  ADD KEY `idx_report_date` (`report_date`),
  ADD KEY `idx_sent_at` (`sent_at`);

--
-- Indexes for table `telegram_report_schedules`
--
ALTER TABLE `telegram_report_schedules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_schedule` (`chat_id`,`report_type`),
  ADD KEY `idx_chat_id` (`chat_id`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `telegram_role_permissions`
--
ALTER TABLE `telegram_role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_role_permission` (`role`,`permission_key`),
  ADD KEY `idx_role` (`role`);

--
-- Indexes for table `telegram_subscriptions`
--
ALTER TABLE `telegram_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_subscription` (`chat_id`,`device_id`),
  ADD KEY `idx_chat_id` (`chat_id`),
  ADD KEY `idx_device_id` (`device_id`);

--
-- Indexes for table `telegram_users`
--
ALTER TABLE `telegram_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_chat_id` (`chat_id`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `telegram_user_sessions`
--
ALTER TABLE `telegram_user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chat_id` (`chat_id`),
  ADD KEY `idx_session_type` (`session_type`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `transaction_detail`
--
ALTER TABLE `transaction_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaction_id` (`transaction_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `configurations`
--
ALTER TABLE `configurations`
  ADD CONSTRAINT `configurations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `genieacs_credentials`
--
ALTER TABLE `genieacs_credentials`
  ADD CONSTRAINT `fk_user_genieacs` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `mac_vendor_cache`
--
ALTER TABLE `mac_vendor_cache`
  ADD CONSTRAINT `to_users_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `map_connections`
--
ALTER TABLE `map_connections`
  ADD CONSTRAINT `map_connections_ibfk_1` FOREIGN KEY (`from_item_id`) REFERENCES `map_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `map_connections_ibfk_2` FOREIGN KEY (`to_item_id`) REFERENCES `map_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `map_items`
--
ALTER TABLE `map_items`
  ADD CONSTRAINT `map_items_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `map_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `odc_config`
--
ALTER TABLE `odc_config`
  ADD CONSTRAINT `odc_config_ibfk_1` FOREIGN KEY (`map_item_id`) REFERENCES `map_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `odp_config`
--
ALTER TABLE `odp_config`
  ADD CONSTRAINT `odp_config_ibfk_1` FOREIGN KEY (`map_item_id`) REFERENCES `map_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `olt_config`
--
ALTER TABLE `olt_config`
  ADD CONSTRAINT `olt_config_ibfk_1` FOREIGN KEY (`map_item_id`) REFERENCES `map_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `olt_pon_ports`
--
ALTER TABLE `olt_pon_ports`
  ADD CONSTRAINT `olt_pon_ports_ibfk_1` FOREIGN KEY (`olt_item_id`) REFERENCES `map_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `onu_config`
--
ALTER TABLE `onu_config`
  ADD CONSTRAINT `onu_config_ibfk_1` FOREIGN KEY (`map_item_id`) REFERENCES `map_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `server_pon_ports`
--
ALTER TABLE `server_pon_ports`
  ADD CONSTRAINT `server_pon_ports_ibfk_1` FOREIGN KEY (`map_item_id`) REFERENCES `map_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `transaction_detail`
--
ALTER TABLE `transaction_detail`
  ADD CONSTRAINT `transaction_detail_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
