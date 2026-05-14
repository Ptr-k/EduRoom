-- ============================================
-- EduRoom - script para la creacion de bbdd (Auto-init)
-- ============================================

-- tabla de centros
CREATE TABLE IF NOT EXISTS centros (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         nombre VARCHAR(255) NOT NULL UNIQUE,
                         horario_inicio TIME NOT NULL DEFAULT '08:15:00',
                         horario_fin TIME NOT NULL DEFAULT '14:45:00',
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          nombre VARCHAR(255) NOT NULL,
                          email VARCHAR(255) NOT NULL UNIQUE,
                          password_hash VARCHAR(255) NOT NULL,
                          rol ENUM('ADMIN', 'PROFESOR') NOT NULL,
                          id_centro BIGINT,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          deleted_at TIMESTAMP NULL,
                          FOREIGN KEY (id_centro) REFERENCES centros(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tabla de aulas
CREATE TABLE IF NOT EXISTS aulas (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       nombre VARCHAR(100) NOT NULL,
                       capacidad INT DEFAULT NULL,
                       id_centro BIGINT NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       FOREIGN KEY (id_centro) REFERENCES centros(id) ON DELETE CASCADE,
                       UNIQUE KEY unique_aula_centro (nombre, id_centro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          id_aula BIGINT NOT NULL,
                          id_profesor BIGINT NOT NULL,
                          fecha DATE NOT NULL,
                          hora_inicio TIME NOT NULL,
                          hora_fin TIME NOT NULL,
                          asignatura VARCHAR(255),
                          estado ENUM('ACTIVA', 'EN_ESPERA', 'CANCELADA') NOT NULL DEFAULT 'ACTIVA',
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (id_aula) REFERENCES aulas(id) ON DELETE CASCADE,
                          FOREIGN KEY (id_profesor) REFERENCES usuarios(id) ON DELETE CASCADE,
                          INDEX idx_fecha_aula (fecha, id_aula),
                          INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tabla de eventos
CREATE TABLE IF NOT EXISTS eventos (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         titulo VARCHAR(255) NOT NULL,
                         descripcion TEXT,
                         lugar VARCHAR(255),
                         fecha DATE NOT NULL,
                         hora_inicio TIME NOT NULL,
                         hora_fin TIME NOT NULL,
                         qr_token VARCHAR(255) UNIQUE,
                         qr_expiracion DATETIME,
                         id_creador BIGINT NOT NULL,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         FOREIGN KEY (id_creador) REFERENCES usuarios(id) ON DELETE CASCADE,
                         INDEX idx_fecha (fecha),
                         INDEX idx_qr_token (qr_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tabla de asistencias
CREATE TABLE IF NOT EXISTS asistencias (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             id_evento BIGINT NOT NULL,
                             nombre_alumno VARCHAR(255) NOT NULL,
                             timestamp_checkin DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             ip_origen VARCHAR(45),
                             FOREIGN KEY (id_evento) REFERENCES eventos(id) ON DELETE CASCADE,
                             INDEX idx_evento (id_evento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tabla de logs
CREATE TABLE IF NOT EXISTS logs (
                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                      id_usuario BIGINT,
                      accion VARCHAR(100) NOT NULL,
                      descripcion TEXT,
                      timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      ip VARCHAR(45),
                      FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL,
                      INDEX idx_usuario (id_usuario),
                      INDEX idx_timestamp (timestamp),
                      INDEX idx_accion (accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DATOS DE PRUEBA (Solo si no existen)
INSERT IGNORE INTO centros (id, nombre, horario_inicio, horario_fin) VALUES
    (1, 'IES Sotero Hernandez', '08:15:00', '14:45:00');

INSERT IGNORE INTO usuarios (id, nombre, email, password_hash, rol, id_centro) VALUES
    (1, 'Administrador Principal', 'admin@eduroom.com', '$2a$10$XQxNk5ZqJ8vK9mH3nL2pO.qR7sT1uV3wX5yZ7aB9cD1eF3gH5iJ7k', 'ADMIN', 1);

INSERT IGNORE INTO usuarios (id, nombre, email, password_hash, rol, id_centro) VALUES
    (2, 'Profesor Ejemplo', 'profesor@eduroom.com', '$2a$10$XQxNk5ZqJ8vK9mH3nL2pO.qR7sT1uV3wX5yZ7aB9cD1eF3gH5iJ7k', 'PROFESOR', 1);

INSERT IGNORE INTO aulas (id, nombre, capacidad, id_centro) VALUES
    (1, 'Aula 101', 30, 1),
    (2, 'Aula 102', 25, 1),
    (3, 'Laboratorio Informática', 20, 1),
    (4, 'Gimnasio', 50, 1);
