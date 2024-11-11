-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-11-2024 a las 08:14:25
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
-- Base de datos: `softwaresignos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patients`
--

CREATE TABLE `patients` (
  `id` int NOT NULL,
  `primer_nombre` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `primer_apellido` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `numero_identificacion` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo_identificacion` enum('cédula de ciudadanía','tarjeta de identidad') COLLATE utf8mb4_general_ci NOT NULL,
  `ubicacion` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('activo','inactivo') COLLATE utf8mb4_general_ci DEFAULT 'activo',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_nacimiento` date NOT NULL DEFAULT '1900-01-01',
  `is_pediatric` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `patients`
--

INSERT INTO `patients` (`id`, `primer_nombre`, `primer_apellido`, `numero_identificacion`, `tipo_identificacion`, `ubicacion`, `status`, `created_at`, `fecha_nacimiento`, `is_pediatric`) VALUES
(1, 'asd', 'asd', '165', 'tarjeta de identidad', '101A', 'activo', '2024-11-01 03:13:36', '2019-06-11', 1),
(2, 'Laura', 'solares', '12354661', 'cédula de ciudadanía', '305A', 'activo', '2024-11-05 12:02:48', '2006-07-04', 0),
(3, 'Prueba ', '2', '00000000000', 'cédula de ciudadanía', '405A', 'activo', '2024-11-06 22:44:47', '2000-08-13', 0),
(5, 'Daya', 'Garcia', '10097654', 'cédula de ciudadanía', 'A204', 'activo', '2024-11-09 03:33:42', '2001-07-11', 0),
(6, 'Aura', 'Lara', '1003383319', 'cédula de ciudadanía', 'A202', 'activo', '2024-11-10 04:18:39', '2003-09-13', 0),
(7, 'Aura Natalia', 'Lara Daza', '10087776', 'cédula de ciudadanía', '409b', 'activo', '2024-11-10 04:26:24', '2004-09-13', 0),
(8, 'Aura', 'Lara', '10038773', 'cédula de ciudadanía', '204A', 'activo', '2024-11-10 05:08:42', '2003-09-13', 0),
(9, 'as', 'asd', '5456', 'cédula de ciudadanía', '10', 'activo', '2024-11-11 04:57:27', '2024-11-10', 1),
(10, 'sdasd', 'asdasd', '22', 'cédula de ciudadanía', '45', 'activo', '2024-11-11 06:19:31', '2000-05-02', 0),
(11, 'aesdf', 'sdfsd', '1500', 'cédula de ciudadanía', '150', 'activo', '2024-11-11 06:26:46', '1222-12-12', 0),
(12, 'weqwe', 'wqewe', '454566', 'cédula de ciudadanía', '56', 'activo', '2024-11-11 06:50:33', '2222-02-22', 1);

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
  `observaciones` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registros_paciente`
--

INSERT INTO `registros_paciente` (`id`, `id_paciente`, `record_date`, `record_time`, `presion_sistolica`, `presion_diastolica`, `presion_media`, `pulso`, `temperatura`, `frecuencia_respiratoria`, `saturacion_oxigeno`, `peso_adulto`, `peso_pediatrico`, `talla`, `observaciones`, `created_at`) VALUES
(1, 2, '2024-11-05', '00:00:00', 500, 90, 77.00, 50, 50.0, 56, 100, 50.000, NULL, 150, 'asad', '2024-11-05 12:03:59'),
(2, 2, '2024-11-08', '03:00:00', 80, 120, 83.00, 50, 35.0, 20, 95, 50.000, NULL, 150, '', '2024-11-05 12:11:12'),
(3, 1, '2024-11-06', '00:00:00', 89, 57, 41.00, 90, 27.0, 100, 89, NULL, 25.0, 120, '', '2024-11-06 07:44:02'),
(4, 1, '2024-11-07', '05:00:00', 55, 100, 68.00, 80, 30.0, 85, 80, NULL, 28.0, 128, '', '2024-11-06 07:45:07'),
(5, 3, '2024-11-03', '11:59:00', 85, 125, 86.00, 90, 37.0, 20, 80, 60.000, NULL, 160, '', '2024-11-06 22:46:52'),
(6, 3, '2024-11-01', '00:00:00', 90, 120, 83.00, 95, 30.0, 25, 90, 80.000, NULL, 170, '', '2024-11-06 22:48:15'),
(7, 3, '2024-11-04', '00:00:00', 70, 100, 69.00, 97, 37.0, 25, 70, 70.000, NULL, 170, '', '2024-11-06 22:49:21'),
(8, 2, '2024-11-14', '00:00:00', 78, 120, 82.00, 70, 28.0, 25, 90, 90.000, NULL, 180, '', '2024-11-07 08:43:34'),
(9, 1, '2024-11-01', '00:00:00', 80, 100, 69.00, 60, 30.0, 25, 89, NULL, 80.0, 180, '.', '2024-11-09 02:46:22'),
(10, 1, '2024-11-08', '00:00:00', 60, 60, 42.00, 60, 60.0, 60, 60, NULL, 60.0, 160, 'kssl', '2024-11-10 05:48:43'),
(11, 11, '2024-11-11', '01:40:00', 80, 120, 83.00, 70, 35.0, 30, 100, 25.000, NULL, 50, '', '2024-11-11 06:44:33'),
(12, 12, '2024-11-11', '01:50:00', 80, 120, 83.00, 80, 35.0, 30, 100, NULL, 25.0, 151, '', '2024-11-11 06:51:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('jefe','staff','user') COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reset_token` varchar(64) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reset_token_expiration` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `profile_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `created_at`, `reset_token`, `reset_token_expiration`, `is_active`, `profile_image`) VALUES
(4, 'laura', '$2a$10$Wa.ffNDP52rf6v2vZfLp5.31cUlK6wR8ss.G23fTwdWi2z4dLmnFa', 'lsolares@unab.edu.co', '', '2024-11-05 12:00:36', NULL, NULL, 1, NULL),
(5, 'laura solares', '$2a$10$8b5luMW51kspEKlPIxMNTecxiahdCl08x4tg5qsbs0gyTc40Ip8/q', 'lauraquintero881120@gmail.com', '', '2024-11-05 12:05:18', NULL, NULL, 1, NULL),
(6, 'Aura', '$2a$10$c/rPAkvhs.DsiU5viHTQfudTtk21hJijekuVWRr90xE95n/fSUtiW', 'alara470@unab.edu.co', 'jefe', '2024-11-06 06:50:57', NULL, NULL, 1, NULL);

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
-- Indices de la tabla `registros_paciente`
--
ALTER TABLE `registros_paciente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`id_paciente`) USING BTREE;

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `nombreU` (`username`) USING BTREE;

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `registros_paciente`
--
ALTER TABLE `registros_paciente`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `registros_paciente`
--
ALTER TABLE `registros_paciente`
  ADD CONSTRAINT `registros_paciente_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `patients` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
