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

### Frontend
- **Vite + React**
- **Javascript**


---

## Puesta en Marcha (Operativa)

1) Backend (Spring Boot)
- Puerto: 8080
- Requisitos: Java 17, MariaDB local o Docker
- Variables importantes (application.properties):
  - spring.datasource.url=jdbc:mariadb://localhost:3306/eduroom_db
  - spring.datasource.username=root
  - spring.datasource.password=123456 (o 1234 si usas docker-compose)
  - app.frontend.url=http://localhost:3000

Cómo arrancar localmente:
- Arranca MariaDB y asegúrate de tener creada la base eduroom_db (puedes usar backend/db/schema.sql para inicializar).
- Ejecuta la aplicación (desde IDE o con: mvn spring-boot:run dentro de backend).

2) Frontend (Vite + React)
- Puerto: 3000 (por defecto)
- Requisitos: Node 18+

Cómo arrancar:
- cd frontend
- npm install
- npm run dev

3) Con Docker Compose (opcional)
- docker-compose up --build
- Puertos: DB 3306, Backend 8080, Frontend 443->80 (Nginx del contenedor)

## Credenciales de Prueba (Semilla de Datos)
- ADMIN: admin@eduroom.com / admin123
- PROFESOR: profesor@eduroom.com / profesor123

Se crean automáticamente al iniciar el backend gracias a DataInitializer.

## Seguridad (Spring Security + JWT)

Rutas públicas:
- POST /api/auth/login (login)
- GET  /api/eventos/{id}/qr (QR público para registro)

Rutas protegidas por token (JWT en Authorization: Bearer <token>):
- Cualquier otra ruta /api/** requiere estar autenticado

Rutas protegidas por rol (autenticación + autorización):
- /api/admin/** -> requiere rol ADMIN
- /api/user/**  -> requiere rol ADMIN o PROFESOR
- POST/DELETE /api/centros/** -> requiere rol ADMIN

El backend añade al SecurityContext el usuario autenticado mediante un filtro JWT que valida el token en cada petición.