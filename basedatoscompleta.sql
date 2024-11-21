-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-11-2024 a las 06:21:34
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
-- Base de datos: `basedatoscompleta`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patients`
--

CREATE TABLE `patients` (
  `id` int NOT NULL,
  `primer_nombre` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `segundo_nombre` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `primer_apellido` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `segundo_apellido` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `numero_identificacion` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo_identificacion` enum('cédula de ciudadanía','tarjeta de identidad') COLLATE utf8mb4_general_ci NOT NULL,
  `ubicacion` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('activo','inactivo') COLLATE utf8mb4_general_ci DEFAULT 'activo',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_nacimiento` date NOT NULL DEFAULT '1900-01-01',
  `age_group` enum('Recién nacido','Lactante temprano','Lactante mayor','Niño pequeño','Preescolar temprano','Preescolar tardío','Adulto') COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `patients`
--

INSERT INTO `patients` (`id`, `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `numero_identificacion`, `tipo_identificacion`, `ubicacion`, `status`, `created_at`, `fecha_nacimiento`, `age_group`) VALUES
(1, 'María', 'Luisa', 'Sánchez', 'Torres', '12354661', 'tarjeta de identidad', '102B', 'activo', '2024-01-02 10:00:00', '2007-04-20', 'Adulto'),
(2, 'Pedro', 'Antonio', 'Gómez', 'Rodríguez', '123987456', 'tarjeta de identidad', '103C', 'activo', '2024-01-03 10:00:00', '2010-05-30', 'Adulto'),
(3, 'Maria', 'Isabel', 'Martínez', 'López', '456123789', 'cédula de ciudadanía', '104A', 'activo', '2024-01-04 10:00:00', '2024-11-19', 'Recién nacido'),
(4, 'Luis', 'Fernando', 'Fernández', 'Gutiérrez', '789456123', 'cédula de ciudadanía', '105B', 'activo', '2024-01-05 10:00:00', '1998-09-25', 'Adulto'),
(5, 'Carmen', 'María', 'Rodríguez', 'Sánchez', '852963741', 'tarjeta de identidad', '106C', 'activo', '2024-01-06 10:00:00', '2006-07-22', 'Adulto'),
(6, 'Miguel', 'Ángel', 'González', 'Pérez', '963852741', 'cédula de ciudadanía', '107A', 'activo', '2024-01-07 10:00:00', '2000-11-10', 'Adulto'),
(7, 'Laura', 'Beatriz', 'Sánchez', 'Vázquez', '741963258', 'tarjeta de identidad', '108B', 'activo', '2024-01-08 10:00:00', '2012-03-05', 'Recién nacido'),
(8, 'Roberto', 'Carlos', 'Hernández', 'Jiménez', '369258147', 'cédula de ciudadanía', '109C', 'activo', '2024-01-09 10:00:00', '1995-12-30', 'Adulto'),
(9, 'José', 'Antonio', 'Pérez', 'González', '741852963', 'cédula de ciudadanía', '110A', 'activo', '2024-01-10 10:00:00', '1992-10-15', ''),
(10, 'Isabel', 'María', 'Jiménez', 'Rodríguez', '258741369', 'cédula de ciudadanía', '111B', 'activo', '2024-01-11 10:00:00', '2003-07-18', 'Recién nacido'),
(11, 'Carlos', 'Alberto', 'López', 'Martínez', '123654987', 'cédula de ciudadanía', '112C', 'activo', '2024-01-12 10:00:00', '1990-06-05', ''),
(12, 'Marta', 'Teresa', 'González', 'Vázquez', '258963741', 'tarjeta de identidad', '113A', 'activo', '2024-01-13 10:00:00', '2008-01-23', 'Recién nacido'),
(13, 'Juan', 'Luis', 'Pérez', 'Sánchez', '987456123', 'cédula de ciudadanía', '114B', 'activo', '2024-01-14 10:00:00', '2001-09-12', ''),
(14, 'Javier', 'Ángel', 'Rodríguez', 'Serrano', '654987321', 'tarjeta de identidad', '115C', 'activo', '2024-01-15 10:00:00', '2006-08-09', 'Recién nacido'),
(15, 'Elena', 'Carmen', 'Gómez', 'Martínez', '852741963', 'tarjeta de identidad', '116A', 'activo', '2024-01-16 10:00:00', '2007-02-18', 'Recién nacido'),
(16, 'Ramón', 'José', 'López', 'Fernández', '963258745', 'cédula de ciudadanía', '117B', 'activo', '2024-01-17 10:00:00', '1985-11-05', ''),
(17, 'Susana', 'Isabel', 'Gómez', 'López', '147852369', 'tarjeta de identidad', '118C', 'activo', '2024-01-18 10:00:00', '2013-05-28', 'Recién nacido'),
(18, 'Antonio', 'Fernando', 'Sánchez', 'González', '258741963', 'cédula de ciudadanía', '119A', 'activo', '2024-01-19 10:00:00', '2000-01-10', 'Adulto'),
(19, 'Verónica', 'Carmen', 'Rodríguez', 'Fernández', '741369852', 'cédula de ciudadanía', '120B', 'activo', '2024-01-20 10:00:00', '2002-04-22', 'Recién nacido'),
(20, 'Andrés', 'Martín', 'Serrano', 'Gómez', '369741258', 'cédula de ciudadanía', '121C', 'activo', '2024-01-21 10:00:00', '1997-07-03', 'Adulto'),
(21, 'Paula', 'María', 'Hernández', 'Pérez', '963147259', 'tarjeta de identidad', '122A', 'activo', '2024-01-22 10:00:00', '2011-11-15', 'Recién nacido'),
(22, 'Pedro', 'Luis', 'González', 'Pérez', '963258742', 'cédula de ciudadanía', '123B', 'activo', '2024-01-23 10:00:00', '1990-03-14', ''),
(23, 'Raquel', 'Carmen', 'Martínez', 'López', '741852369', 'cédula de ciudadanía', '124C', 'activo', '2024-01-24 10:00:00', '2003-06-27', 'Recién nacido'),
(24, 'Jorge', 'Luis', 'Gómez', 'Hernández', '741852964', 'cédula de ciudadanía', '125A', 'activo', '2024-01-25 10:00:00', '1982-08-19', ''),
(25, 'Esteban', 'José', 'Sánchez', 'Vázquez', '369258742', 'cédula de ciudadanía', '126B', 'activo', '2024-01-26 10:00:00', '1995-02-02', ''),
(26, 'Gabriela', 'Lucía', 'López', 'Rodríguez', '987654320', 'tarjeta de identidad', '127C', 'activo', '2024-01-27 10:00:00', '2008-05-06', 'Recién nacido'),
(27, 'Sergio', 'Carlos', 'González', 'Serrano', '741258964', 'cédula de ciudadanía', '128A', 'activo', '2024-01-28 10:00:00', '1994-11-18', ''),
(28, 'Beatriz', 'Victoria', 'Martínez', 'Fernández', '852963148', 'cédula de ciudadanía', '129B', 'activo', '2024-01-29 10:00:00', '2005-07-01', 'Adulto'),
(29, 'José', 'Antonio', 'Rodríguez', 'Sánchez', '963741259', 'cédula de ciudadanía', '130C', 'activo', '2024-01-30 10:00:00', '1988-09-16', ''),
(30, 'Mónica', 'Isabel', 'Gómez', 'López', '258963148', 'tarjeta de identidad', '131A', 'activo', '2024-01-31 10:00:00', '2006-12-09', 'Recién nacido'),
(31, 'Hernando', 'José', 'Pérez', 'González', '741369259', 'cédula de ciudadanía', '132B', 'activo', '2024-02-01 10:00:00', '1993-04-23', ''),
(32, 'Cristina', 'María', 'Sánchez', 'Vázquez', '369852148', 'cédula de ciudadanía', '133C', 'activo', '2024-02-02 10:00:00', '2004-03-05', 'Recién nacido'),
(33, 'Francisco', 'Javier', 'González', 'Rodríguez', '852741964', 'cédula de ciudadanía', '134A', 'activo', '2024-02-03 10:00:00', '1997-08-22', ''),
(34, 'Lucía', 'Esther', 'Martínez', 'Serrano', '963258743', 'tarjeta de identidad', '135B', 'activo', '2024-02-04 10:00:00', '2009-06-19', 'Recién nacido'),
(35, 'David', 'Miguel', 'Gómez', 'Hernández', '741258965', 'cédula de ciudadanía', '136C', 'activo', '2024-02-05 10:00:00', '2000-04-14', ''),
(36, 'Julio', 'Alberto', 'Pérez', 'Sánchez', '258369741', 'cédula de ciudadanía', '137A', 'activo', '2024-02-06 10:00:00', '1996-12-17', ''),
(37, 'Sofía', 'María', 'Rodríguez', 'González', '963852146', 'cédula de ciudadanía', '138B', 'activo', '2024-02-07 10:00:00', '2004-05-29', 'Recién nacido'),
(38, 'Martín', 'José', 'Sánchez', 'Rodríguez', '749613', 'cédula de ciudadanía', '139C', 'activo', '2024-02-08 10:00:00', '2002-04-18', 'Recién nacido'),
(39, 'Patricia', 'Ana', 'López', 'Hernández', '258963782', 'cédula de ciudadanía', '140A', 'activo', '2024-02-09 10:00:00', '2001-06-06', 'Recién nacido'),
(40, 'Fernando', 'Luis', 'Gómez', 'Vázquez', '963147358', 'cédula de ciudadanía', '141B', 'activo', '2024-02-10 10:00:00', '1995-07-13', ''),
(41, 'Claudia', 'Elena', 'Martínez', 'Vázquez', '852741453', 'tarjeta de identidad', '142C', 'activo', '2024-02-11 10:00:00', '2007-03-25', 'Adulto'),
(42, 'Rafael', 'Carlos', 'Sánchez', 'Martínez', '745896478', 'tarjeta de identidad', '143A', 'activo', '2024-02-12 10:00:00', '2006-08-16', 'Recién nacido'),
(43, 'Beatriz', 'Diana', 'Rodríguez', 'Martínez', '74586319852', 'cédula de ciudadanía', '144B', 'activo', '2024-02-13 10:00:00', '2003-12-11', 'Adulto'),
(44, 'Francisco', 'José', 'López', 'González', '258741982', 'cédula de ciudadanía', '145C', 'activo', '2024-02-14 10:00:00', '2005-04-22', 'Recién nacido'),
(45, 'Cristina', 'Mónica', 'Gómez', 'Pérez', '74512398', 'cédula de ciudadanía', '146A', 'activo', '2024-02-15 10:00:00', '2004-09-13', 'Recién nacido'),
(46, 'Ricardo', 'José', 'Sánchez', 'González', '7451369745', 'cédula de ciudadanía', '147B', 'activo', '2024-02-16 10:00:00', '1998-10-30', ''),
(47, 'Maria', 'Carolina', 'Pérez', 'Rodríguez', '987654321', 'tarjeta de identidad', '148C', 'activo', '2024-02-17 10:00:00', '2012-10-19', 'Recién nacido'),
(48, 'Esteban', 'Antonio', 'Martínez', 'Rodríguez', '258741765', 'cédula de ciudadanía', '149A', 'activo', '2024-02-18 10:00:00', '2000-12-24', ''),
(49, 'Pablo', 'Enrique', 'López', 'González', '963741486', 'cédula de ciudadanía', '150B', 'activo', '2024-02-19 10:00:00', '1999-11-02', ''),
(50, 'Julia', 'Carmen', 'Sánchez', 'Fernández', '74125698', 'tarjeta de identidad', '151C', 'activo', '2024-02-20 10:00:00', '2010-10-30', 'Recién nacido'),
(51, 'José', 'Luis', 'Martínez', 'González', '78451392', 'tarjeta de identidad', '152A', 'activo', '2024-02-21 10:00:00', '2006-12-15', 'Recién nacido'),
(52, 'Marcela', 'Andrea', 'Rodríguez', 'Gómez', '258963752', 'tarjeta de identidad', '153B', 'activo', '2024-02-22 10:00:00', '2007-07-19', 'Recién nacido'),
(53, 'Tomás', 'Antonio', 'Gómez', 'Martínez', '123574689', 'cédula de ciudadanía', '154C', 'activo', '2024-02-23 10:00:00', '1996-05-12', ''),
(54, 'Ana', 'Isabel', 'Sánchez', 'González', '963852748', 'cédula de ciudadanía', '155A', 'activo', '2024-02-24 10:00:00', '2024-11-20', 'Recién nacido'),
(55, 'Fernando', 'Gabriel', 'Martínez', 'Gómez', '258741562', 'cédula de ciudadanía', '156B', 'activo', '2024-02-25 10:00:00', '1987-03-23', ''),
(56, 'Raúl', 'José', 'Sánchez', 'Martínez', '7458623', 'cédula de ciudadanía', '157C', 'activo', '2024-02-26 10:00:00', '1992-02-06', ''),
(57, 'Marta', 'Patricia', 'Rodríguez', 'Fernández', '7456921', 'cédula de ciudadanía', '158A', 'activo', '2024-02-27 10:00:00', '2004-06-18', 'Recién nacido'),
(58, 'Carlos', 'Alberto', 'González', 'Serrano', '258369852', 'cédula de ciudadanía', '159B', 'activo', '2024-02-28 10:00:00', '2000-09-13', 'Adulto'),
(59, 'Lorena', 'Isabel', 'Pérez', 'González', '963741528', 'tarjeta de identidad', '160C', 'activo', '2024-02-29 10:00:00', '2009-11-22', 'Recién nacido'),
(60, 'Juan', 'Carlos', 'Sánchez', 'Vázquez', '7451698', 'cédula de ciudadanía', '161A', 'activo', '2024-03-01 10:00:00', '1996-06-30', ''),
(61, 'Elena', 'Victoria', 'Gómez', 'López', '258963159', 'cédula de ciudadanía', '162B', 'activo', '2024-03-02 10:00:00', '2005-03-02', 'Recién nacido'),
(62, 'Ricardo', 'Antonio', 'Rodríguez', 'Vázquez', '963258369', 'cédula de ciudadanía', '163C', 'activo', '2024-03-03 10:00:00', '1991-07-21', ''),
(63, 'Ángeles', 'María', 'Pérez', 'Sánchez', '7458964', 'cédula de ciudadanía', '164A', 'activo', '2024-03-04 10:00:00', '2003-10-08', 'Recién nacido'),
(64, 'Juliana', 'Patricia', 'González', 'Serrano', '258741947', 'tarjeta de identidad', '165B', 'activo', '2024-03-05 10:00:00', '2009-02-14', 'Recién nacido'),
(65, 'David', 'Luis', 'Rodríguez', 'Fernández', '961452365', 'cédula de ciudadanía', '166C', 'activo', '2024-03-06 10:00:00', '1997-03-03', ''),
(66, 'Beatriz', 'Marta', 'López', 'Martínez', '745626987', 'cédula de ciudadanía', '167A', 'activo', '2024-03-07 10:00:00', '2005-07-10', 'Adulto'),
(67, 'Martín', 'José', 'Rodríguez', 'Serrano', '258741563', 'cédula de ciudadanía', '168B', 'activo', '2024-03-08 10:00:00', '2001-08-25', ''),
(1079044, 'Laura', 'Natalia', 'Solares', 'Quintero', '1054126357', 'cédula de ciudadanía', '405A', 'activo', '2024-11-14 07:49:32', '2003-10-08', ''),
(1079045, 'Pepito', 'Santiago', 'Perez', 'Gonzales', '111111111', 'cédula de ciudadanía', '305N', 'activo', '2024-11-17 05:23:00', '2020-07-17', 'Recién nacido'),
(1079046, 'adasd', 'afas', 'dfasd', 'asdfsd', '15325613', 'cédula de ciudadanía', '565656', 'activo', '2024-11-17 05:38:24', '2024-10-16', 'Recién nacido'),
(1079047, 'ayelen', 'catalina', 'mendoza', 'cabanzo', '1098609421', 'cédula de ciudadanía', '69', 'activo', '2024-11-18 16:44:15', '2004-01-14', ''),
(1079048, 'ewqw', 'qweqw', 'qweqwe', 'qweqwe', '53465132', 'cédula de ciudadanía', '415', 'activo', '2024-11-19 23:12:02', '2024-11-19', 'Recién nacido'),
(1079049, 'hola', 'bkj', 'bhmn ', 'bb', '1234568523', 'cédula de ciudadanía', '45', 'activo', '2024-11-19 23:44:18', '2024-11-19', 'Recién nacido'),
(1079050, 'qweq', 'adas', 'asd', 'dsa', '7894652', 'cédula de ciudadanía', '56', 'activo', '2024-11-20 04:23:53', '2024-11-19', 'Recién nacido'),
(1079051, 'aesfdgf', 'sadb', 'szdxc', 'asfgf', '4865123152', 'cédula de ciudadanía', '562', 'activo', '2024-11-21 03:01:46', '2002-12-26', 'Adulto'),
(1079052, 'eweqw', 'qeqwe', 'eqweqwe', 'qweqewqwe', '465123', 'cédula de ciudadanía', '12', 'activo', '2024-11-21 03:16:03', '2017-01-19', 'Preescolar tardío');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_identificacion` (`numero_identificacion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1079053;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
