-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-11-2024 a las 05:38:08
-- Versión del servidor: 8.0.40
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `basedatosprueba`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patients`
--

CREATE TABLE `patients` (
  `id` int NOT NULL,
  `primer_nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `segundo_nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `primer_apellido` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `segundo_apellido` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `numero_identificacion` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tipo_identificacion` enum('cédula de ciudadanía','tarjeta de identidad') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ubicacion` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('activo','inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'activo',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_nacimiento` date NOT NULL DEFAULT '1900-01-01',
  `age_group` enum('Recién nacido','Lactante temprano','Lactante mayor','Niño pequeño','Preescolar temprano','Preescolar tardío','Adulto') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `responsable_username` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `patients`
--

INSERT INTO `patients` (`id`, `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `numero_identificacion`, `tipo_identificacion`, `ubicacion`, `status`, `created_at`, `fecha_nacimiento`, `age_group`, `responsable_username`) VALUES
(1, 'María', 'Luisa', 'Sánchez', 'Torres', '12354661', 'tarjeta de identidad', '102B', 'activo', '2024-01-02 10:00:00', '2007-04-20', 'Adulto', NULL),
(2, 'Pedro', 'Antonio', 'Gómez', 'Rodríguez', '123987456', 'tarjeta de identidad', '103C', 'activo', '2024-01-03 10:00:00', '2010-05-30', 'Adulto', NULL),
(3, 'Maria', 'Isabel', 'Martínez', 'López', '456123789', 'cédula de ciudadanía', '104A', 'activo', '2024-01-04 10:00:00', '2024-11-19', 'Recién nacido', NULL),
(4, 'Luis', 'Fernando', 'Fernández', 'Gutiérrez', '789456123', 'cédula de ciudadanía', '105B', 'activo', '2024-01-05 10:00:00', '1998-09-25', 'Adulto', NULL),
(5, 'Carmen', 'María', 'Rodríguez', 'Sánchez', '852963741', 'tarjeta de identidad', '106C', 'activo', '2024-01-06 10:00:00', '2006-07-22', 'Adulto', NULL),
(6, 'Miguel', 'Ángel', 'González', 'Pérez', '963852741', 'cédula de ciudadanía', '107A', 'activo', '2024-01-07 10:00:00', '2000-11-10', 'Adulto', NULL),
(7, 'Laura', 'Beatriz', 'Sánchez', 'Vázquez', '741963258', 'tarjeta de identidad', '108B', 'activo', '2024-01-08 10:00:00', '2012-03-05', 'Recién nacido', NULL),
(8, 'Roberto', 'Carlos', 'Hernández', 'Jiménez', '369258147', 'cédula de ciudadanía', '109C', 'activo', '2024-01-09 10:00:00', '1995-12-30', 'Adulto', NULL),
(9, 'José', 'Antonio', 'Pérez', 'González', '741852963', 'cédula de ciudadanía', '110A', 'activo', '2024-01-10 10:00:00', '1992-10-15', '', NULL),
(10, 'Isabel', 'María', 'Jiménez', 'Rodríguez', '258741369', 'cédula de ciudadanía', '111B', 'activo', '2024-01-11 10:00:00', '2003-07-18', 'Recién nacido', NULL),
(11, 'Carlos', 'Alberto', 'López', 'Martínez', '123654987', 'cédula de ciudadanía', '112C', 'activo', '2024-01-12 10:00:00', '1990-06-05', '', NULL),
(12, 'Marta', 'Teresa', 'González', 'Vázquez', '258963741', 'tarjeta de identidad', '113A', 'activo', '2024-01-13 10:00:00', '2008-01-23', 'Recién nacido', NULL),
(13, 'Juan', 'Luis', 'Pérez', 'Sánchez', '987456123', 'cédula de ciudadanía', '114B', 'activo', '2024-01-14 10:00:00', '2001-09-12', '', NULL),
(14, 'Javier', 'Ángel', 'Rodríguez', 'Serrano', '654987321', 'tarjeta de identidad', '115C', 'activo', '2024-01-15 10:00:00', '2006-08-09', 'Recién nacido', NULL),
(15, 'Elena', 'Carmen', 'Gómez', 'Martínez', '852741963', 'tarjeta de identidad', '116A', 'activo', '2024-01-16 10:00:00', '2007-02-18', 'Recién nacido', NULL),
(16, 'Ramón', 'José', 'López', 'Fernández', '963258745', 'cédula de ciudadanía', '117B', 'activo', '2024-01-17 10:00:00', '1985-11-05', '', NULL),
(17, 'Susana', 'Isabel', 'Gómez', 'López', '147852369', 'tarjeta de identidad', '118C', 'activo', '2024-01-18 10:00:00', '2013-05-28', 'Recién nacido', NULL),
(18, 'Antonio', 'Fernando', 'Sánchez', 'González', '258741963', 'cédula de ciudadanía', '119A', 'activo', '2024-01-19 10:00:00', '2000-01-10', 'Adulto', NULL),
(19, 'Verónica', 'Carmen', 'Rodríguez', 'Fernández', '741369852', 'cédula de ciudadanía', '120B', 'activo', '2024-01-20 10:00:00', '2002-04-22', 'Recién nacido', NULL),
(20, 'Andrés', 'Martín', 'Serrano', 'Gómez', '369741258', 'cédula de ciudadanía', '121C', 'activo', '2024-01-21 10:00:00', '1997-07-03', 'Adulto', NULL),
(21, 'Paula', 'María', 'Hernández', 'Pérez', '963147259', 'tarjeta de identidad', '122A', 'activo', '2024-01-22 10:00:00', '2011-11-15', 'Recién nacido', NULL),
(22, 'Pedro', 'Luis', 'González', 'Pérez', '963258742', 'cédula de ciudadanía', '123B', 'activo', '2024-01-23 10:00:00', '1990-03-14', '', NULL),
(23, 'Raquel', 'Carmen', 'Martínez', 'López', '741852369', 'cédula de ciudadanía', '124C', 'activo', '2024-01-24 10:00:00', '2003-06-27', 'Recién nacido', NULL),
(24, 'Jorge', 'Luis', 'Gómez', 'Hernández', '741852964', 'cédula de ciudadanía', '125A', 'activo', '2024-01-25 10:00:00', '1982-08-19', '', NULL),
(25, 'Esteban', 'José', 'Sánchez', 'Vázquez', '369258742', 'cédula de ciudadanía', '126B', 'activo', '2024-01-26 10:00:00', '1995-02-02', '', NULL),
(26, 'Gabriela', 'Lucía', 'López', 'Rodríguez', '987654320', 'tarjeta de identidad', '127C', 'activo', '2024-01-27 10:00:00', '2008-05-06', 'Recién nacido', NULL),
(27, 'Sergio', 'Carlos', 'González', 'Serrano', '741258964', 'cédula de ciudadanía', '128A', 'activo', '2024-01-28 10:00:00', '1994-11-18', '', NULL),
(28, 'Beatriz', 'Victoria', 'Martínez', 'Fernández', '852963148', 'cédula de ciudadanía', '129B', 'activo', '2024-01-29 10:00:00', '2005-07-01', 'Adulto', NULL),
(29, 'José', 'Antonio', 'Rodríguez', 'Sánchez', '963741259', 'cédula de ciudadanía', '130C', 'activo', '2024-01-30 10:00:00', '1988-09-16', '', NULL),
(30, 'Mónica', 'Isabel', 'Gómez', 'López', '258963148', 'tarjeta de identidad', '131A', 'activo', '2024-01-31 10:00:00', '2006-12-09', 'Recién nacido', NULL),
(31, 'Hernando', 'José', 'Pérez', 'González', '741369259', 'cédula de ciudadanía', '132B', 'activo', '2024-02-01 10:00:00', '1993-04-23', '', NULL),
(32, 'Cristina', 'María', 'Sánchez', 'Vázquez', '369852148', 'cédula de ciudadanía', '133C', 'activo', '2024-02-02 10:00:00', '2004-03-05', 'Recién nacido', NULL),
(33, 'Francisco', 'Javier', 'González', 'Rodríguez', '852741964', 'cédula de ciudadanía', '134A', 'activo', '2024-02-03 10:00:00', '1997-08-22', '', NULL),
(34, 'Lucía', 'Esther', 'Martínez', 'Serrano', '963258743', 'tarjeta de identidad', '135B', 'activo', '2024-02-04 10:00:00', '2009-06-19', 'Recién nacido', NULL),
(35, 'David', 'Miguel', 'Gómez', 'Hernández', '741258965', 'cédula de ciudadanía', '136C', 'activo', '2024-02-05 10:00:00', '2000-04-14', '', NULL),
(36, 'Julio', 'Alberto', 'Pérez', 'Sánchez', '258369741', 'cédula de ciudadanía', '137A', 'activo', '2024-02-06 10:00:00', '1996-12-17', '', NULL),
(37, 'Sofía', 'María', 'Rodríguez', 'González', '963852146', 'cédula de ciudadanía', '138B', 'activo', '2024-02-07 10:00:00', '2004-05-29', 'Recién nacido', NULL),
(38, 'Martín', 'José', 'Sánchez', 'Rodríguez', '749613', 'cédula de ciudadanía', '139C', 'activo', '2024-02-08 10:00:00', '2002-04-18', 'Recién nacido', NULL),
(39, 'Patricia', 'Ana', 'López', 'Hernández', '258963782', 'cédula de ciudadanía', '140A', 'activo', '2024-02-09 10:00:00', '2001-06-06', 'Recién nacido', NULL),
(40, 'Fernando', 'Luis', 'Gómez', 'Vázquez', '963147358', 'cédula de ciudadanía', '141B', 'activo', '2024-02-10 10:00:00', '1995-07-13', '', NULL),
(41, 'Claudia', 'Elena', 'Martínez', 'Vázquez', '852741453', 'tarjeta de identidad', '142C', 'activo', '2024-02-11 10:00:00', '2007-03-25', 'Adulto', NULL),
(42, 'Rafael', 'Carlos', 'Sánchez', 'Martínez', '745896478', 'tarjeta de identidad', '143A', 'activo', '2024-02-12 10:00:00', '2006-08-16', 'Recién nacido', NULL),
(43, 'Beatriz', 'Diana', 'Rodríguez', 'Martínez', '74586319852', 'cédula de ciudadanía', '144B', 'activo', '2024-02-13 10:00:00', '2003-12-11', 'Adulto', NULL),
(44, 'Francisco', 'José', 'López', 'González', '258741982', 'cédula de ciudadanía', '145C', 'activo', '2024-02-14 10:00:00', '2005-04-22', 'Recién nacido', NULL),
(45, 'Cristina', 'Mónica', 'Gómez', 'Pérez', '74512398', 'cédula de ciudadanía', '146A', 'activo', '2024-02-15 10:00:00', '2004-09-13', 'Recién nacido', NULL),
(46, 'Ricardo', 'José', 'Sánchez', 'González', '7451369745', 'cédula de ciudadanía', '147B', 'activo', '2024-02-16 10:00:00', '1998-10-30', '', NULL),
(47, 'Maria', 'Carolina', 'Pérez', 'Rodríguez', '987654321', 'tarjeta de identidad', '148C', 'activo', '2024-02-17 10:00:00', '2012-10-19', 'Recién nacido', NULL),
(48, 'Esteban', 'Antonio', 'Martínez', 'Rodríguez', '258741765', 'cédula de ciudadanía', '149A', 'activo', '2024-02-18 10:00:00', '2000-12-24', '', NULL),
(49, 'Pablo', 'Enrique', 'López', 'González', '963741486', 'cédula de ciudadanía', '150B', 'activo', '2024-02-19 10:00:00', '1999-11-02', '', NULL),
(50, 'Julia', 'Carmen', 'Sánchez', 'Fernández', '74125698', 'tarjeta de identidad', '151C', 'activo', '2024-02-20 10:00:00', '2010-10-30', 'Recién nacido', NULL),
(51, 'José', 'Luis', 'Martínez', 'González', '78451392', 'tarjeta de identidad', '152A', 'activo', '2024-02-21 10:00:00', '2006-12-15', 'Recién nacido', NULL),
(52, 'Marcela', 'Andrea', 'Rodríguez', 'Gómez', '258963752', 'tarjeta de identidad', '153B', 'activo', '2024-02-22 10:00:00', '2007-07-19', 'Recién nacido', NULL),
(53, 'Tomás', 'Antonio', 'Gómez', 'Martínez', '123574689', 'cédula de ciudadanía', '154C', 'activo', '2024-02-23 10:00:00', '1996-05-12', '', NULL),
(54, 'Ana', 'Isabel', 'Sánchez', 'González', '963852748', 'cédula de ciudadanía', '155A', 'activo', '2024-02-24 10:00:00', '2024-07-10', 'Lactante temprano', 'Laura Quintero'),
(55, 'Fernando', 'Gabriel', 'Martínez', 'Gómez', '258741562', 'cédula de ciudadanía', '156B', 'activo', '2024-02-25 10:00:00', '1987-03-23', '', NULL),
(56, 'Raúl', 'José', 'Sánchez', 'Martínez', '7458623', 'cédula de ciudadanía', '157C', 'activo', '2024-02-26 10:00:00', '1992-02-06', '', NULL),
(57, 'Marta', 'Patricia', 'Rodríguez', 'Fernández', '7456921', 'cédula de ciudadanía', '158A', 'activo', '2024-02-27 10:00:00', '2004-06-18', 'Recién nacido', NULL),
(58, 'Carlos', 'Alberto', 'González', 'Serrano', '258369852', 'cédula de ciudadanía', '159B', 'activo', '2024-02-28 10:00:00', '2000-09-13', 'Adulto', NULL),
(59, 'Lorena', 'Isabel', 'Pérez', 'González', '963741528', 'tarjeta de identidad', '160C', 'activo', '2024-02-29 10:00:00', '2009-11-22', 'Recién nacido', NULL),
(60, 'Juan', 'Carlos', 'Sánchez', 'Vázquez', '7451698', 'cédula de ciudadanía', '161A', 'activo', '2024-03-01 10:00:00', '1996-06-30', '', NULL),
(61, 'Elena', 'Victoria', 'Gómez', 'López', '258963159', 'cédula de ciudadanía', '162B', 'activo', '2024-03-02 10:00:00', '2005-03-02', 'Recién nacido', NULL),
(62, 'Ricardo', 'Antonio', 'Rodríguez', 'Vázquez', '963258369', 'cédula de ciudadanía', '163C', 'activo', '2024-03-03 10:00:00', '1991-07-21', '', NULL),
(63, 'Ángeles', 'María', 'Pérez', 'Sánchez', '7458964', 'cédula de ciudadanía', '164A', 'activo', '2024-03-04 10:00:00', '2003-10-08', 'Recién nacido', NULL),
(64, 'Juliana', 'Patricia', 'González', 'Serrano', '258741947', 'tarjeta de identidad', '165B', 'activo', '2024-03-05 10:00:00', '2009-02-14', 'Recién nacido', NULL),
(65, 'David', 'Luis', 'Rodríguez', 'Fernández', '961452365', 'cédula de ciudadanía', '166C', 'activo', '2024-03-06 10:00:00', '1997-03-03', '', NULL),
(66, 'Beatriz', 'Marta', 'López', 'Martínez', '745626987', 'cédula de ciudadanía', '167A', 'activo', '2024-03-07 10:00:00', '2005-07-10', 'Adulto', NULL),
(67, 'Martín', 'José', 'Rodríguez', 'Serrano', '258741563', 'cédula de ciudadanía', '168B', 'activo', '2024-03-08 10:00:00', '2001-08-25', '', NULL),
(1079044, 'Laura', 'Natalia', 'Solares', 'Quintero', '1054126357', 'cédula de ciudadanía', '405A', 'activo', '2024-11-14 07:49:32', '2003-10-08', '', NULL),
(1079045, 'Pepito', 'Santiago', 'Perez', 'Gonzales', '111111111', 'cédula de ciudadanía', '305N', 'activo', '2024-11-17 05:23:00', '2020-07-17', 'Recién nacido', NULL),
(1079046, 'adasd', 'afas', 'dfasd', 'asdfsd', '15325613', 'cédula de ciudadanía', '565656', 'activo', '2024-11-17 05:38:24', '2024-10-16', 'Recién nacido', NULL),
(1079047, 'ayelen', 'catalina', 'mendoza', 'cabanzo', '1098609421', 'cédula de ciudadanía', '69', 'activo', '2024-11-18 16:44:15', '2004-01-14', '', NULL),
(1079048, 'ewqw', 'qweqw', 'qweqwe', 'qweqwe', '53465132', 'cédula de ciudadanía', '415', 'activo', '2024-11-19 23:12:02', '2024-11-19', 'Recién nacido', NULL),
(1079049, 'hola', 'bkj', 'bhmn ', 'bb', '1234568523', 'cédula de ciudadanía', '45', 'activo', '2024-11-19 23:44:18', '2024-11-19', 'Recién nacido', NULL),
(1079050, 'qweq', 'adas', 'asd', 'dsa', '7894652', 'cédula de ciudadanía', '56', 'activo', '2024-11-20 04:23:53', '2024-11-19', 'Recién nacido', NULL),
(1079051, 'aesfdgf', 'sadb', 'szdxc', 'asfgf', '4865123152', 'cédula de ciudadanía', '562', 'activo', '2024-11-21 03:01:46', '2002-12-26', 'Adulto', NULL),
(1079052, 'eweqw', 'qeqwe', 'eqweqwe', 'qweqewqwe', '465123', 'cédula de ciudadanía', '12', 'activo', '2024-11-21 03:16:03', '2017-01-19', 'Preescolar tardío', NULL),
(1079053, 'adads', 'fvjhbm', 'vjhmvhjbm', 'vhjm nvjhm n', '22222', 'cédula de ciudadanía', '15', 'activo', '2024-11-22 21:29:22', '2010-04-27', 'Adulto', NULL),
(1079054, 'eqdas', 'vjhbmn ', 'vgjhb mn', 'hjbmn ', '33333', 'cédula de ciudadanía', '512', 'activo', '2024-11-22 21:30:37', '2010-04-27', 'Adulto', NULL),
(1079055, 'qsa', 'q', 'qqq', 'q', '55555', 'cédula de ciudadanía', '1235', 'activo', '2024-11-23 02:13:49', '2024-11-22', 'Recién nacido', NULL),
(1079059, 'w', 'w', 'w', 'w', '74512', 'cédula de ciudadanía', '5', 'activo', '2024-11-25 17:13:26', '2020-02-22', 'Preescolar temprano', 'Laura Quintero');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros_paciente`
--

CREATE TABLE `registros_paciente` (
  `id` int NOT NULL,
  `id_paciente` int NOT NULL,
  `record_date` date NOT NULL,
  `record_time` time NOT NULL,
  `presion_sistolica` int DEFAULT NULL,
  `presion_diastolica` int DEFAULT NULL,
  `presion_media` decimal(5,2) DEFAULT NULL,
  `pulso` int DEFAULT NULL,
  `temperatura` decimal(4,1) DEFAULT NULL,
  `frecuencia_respiratoria` int DEFAULT NULL,
  `saturacion_oxigeno` int DEFAULT NULL,
  `peso_adulto` decimal(6,3) DEFAULT NULL,
  `peso_pediatrico` decimal(4,1) DEFAULT NULL,
  `talla` int DEFAULT NULL,
  `observaciones` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `responsable_signos` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registros_paciente`
--

INSERT INTO `registros_paciente` (`id`, `id_paciente`, `record_date`, `record_time`, `presion_sistolica`, `presion_diastolica`, `presion_media`, `pulso`, `temperatura`, `frecuencia_respiratoria`, `saturacion_oxigeno`, `peso_adulto`, `peso_pediatrico`, `talla`, `observaciones`, `created_at`, `responsable_signos`) VALUES
(13, 1, '2024-11-16', '18:54:00', 80, 120, 83.00, 70, 35.0, 25, 100, NULL, 25.0, 150, '', '2024-11-16 23:55:35', NULL),
(14, 3, '2024-11-16', '18:57:00', 80, 120, 83.00, 60, 36.0, 70, 100, 45.000, NULL, 120, '', '2024-11-16 23:57:43', NULL),
(15, 1, '2024-11-17', '19:08:00', 80, 120, 83.00, 75, 35.0, 30, 100, 45.000, NULL, 120, '', '2024-11-17 00:08:33', NULL),
(16, 43, '2024-11-17', '23:42:00', 80, 120, 83.00, 70, 35.0, 70, 100, NULL, 45.0, 150, '', '2024-11-17 04:42:57', NULL),
(17, 47, '2024-11-17', '00:19:00', 110, 78, 83.00, 70, 35.0, 50, 100, NULL, 51.0, 150, '', '2024-11-17 05:20:09', NULL),
(18, 47, '2024-11-17', '00:44:00', 120, 80, 55.00, 55, 35.0, 11, 90, NULL, 45.0, 150, '', '2024-11-17 05:48:41', NULL),
(19, 47, '2024-11-17', '00:55:00', 120, 80, 83.00, 70, 36.5, 20, 100, NULL, 50.0, 150, '', '2024-11-17 05:57:15', NULL),
(20, 58, '2024-11-18', '07:54:00', 80, 120, 83.00, 80, 35.0, 30, 100, 48.000, NULL, 150, '', '2024-11-18 12:54:26', NULL),
(21, 1, '2024-11-18', '08:12:00', 80, 120, 83.00, 70, 36.0, 30, 100, 54.000, NULL, 120, '', '2024-11-18 13:13:31', NULL),
(22, 1, '2024-11-18', '08:49:00', 80, 120, 83.00, 50, 30.0, 50, 100, 86.000, NULL, 150, '', '2024-11-18 13:50:21', NULL),
(23, 31, '2024-11-18', '08:51:00', 80, 120, 83.00, 40, 34.0, 50, 100, 50.000, NULL, 120, '', '2024-11-18 13:51:46', NULL),
(24, 1, '2024-11-18', '09:06:00', 80, 120, 83.00, 80, 25.0, 60, 100, 50.000, NULL, 120, '', '2024-11-18 14:07:43', NULL),
(25, 1, '2024-11-18', '09:35:00', 80, 120, 83.00, 50, 35.0, 50, 100, 50.000, NULL, 150, '', '2024-11-18 14:35:45', NULL),
(26, 1, '2024-11-18', '09:50:00', 80, 120, 83.00, 50, 36.0, 50, 100, 50.000, NULL, 150, '', '2024-11-18 14:51:51', NULL),
(27, 1079047, '2024-11-18', '11:44:00', 100, 90, 83.00, 80, 35.0, 30, 100, 56.000, NULL, 150, '', '2024-11-18 16:44:53', NULL),
(28, 3, '2024-11-19', '21:48:00', 80, 120, 83.00, 50, 35.0, 30, 100, 45.000, NULL, 150, '', '2024-11-19 02:49:15', NULL),
(29, 47, '2024-11-19', '17:06:00', 90, 70, 83.00, 50, 30.0, 30, 100, NULL, 50.0, 120, '', '2024-11-19 22:07:03', NULL),
(30, 47, '2024-11-19', '17:10:00', 120, 80, 83.00, 50, 35.0, 30, 100, NULL, 50.0, 120, '', '2024-11-19 22:11:04', NULL),
(31, 47, '2024-11-19', '17:12:00', 120, 80, 83.00, 58, 35.0, 50, 100, NULL, 50.0, 120, '', '2024-11-19 22:13:00', NULL),
(32, 47, '2024-09-03', '17:16:00', 120, 80, 83.00, 50, 30.0, 50, 100, NULL, 12.0, 120, '', '2024-11-19 22:28:14', NULL),
(33, 47, '2024-09-03', '18:09:00', 120, 80, 83.00, 80, 35.0, 30, 100, NULL, 20.0, 120, '', '2024-11-19 23:09:55', NULL),
(34, 54, '2024-09-15', '22:52:00', 120, 80, 83.00, 50, 35.0, 50, 100, NULL, 20.0, 120, '', '2024-11-20 03:53:08', NULL),
(35, 47, '2024-11-19', '17:16:00', 120, 80, 83.00, 50, 30.0, 50, 100, NULL, 20.0, 150, '', '2024-11-20 04:08:28', NULL),
(36, 47, '2024-10-15', '17:54:00', 120, 80, 83.00, 52, 35.0, 35, 100, NULL, 20.0, 150, '', '2024-11-20 22:55:05', NULL),
(37, 47, '2024-10-01', '17:55:00', 110, 80, 76.00, 40, 35.0, 30, 80, NULL, 20.0, 120, '', '2024-11-20 22:55:54', NULL),
(38, 47, '2024-09-24', '22:56:00', 100, 50, 68.00, 40, 35.0, 50, 100, NULL, 20.0, 120, '', '2024-11-20 22:57:15', NULL),
(39, 47, '2024-09-15', '17:57:00', 90, 70, 62.00, 40, 35.0, 50, 85, NULL, 20.0, 120, '', '2024-11-20 22:57:40', NULL),
(40, 47, '2024-09-03', '21:00:00', 120, 80, 83.00, 50, 34.0, 50, 100, NULL, 20.0, 120, '', '2024-11-20 22:58:06', NULL),
(41, 47, '2024-10-02', '21:58:00', 120, 88, 83.00, 50, 35.0, 50, 100, NULL, 20.0, 120, '', '2024-11-20 22:58:32', NULL),
(42, 47, '2024-09-15', '23:03:00', 90, 55, 62.00, 50, 35.0, 50, 100, NULL, 20.0, 120, '', '2024-11-20 22:59:18', NULL),
(43, 47, '2024-09-26', '22:59:00', 120, 80, 83.00, 50, 35.0, 50, 100, NULL, 20.0, 120, '', '2024-11-20 22:59:51', NULL),
(44, 47, '2024-09-15', '18:00:00', 120, 80, 83.00, 50, 35.0, 25, 100, NULL, 20.0, 150, '', '2024-11-20 23:00:49', NULL),
(45, 47, '2024-09-03', '22:02:00', 120, 80, 83.00, 50, 25.0, 50, 100, NULL, 20.0, 120, '', '2024-11-20 23:02:29', NULL),
(46, 54, '2024-11-21', '17:31:00', 120, 80, 83.00, 52, 35.0, 52, 100, 20.000, NULL, 120, '', '2024-11-21 22:31:17', NULL),
(47, 54, '2024-11-21', '17:40:00', 120, 80, 83.00, 50, 35.0, 50, 100, NULL, 20.0, 20, '', '2024-11-21 22:40:47', NULL),
(48, 54, '2024-11-22', '23:29:00', 120, 80, 83.00, 88, 35.0, 50, 100, NULL, 20.0, 120, '', '2024-11-22 04:30:22', NULL),
(49, 54, '2024-11-22', '23:39:00', 120, 80, 83.00, 50, 50.0, 50, 10, NULL, 20.0, 120, '', '2024-11-22 04:39:47', NULL),
(50, 54, '2024-11-22', '23:44:00', 120, 80, 83.00, 50, 35.0, 55, 10, NULL, 20.0, 120, '', '2024-11-22 04:44:40', NULL),
(51, 54, '2024-11-22', '23:45:00', 120, 80, 83.00, 55, 55.0, 12, 40, NULL, 20.0, 120, '', '2024-11-22 04:46:02', NULL),
(52, 54, '2024-11-22', '23:46:00', 120, 80, 83.00, 55, 35.0, 12, 100, NULL, 20.0, 120, '', '2024-11-22 04:46:41', NULL),
(53, 54, '2024-11-22', '10:25:00', 120, 80, 83.00, 40, 35.0, 50, 100, NULL, 20.0, 120, '', '2024-11-22 15:26:15', NULL),
(54, 47, '2024-11-22', '10:27:00', 120, 80, 83.00, 45, 35.0, 50, 100, NULL, 20.0, 120, '', '2024-11-22 15:27:28', NULL),
(55, 54, '2024-11-22', '16:26:00', 120, 80, 83.00, 50, 35.0, 50, 100, NULL, 20.0, 120, '', '2024-11-22 21:26:49', NULL),
(56, 1079054, '2024-11-22', '16:30:00', 120, 80, 83.00, 50, 35.0, 50, 100, 25.000, NULL, 120, '', '2024-11-22 21:30:57', NULL),
(57, 54, '2024-11-25', '15:01:00', 120, 80, 83.00, 50, 25.0, 50, 100, NULL, 20.0, 120, '', '2024-11-25 20:01:36', NULL),
(58, 54, '2024-11-26', '22:50:00', 120, 80, 83.00, 50, 35.0, 50, 100, NULL, 20.0, 120, '', '2024-11-26 03:50:20', NULL),
(59, 54, '2024-11-26', '22:58:00', 120, 80, 83.00, 55, 35.0, 55, 100, NULL, 20.0, 120, '', '2024-11-26 03:58:55', 'Laura Quintero');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('jefe','staff','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reset_token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reset_token_expiration` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `profile_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numero_identificacion` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `created_at`, `reset_token`, `reset_token_expiration`, `is_active`, `profile_image`, `numero_identificacion`) VALUES
(23, 'Alejandra26', '$2a$10$7Fdcdtgi14GCxSlMtZbrG.HbmK64PD8X/PGzjlZ3d.y.2nJcxa7yK', 'alejandra.hdez.2616@gmial.com', 'jefe', '2024-11-16 17:41:07', NULL, NULL, 1, 'profile-1731778867152-593037909.jpg', '1091967574'),
(24, 'Laura Quintero', '$2a$10$4QjKIOQOj3a8.raQBl.3FO.JcIcrmp7em6L1NqOkPOk3sZQEg8Fde', 'lauraquintero881120@gmail.com', 'jefe', '2024-11-16 19:33:09', 'bf8d8b908a3f116abad05b935b6e2f0286db3eb204e034185ffc84059d3a1b22', '2024-11-18 12:39:58', 1, NULL, '1005542019'),
(28, 'Laura Solares', '$2a$10$fOX4eqp2J5Xg2awPrgEWFeL3oAIPzy3LFEbYp.ZtwwHybim0Siwsm', 'lsolares@unab.edu.co', 'user', '2024-11-18 19:20:40', NULL, NULL, 1, 'profile-1731219618162-263993875.jpg', '10967574569');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_identificacion` (`numero_identificacion`),
  ADD KEY `fk_responsable_username` (`responsable_username`);

--
-- Indices de la tabla `registros_paciente`
--
ALTER TABLE `registros_paciente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`id_paciente`) USING BTREE,
  ADD KEY `fk_responsable_signos` (`responsable_signos`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `nombreU` (`username`) USING BTREE,
  ADD UNIQUE KEY `numero_identificacion` (`numero_identificacion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1079060;

--
-- AUTO_INCREMENT de la tabla `registros_paciente`
--
ALTER TABLE `registros_paciente`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `fk_responsable_username` FOREIGN KEY (`responsable_username`) REFERENCES `users` (`username`);

--
-- Filtros para la tabla `registros_paciente`
--
ALTER TABLE `registros_paciente`
  ADD CONSTRAINT `fk_responsable_signos` FOREIGN KEY (`responsable_signos`) REFERENCES `users` (`username`) ON DELETE SET NULL,
  ADD CONSTRAINT `registros_paciente_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `patients` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
