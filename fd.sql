-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 07, 2025 at 03:29 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

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
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `config_key` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `config_value` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Generic key-value configuration storage';

-- --------------------------------------------------------

--
-- Table structure for table `device_monitoring`
--

CREATE TABLE `device_monitoring` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `device_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('online','offline') COLLATE utf8mb4_general_ci NOT NULL,
  `notified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Device status change history for monitoring and notifications';

-- --------------------------------------------------------

--
-- Table structure for table `genieacs_credentials`
--

CREATE TABLE `genieacs_credentials` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `host` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `port` int DEFAULT '7557',
  `username` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_connected` tinyint(1) DEFAULT '0',
  `last_test` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='GenieACS TR-069 ACS connection settings (single active config only)';

-- --------------------------------------------------------

--
-- Table structure for table `mac_vendor_cache`
--

CREATE TABLE `mac_vendor_cache` (
  `oui` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'First 6 characters of MAC address (OUI)',
  `vendor_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cached_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cache for MAC address vendor lookups to reduce API calls';

-- --------------------------------------------------------

--
-- Table structure for table `map_connections`
--

CREATE TABLE `map_connections` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `from_item_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `to_item_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `connection_type` enum('online','offline') COLLATE utf8mb4_general_ci DEFAULT 'online',
  `path_coordinates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

-- --------------------------------------------------------

--
-- Table structure for table `map_items`
--

CREATE TABLE `map_items` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `item_type` enum('server','isp','mikrotik','olt','odc','odp','onu') COLLATE utf8mb4_general_ci NOT NULL,
  `parent_id` char(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `genieacs_device_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('online','offline','unknown') COLLATE utf8mb4_general_ci DEFAULT 'unknown',
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

-- --------------------------------------------------------

--
-- Table structure for table `mikrotik_credentials`
--

CREATE TABLE `mikrotik_credentials` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `host` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `port` int DEFAULT '8728',
  `username` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `is_connected` tinyint(1) DEFAULT '0',
  `last_test` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='MikroTik RouterOS API connection settings (single active config only)';

-- --------------------------------------------------------

--
-- Table structure for table `odc_config`
--

CREATE TABLE `odc_config` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `map_item_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `olt_pon_port_id` int DEFAULT NULL,
  `server_id` int DEFAULT NULL COMMENT 'Reference to parent Server for child ODCs',
  `server_pon_port` int DEFAULT NULL,
  `port_count` int NOT NULL,
  `parent_attenuation_db` decimal(5,2) DEFAULT '0.00',
  `calculated_power` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ODC configuration with port management';

-- --------------------------------------------------------

--
-- Table structure for table `odp_config`
--

CREATE TABLE `odp_config` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `map_item_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `odc_port` int DEFAULT NULL,
  `input_power` decimal(5,2) DEFAULT NULL,
  `parent_odp_port` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'For cascading ODPs: port from parent ODP (e.g., "20%", "80%")',
  `port_count` int NOT NULL,
  `use_splitter` tinyint(1) DEFAULT '0',
  `use_secondary_splitter` tinyint(1) DEFAULT '0' COMMENT 'Enable secondary/cascading splitter',
  `secondary_splitter_ratio` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Secondary splitter ratio (e.g., "1:2", "1:8")',
  `custom_secondary_ratio_output_port` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'For custom secondary ratios: which port user selected',
  `splitter_ratio` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'e.g., "1:2", "1:8", "20:80", "30:70", "50:50"',
  `custom_ratio_output_port` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'For custom ratios (20:80, 30:70, 50:50): which port user selected for output',
  `calculated_power` decimal(5,2) DEFAULT NULL COMMENT 'Power AFTER splitter (user-facing value)',
  `port_rx_power` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

-- --------------------------------------------------------

--
-- Table structure for table `olt_config`
--

CREATE TABLE `olt_config` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `map_item_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `output_power` decimal(5,2) DEFAULT '2.00',
  `pon_count` int DEFAULT '1',
  `attenuation_db` decimal(5,2) DEFAULT '0.00',
  `olt_link` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='OLT configuration with PON ports';

-- --------------------------------------------------------

--
-- Table structure for table `olt_pon_ports`
--

CREATE TABLE `olt_pon_ports` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `olt_item_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `pon_number` int NOT NULL,
  `output_power` decimal(5,2) DEFAULT '9.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Individual OLT PON port power settings';

-- --------------------------------------------------------

--
-- Table structure for table `onu_config`
--

