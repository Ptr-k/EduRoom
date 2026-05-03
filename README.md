# EduRoom

EduRoom es una plataforma web moderna para la gestión integral de aulas, centros y eventos educativos. Está diseñada para facilitar la administración de espacios, recursos y personal en instituciones educativas, ofreciendo una experiencia de usuario _premium_ con distintos niveles de acceso según el rol del usuario (Administrador o Profesor).

## Características Principales del Proyecto

- **Autenticación y Autorización:** Sistema de login seguro basado en JWT (JSON Web Tokens) con control de acceso granular basado en roles.
- **Gestión Multi-Centro:** Los administradores pueden gestionar múltiples centros educativos, mientras que los profesores acceden directamente a su centro asignado.
- **Creación y Gestión de Profesores:** Los administradores pueden registrar nuevos profesores y asignarlos directamente a un centro específico mediante formularios seguros.
- **Aulas y Reservas:** Visualización, creación y administración completa de aulas y reservas por fecha. Control en tiempo real de espacios disponibles.
- **Actividades Extraescolares:** Creación de actividades asociadas a los centros, con un diseño intuitivo.
- **Configuración de Cuenta y Logs:** 
  - Zona de peligro: Los usuarios pueden eliminar sus propias cuentas permanentemente con un sistema de doble verificación.
  - Auditoría: Los administradores pueden descargar los _logs_ del sistema completos directamente desde el panel de control para depuración y análisis de seguridad.
- **Códigos QR:** Generación automática de códigos QR para la identificación y el registro público rápido en eventos.
- **Diseño Premium:** Interfaz _glassmorphism_ moderna, atractiva, oscura y responsiva en React.

## Tecnologías Utilizadas

El proyecto sigue una arquitectura de cliente-servidor (Frontend/Backend) comunicados mediante una API REST.

### Backend (API REST)
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security & JWT:** Para proteger y validar el acceso a los endpoints.
- **Spring Data JPA & Hibernate:** Manejo y mapeo de persistencia de datos.
- **MariaDB:** Base de datos relacional robusta.
- **ZXing:** Generación de códigos QR.

### Frontend
- **React (con Vite):** Framework y empaquetador para una experiencia ágil de desarrollo.
- **Vanilla CSS:** Uso avanzado de variables, CSS Modules, diseño responsivo, Flexbox/Grid y _glassmorphism_ sin frameworks adicionales.
- **Axios:** Cliente HTTP para la comunicación con el Backend.
- **React Router:** Para navegación SPA (Single Page Application) sin recargas.

---

_Para consultar los detalles completos de despliegue, la estructura de base de datos, arquitectura y todos los módulos desarrollados, consulta el archivo [Documentación Operativa](DOCUMENTACION_OPERATIVA.md)._