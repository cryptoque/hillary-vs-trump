# noinspection SqlNoDataSourceInspectionForFile

-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 06, 2016 at 04:13 PM
-- Server version: 10.0.27-MariaDB-0+deb8u1
-- PHP Version: 5.6.24-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `hillary-vs-trump`
--

-- --------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `hillary-vs-trump` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `hillary-vs-trump`;


--
-- Table structure for table `country-lookup`
--

CREATE TABLE IF NOT EXISTS `country-lookup` (
`id` int(11) NOT NULL,
  `hash` varchar(40) NOT NULL,
  `country` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE IF NOT EXISTS `votes` (
`id` int(11) NOT NULL,
  `ts` int(11) NOT NULL,
  `hash` varchar(40) NOT NULL,
  `vote` varchar(1) NOT NULL,
  `country` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `country-lookup`
--
ALTER TABLE `country-lookup`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `hash` (`hash`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `country-lookup`
--
ALTER TABLE `country-lookup`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