CREATE TABLE `onu_config` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `map_item_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `odp_port` int DEFAULT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `genieacs_device_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ONU/ONT customer premises equipment configuration';

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint NOT NULL,
  `role_name` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
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
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `map_item_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `port_number` int NOT NULL,
  `output_power` decimal(5,2) DEFAULT '2.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Server PON port output power configuration';

-- --------------------------------------------------------

--
-- Table structure for table `telegram_callback_cache`
--

CREATE TABLE `telegram_callback_cache` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `cache_key` varchar(255) NOT NULL,
  `cache_data` text NOT NULL COMMENT 'Serialized or JSON data',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Stores pagination and button state for inline keyboards';

-- --------------------------------------------------------

--
-- Table structure for table `telegram_config`
--

CREATE TABLE `telegram_config` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `bot_token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `chat_id` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `is_connected` tinyint(1) DEFAULT '0',
  `last_test` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Telegram bot API configuration (single active config only)';

-- --------------------------------------------------------

--
-- Table structure for table `telegram_permissions`
--

CREATE TABLE `telegram_permissions` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `permission_key` varchar(100) NOT NULL COMMENT 'Unique permission identifier',
  `permission_name` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(50) DEFAULT NULL COMMENT 'device, report, notification, map, admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Available permissions for role-based access control';

--
-- Dumping data for table `telegram_permissions`
--

