-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 27, 2025 at 10:29 AM
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
-- Database: `auth_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `seat_id` int(11) NOT NULL,
  `travel_date` date NOT NULL,
  `payment_amount` int(11) NOT NULL,
  `departure_location` varchar(255) NOT NULL,
  `destination_location` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `bus_id`, `seat_id`, `travel_date`, `payment_amount`, `departure_location`, `destination_location`) VALUES
(2, 3, 97, '2025-03-18', 600, 'Mymensingh', 'Rajshahi'),
(3, 2, 56, '2025-03-20', 550, 'Jamalpur', 'Rajshahi'),
(5, 1, 1, '2025-03-27', 600, 'Mymensingh', 'Rajshahi'),
(6, 1, 2, '2025-03-27', 600, 'Mymensingh', 'Rajshahi'),
(7, 1, 3, '2025-03-27', 600, 'Mymensingh', 'Rajshahi'),
(8, 3, 81, '2025-03-27', 600, 'Mymensingh', 'Rajshahi'),
(9, 1, 1, '2025-03-28', 600, 'Mymensingh', 'Rajshahi');

-- --------------------------------------------------------

--
-- Table structure for table `buses`
--

CREATE TABLE `buses` (
  `id` int(11) NOT NULL,
  `bus_name` varchar(255) NOT NULL,
  `bus_type` varchar(255) NOT NULL,
  `total_seats` int(11) NOT NULL,
  `departure_location` varchar(255) NOT NULL,
  `destination_location` varchar(255) NOT NULL,
  `departure_time` time NOT NULL,
  `arrival_time` time NOT NULL,
  `fare` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buses`
--

INSERT INTO `buses` (`id`, `bus_name`, `bus_type`, `total_seats`, `departure_location`, `destination_location`, `departure_time`, `arrival_time`, `fare`) VALUES
(1, 'Shamim Enterprise', 'Day Coach', 40, 'Mymensingh', 'Rajshahi', '07:00:00', '14:00:00', 600),
(2, 'Himachol Enterprise', 'Day Coach', 40, 'Jamalpur', 'Rajshahi', '14:00:00', '20:00:00', 550),
(3, 'Tuhin Enterprise', 'Day Coach', 40, 'Mymensingh', 'Rajshahi', '14:30:00', '21:00:00', 600);

-- --------------------------------------------------------

--
-- Table structure for table `seats`
--

CREATE TABLE `seats` (
  `id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `seat_number` varchar(10) NOT NULL,
  `booked` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `seats`
--

INSERT INTO `seats` (`id`, `bus_id`, `seat_number`, `booked`) VALUES
(1, 1, '1', 0),
(2, 1, '2', 0),
(3, 1, '3', 0),
(4, 1, '4', 0),
(5, 1, '5', 0),
(6, 1, '6', 0),
(7, 1, '7', 0),
(8, 1, '8', 0),
(9, 1, '9', 0),
(10, 1, '10', 0),
(11, 1, '11', 0),
(12, 1, '12', 0),
(13, 1, '13', 0),
(14, 1, '14', 0),
(15, 1, '15', 0),
(16, 1, '16', 0),
(17, 1, '17', 0),
(18, 1, '18', 0),
(19, 1, '19', 0),
(20, 1, '20', 0),
(21, 1, '21', 0),
(22, 1, '22', 0),
(23, 1, '23', 0),
(24, 1, '24', 0),
(25, 1, '25', 0),
(26, 1, '26', 0),
(27, 1, '27', 0),
(28, 1, '28', 0),
(29, 1, '29', 0),
(30, 1, '30', 0),
(31, 1, '31', 0),
(32, 1, '32', 0),
(33, 1, '33', 0),
(34, 1, '34', 0),
(35, 1, '35', 0),
(36, 1, '36', 0),
(37, 1, '37', 0),
(38, 1, '38', 0),
(39, 1, '39', 0),
(40, 1, '40', 0),
(41, 2, '1', 0),
(42, 2, '2', 0),
(43, 2, '3', 0),
(44, 2, '4', 0),
(45, 2, '5', 0),
(46, 2, '6', 0),
(47, 2, '7', 0),
(48, 2, '8', 0),
(49, 2, '9', 0),
(50, 2, '10', 0),
(51, 2, '11', 0),
(52, 2, '12', 0),
(53, 2, '13', 0),
(54, 2, '14', 0),
(55, 2, '15', 0),
(56, 2, '16', 0),
(57, 2, '17', 0),
(58, 2, '18', 0),
(59, 2, '19', 0),
(60, 2, '20', 0),
(61, 2, '21', 0),
(62, 2, '22', 0),
(63, 2, '23', 0),
(64, 2, '24', 0),
(65, 2, '25', 0),
(66, 2, '26', 0),
(67, 2, '27', 0),
(68, 2, '28', 0),
(69, 2, '29', 0),
(70, 2, '30', 0),
(71, 2, '31', 0),
(72, 2, '32', 0),
(73, 2, '33', 0),
(74, 2, '34', 0),
(75, 2, '35', 0),
(76, 2, '36', 0),
(77, 2, '37', 0),
(78, 2, '38', 0),
(79, 2, '39', 0),
(80, 2, '40', 0),
(81, 3, '1', 0),
(82, 3, '2', 0),
(83, 3, '3', 0),
(84, 3, '4', 0),
(85, 3, '5', 0),
(86, 3, '6', 0),
(87, 3, '7', 0),
(88, 3, '8', 0),
(89, 3, '9', 0),
(90, 3, '10', 0),
(91, 3, '11', 0),
(92, 3, '12', 0),
(93, 3, '13', 0),
(94, 3, '14', 0),
(95, 3, '15', 0),
(96, 3, '16', 0),
(97, 3, '17', 0),
(98, 3, '18', 0),
(99, 3, '19', 0),
(100, 3, '20', 0),
(101, 3, '21', 0),
(102, 3, '22', 0),
(103, 3, '23', 0),
(104, 3, '24', 0),
(105, 3, '25', 0),
(106, 3, '26', 0),
(107, 3, '27', 0),
(108, 3, '28', 0),
(109, 3, '29', 0),
(110, 3, '30', 0),
(111, 3, '31', 0),
(112, 3, '32', 0),
(113, 3, '33', 0),
(114, 3, '34', 0),
(115, 3, '35', 0),
(116, 3, '36', 0),
(117, 3, '37', 0),
(118, 3, '38', 0),
(119, 3, '39', 0),
(120, 3, '40', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','employee') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(2, 'Lihan', 'lihanahmed655@gmail.com', '$2b$10$Zy.16v86qmUJXJ6U1xhcbOwY9Ovsa7hZvmnOPtWORjxsIsYfxE4we', 'user', '2025-03-19 23:19:51'),
(3, 'Lihan Ahmed', 'lihan1903016@gmail.com', '$2b$10$sQ93N/Ahe0MfT5ghuwnSc.JJPi40AFiXiry0GxB8JU6rWHkHVwI0C', 'employee', '2025-03-19 23:21:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bus_id` (`bus_id`,`seat_id`,`travel_date`),
  ADD KEY `seat_id` (`seat_id`);

--
-- Indexes for table `buses`
--
ALTER TABLE `buses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bus_id` (`bus_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `buses`
--
ALTER TABLE `buses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `seats`
--
ALTER TABLE `seats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `seats`
--
ALTER TABLE `seats`
  ADD CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
