# EduRoom 🏫

EduRoom es una plataforma web moderna para la gestión integral de aulas, centros y eventos educativos. Está diseñada para facilitar la administración de espacios, recursos y personal en instituciones educativas, ofreciendo una experiencia de usuario _premium_ con distintos niveles de acceso según el rol del usuario (Administrador o Profesor).

---

## Características Destacadas

### 1. Sistema de Control de Asistencia mediante QR
Una de las funcionalidades más potentes de EduRoom es el registro automatizado para actividades extraescolares:
- **Generación Dinámica:** Cada actividad creada genera automáticamente un código QR único y una URL de registro pública.
- **Registro sin Login:** Los asistentes externos pueden registrar su asistencia escaneando el código QR sin necesidad de tener cuenta en la plataforma.
- **Monitoreo en Tiempo Real:** Los creadores de la actividad pueden visualizar la lista de asistentes registrados al instante, incluyendo la marca de tiempo exacta del registro.
- **Integridad de Datos:** Implementación de borrado en cascada para asegurar que, al eliminar una actividad, todos los registros de asistencia asociados se limpien correctamente de la base de datos.
- **Auto-Limpieza Inteligente:** Sistema programado que elimina automáticamente eventos y reservas cuya fecha y hora de fin ya han pasado, manteniendo la base de datos optimizada e higienizada.

### 2. Gestión de Centros y Personal
- **Control Granular:** Los administradores tienen visión global de todos los centros, mientras que los profesores operan exclusivamente dentro de su centro asignado.
- **Menú de Opciones del Centro:** Los administradores disponen de un panel de control específico por centro para la gestión de personal (alta de profesores) y administración del propio centro (eliminación segura).
- **Seguridad JWT:** Toda la comunicación está protegida por tokens JWT, garantizando que solo personal autorizado acceda a los datos sensibles.

### 3. Administración de Espacios y Reservas
- **Gestión de Aulas:** Visualización detallada de la capacidad y equipamiento de cada aula.
- **Sistema de Reservas:** Motor de reservas que permite gestionar el uso de espacios por fecha y hora, evitando solapamientos y gestionando estados (Activa, En Espera, Cancelada).
- **Vinculación Directa:** Las actividades extraescolares están vinculadas directamente al centro, garantizando visibilidad total incluso si son creadas por personal administrativo global.

### 4. Herramientas de Auditoría y Seguridad
- **Acceso Público Controlado:** Configuración avanzada de seguridad que permite el registro de asistencia público por QR sin comprometer la integridad del resto de la API.
- **Logs del Sistema:** Los administradores pueden descargar directamente desde la interfaz los archivos de registro (`logs`) para auditorías de seguridad y depuración técnica.
- **Zona de Peligro:** Implementación de un sistema de eliminación de cuenta con doble confirmación para proteger la privacidad y el derecho al olvido de los usuarios.

### 5. Interfaz de Usuario Premium
- **Diseño Glassmorphism:** Una estética moderna basada en transparencias, desenfoques y gradientes vibrantes que ofrecen un aspecto profesional y tecnológico.
- **Detalle Enriquecido:** Las vistas de detalle muestran ahora información contextual clave, como quién ha reservado cada actividad o el número de alumnos inscritos en tiempo real.
- **Responsive Design:** Totalmente adaptado para su uso en tablets y ordenadores, permitiendo la gestión desde cualquier lugar.

---

## Tecnologías Utilizadas

El proyecto sigue una arquitectura de cliente-servidor (Frontend/Backend) comunicados mediante una API REST.

### Backend (API REST)
- **Java 17 & Spring Boot 3.2.0**
- **Spring Security & JWT:** Autenticación y autorización basada en roles.
- **Spring Data JPA & Hibernate:** ORM para la persistencia en MariaDB.
- **ZXing (Zebra Crossing):** Biblioteca para la generación eficiente de códigos QR.
- **Lombok:** Para un código backend más limpio y legible.
- **Spring Task Scheduling:** Para la ejecución de tareas automatizadas de limpieza en segundo plano.

### Frontend
- **React (Vite):** Framework principal para una SPA rápida y reactiva.
- **Vanilla CSS:** Uso avanzado de variables, Flexbox/Grid y efectos visuales de última generación sin dependencias externas pesadas.
- **Axios:** Gestión de peticiones asíncronas al servidor.
- **React Router:** Sistema de navegación fluido entre módulos.

---

## Mejoras Recientes e Incidencias Resueltas

> [!TIP]
> - **Sincronización de Actividades:** Se ha corregido la visibilidad de actividades extraescolares para usuarios administradores mediante vinculación directa por ID de centro.
> - **Robustez de la API:** Se ha habilitado el acceso público al endpoint de registro por QR y se han completado los endpoints de consulta de reservas por ID.

- **Plan de Pruebas:** Ejecución de casos de uso reales con validación de resultados.
- **Seguridad Certificada:** Validación de flujo de tokens y protección de rutas.
- **Respaldo de Datos:** Documentación de procesos de backup y restauración.
- **Bitácora de Desarrollo:** Registro de incidencias resueltas durante el ciclo de vida del proyecto.

### Mantenimiento y Backups

Se incluyen scripts automatizados en PowerShell para facilitar la gestión de la base de datos:

```powershell
# Crear un punto de restauración actual
.\scripts\backup.ps1

# Restaurar la base de datos a un estado previo
.\scripts\restore.ps1 -BackupFile ".\backups\backup_eduroom_XXXX.sql"
```

---

## Instalación y Ejecución

1. **Backend:** Configurar `application.properties` con las credenciales de MariaDB y ejecutar `./mvnw spring-boot:run`.
2. **Frontend:** Ejecutar `npm install` seguido de `npm run dev` en la carpeta `frontend`.
3. **Logs:** Asegurarse de que el directorio `logs/` tenga permisos de escritura.

### Ejecución con Docker

Para levantar toda la infraestructura (BD + Backend + Frontend) de forma automática:

```bash
# Construir y levantar los contenedores
docker-compose up --build -d

# Ver el estado de los servicios
docker-compose ps
```

- **Frontend:** [http://localhost](http://localhost) (Puerto 80)
- **Backend API:** [http://localhost:8080/api](http://localhost:8080/api)
- **Base de Datos:** localhost:3306 (User: root / Pass: 1234)

---

## Estructura de Contenedores

- **eduroom_db**: Servidor MariaDB con el esquema inicial cargado.
- **eduroom_backend**: Aplicación Spring Boot con `healthcheck` y reconexión automática.
- **eduroom_frontend**: Servidor Nginx que sirve los estáticos de React y actúa como proxy inverso hacia la API.