INSERT INTO `telegram_permissions` (`id`, `permission_key`, `permission_name`, `description`, `category`) VALUES
('a1f3b8e4-9c4f-4c1a-8b2d-7f8e6d1a2c3b', 'device.view', 'View Devices', 'View device list and details', 'device'),
('b2c4d9f5-1d6e-4a2b-9c3f-8e9f7d2b4d5e', 'device.summon', 'Summon Devices', 'Trigger device connection request', 'device'),
('c3d5eaf6-2e7f-4b3c-0d4a-9f0e8c3f5e6d', 'device.edit_wifi', 'Edit WiFi', 'Change device WiFi configuration', 'device'),
('d4e6fb07-3f8a-4c4d-1e5b-0a1f9d4g6h7i', 'device.search', 'Search Devices', 'Search and filter devices', 'device'),
('e5f7gc18-4g9b-4d5e-2f6c-1b2g0h5i7j8k', 'notification.subscribe', 'Subscribe Notifications', 'Subscribe to device notifications', 'notification'),
('f6g8hd29-5h0c-4e6f-3g7d-2c3h1i6j8k9l', 'notification.view', 'View Subscriptions', 'View own subscriptions', 'notification'),
('07h9ie30-6i1d-4f7g-4h8e-3d4i2j7k9l0m', 'report.view', 'View Reports', 'Generate on-demand reports', 'report'),
('18i0jf41-7j2e-4g8h-5i9f-4e5j3k8l0m1n', 'report.schedule', 'Schedule Reports', 'Create and manage report schedules', 'report'),
('29j1kg52-8k3f-4h9i-6j0g-5f6k4l9m1n2o', 'map.view', 'View Map', 'View device locations and GPS', 'map'),
('30k2lh63-9l4g-4i0j-7k1h-6g7l5m0n2o3p', 'admin.user_manage', 'Manage Users', 'Add, edit, remove users and roles', 'admin'),
('41l3mi74-0m5h-4j1k-8l2i-7h8m6n1o3p4q', 'admin.config', 'System Configuration', 'Access system configuration', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `telegram_report_logs`
--

CREATE TABLE `telegram_report_logs` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `chat_id` varchar(255) NOT NULL,
  `report_type` enum('daily','weekly') NOT NULL,
  `report_date` date NOT NULL COMMENT 'Date the report covers',
  `sent_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_devices` int NOT NULL DEFAULT '0',
  `online_devices` int NOT NULL DEFAULT '0',
  `offline_devices` int NOT NULL DEFAULT '0',
  `new_online_count` int NOT NULL DEFAULT '0' COMMENT 'Devices that came online',
  `new_offline_count` int NOT NULL DEFAULT '0' COMMENT 'Devices that went offline',
  `offline_24h_count` int NOT NULL DEFAULT '0' COMMENT 'Devices offline > 24 hours',
  `poor_signal_count` int NOT NULL DEFAULT '0' COMMENT 'Devices with poor signal (<-25 dBm)',
  `report_data` text COMMENT 'JSON data with detailed statistics'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='History of all sent reports for analytics';

-- --------------------------------------------------------

--
-- Table structure for table `telegram_report_schedules`
--

CREATE TABLE `telegram_report_schedules` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `chat_id` varchar(255) NOT NULL,
  `report_type` enum('daily','weekly') NOT NULL DEFAULT 'daily',
  `schedule_time` time NOT NULL DEFAULT '08:00:00' COMMENT 'Time to send report (HH:MM:SS)',
  `schedule_day` tinyint(1) DEFAULT NULL COMMENT 'Day of week for weekly reports (0=Sunday, 6=Saturday)',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='User preferences for automated daily/weekly reports';

-- --------------------------------------------------------

--
-- Table structure for table `telegram_role_permissions`
--

CREATE TABLE `telegram_role_permissions` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
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
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `chat_id` varchar(255) NOT NULL,
  `device_id` varchar(255) NOT NULL,
  `device_serial` varchar(255) DEFAULT NULL,
  `subscribed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='User subscriptions for device status notifications';

-- --------------------------------------------------------

--
-- Table structure for table `telegram_users`
--

CREATE TABLE `telegram_users` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `chat_id` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL COMMENT 'Telegram username',
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `role` enum('admin','operator','viewer') NOT NULL DEFAULT 'viewer',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `chat_id` varchar(255) NOT NULL,
  `session_type` varchar(50) NOT NULL COMMENT 'editwifi, search, etc',
  `session_data` text COMMENT 'JSON data for the session',
  `current_step` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Stores multi-step wizard sessions (WiFi edit, etc)';

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` char(13) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` smallint NOT NULL,
  `role_id` bigint NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'default.png',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Web dashboard user authentication';

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `first_name`, `last_name`, `phone`, `email`, `password`, `status`, `role_id`, `image`, `created_at`, `updated_at`) VALUES
('1', 'user', 'User', '-', NULL, 'user@email.com', '$2y$12$KK8uA4gbevAlLyy.4COlWuM9OaRz9Cgw/PE17RDlYscL45E/Jxyxm', 1, 1, 'default.png', '2025-11-22 11:44:45', '2025-11-30 13:54:27'),
('1be06acd-6d8b-47cf-a2b2-41db67746260', 'fullo', 'M Taufik', 'Saefulloh', '08123456789', 'fullo@email.com', '$2b$12$3s5IFy6qs3joQii9BH41NORy6Jq3WnVRmEwjeO0.q/t8o286NFI3i', 1, 2, 'default.png', '2025-12-05 14:34:40', '2025-12-07 03:23:05');

-- --------------------------------------------------------

--
-- Structure for view `telegram_user_permissions`
--
DROP TABLE IF EXISTS `telegram_user_permissions`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `telegram_user_permissions`  AS SELECT `tu`.`chat_id` AS `chat_id`, `tu`.`username` AS `username`, `tu`.`role` AS `role`, `tu`.`is_active` AS `is_active`, `tp`.`permission_key` AS `permission_key`, `tp`.`permission_name` AS `permission_name`, `tp`.`category` AS `category` FROM ((`telegram_users` `tu` join `telegram_role_permissions` `trp` on((`tu`.`role` = `trp`.`role`))) join `telegram_permissions` `tp` on((`trp`.`permission_key` = `tp`.`permission_key`))) WHERE (`tu`.`is_active` = 1)  ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `configurations`
--
ALTER TABLE `configurations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `config_key` (`config_key`);

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
  ADD UNIQUE KEY `unique_host_port` (`host`,`port`);

--
-- Indexes for table `mac_vendor_cache`
--
ALTER TABLE `mac_vendor_cache`
  ADD PRIMARY KEY (`oui`),
  ADD KEY `idx_cached_at` (`cached_at`);

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
-- AUTO_INCREMENT for table `configurations`
--
-- ALTER TABLE `configurations`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `device_monitoring`
--
-- ALTER TABLE `device_monitoring`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `map_connections`
--
-- ALTER TABLE `map_connections`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `map_items`
--
-- ALTER TABLE `map_items`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mikrotik_credentials`
--
-- ALTER TABLE `mikrotik_credentials`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `odc_config`
--
-- ALTER TABLE `odc_config`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `odp_config`
--
-- ALTER TABLE `odp_config`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `olt_config`
--
-- ALTER TABLE `olt_config`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `olt_pon_ports`
--
-- ALTER TABLE `olt_pon_ports`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `onu_config`
--
-- ALTER TABLE `onu_config`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `server_pon_ports`
--
-- ALTER TABLE `server_pon_ports`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `telegram_callback_cache`
--
-- ALTER TABLE `telegram_callback_cache`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `telegram_config`
--
-- ALTER TABLE `telegram_config`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `telegram_permissions`
--
-- ALTER TABLE `telegram_permissions`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `telegram_report_logs`
--
-- ALTER TABLE `telegram_report_logs`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `telegram_report_schedules`
--
-- ALTER TABLE `telegram_report_schedules`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `telegram_role_permissions`
--
-- ALTER TABLE `telegram_role_permissions`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `telegram_subscriptions`
--
-- ALTER TABLE `telegram_subscriptions`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `telegram_users`
--
-- ALTER TABLE `telegram_users`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `telegram_user_sessions`
--
-- ALTER TABLE `telegram_user_sessions`
--   MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

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
-- Constraints for table `server_pon_ports`
--
ALTER TABLE `server_pon_ports`
  ADD CONSTRAINT `server_pon_ports_ibfk_1` FOREIGN KEY (`map_item_id`) REFERENCES `map_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
