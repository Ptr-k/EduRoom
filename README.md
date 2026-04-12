# EduRoom

EduRoom es una plataforma web  para la gestión de aulas y eventos educativos. Está diseñada para facilitar la administración de espacios, horarios y recursos en instituciones educativas, ofreciendo diferentes niveles de acceso según el rol del usuario como lo es profesor o admin.

## Características Principales del Proyecto

- **Autenticación y Autorización:** Sistema de login seguro basado en JWT (JSON Web Tokens) con control de acceso basado en roles.
- **Gestión de Aulas:** Visualización y administración completa de las aulas del centro educativo.
- **Horarios:** Soporte para la importación de horarios mediante archivos CSV.
- **Códigos QR:** Generación automática de códigos QR para la identificación o gestión rápida de espacios.

## Tecnologías Utilizadas

El proyecto está dividido en dos partes principales: un backend basado en API REST y un frontend moderno contruido con React.

### Backend (API REST)
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security & JWT:** Para proteger el acceso a los endpoints.
- **Spring Data JPA:** Manejo de persistencia de datos.
- **MariaDB:** Base de datos relacional.
- **ZXing:** Generación de códigos QR.
