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

### 2. Gestión Multi-Centro y de Personal
- **Control Granular:** Los administradores tienen visión global de todos los centros, mientras que los profesores operan exclusivamente dentro de su centro asignado.
- **Alta de Profesores:** Interfaz segura para que los administradores registren nuevos docentes, vinculándolos directamente a un centro específico desde su creación.
- **Seguridad JWT:** Toda la comunicación está protegida por tokens JWT, garantizando que solo personal autorizado acceda a los datos sensibles.

### 3. Administración de Espacios y Reservas
- **Gestión de Aulas:** Visualización detallada de la capacidad y equipamiento de cada aula.
- **Sistema de Reservas:** Motor de reservas que permite gestionar el uso de espacios por fecha y hora, evitando solapamientos y optimizando el uso de los recursos.

### 4. Herramientas de Auditoría y Seguridad
- **Logs del Sistema:** Los administradores pueden descargar directamente desde la interfaz los archivos de registro (`logs`) para auditorías de seguridad y depuración técnica.
- **Zona de Peligro:** Implementación de un sistema de eliminación de cuenta con doble confirmación para proteger la privacidad y el derecho al olvido de los usuarios.

### 5. Interfaz de Usuario Premium
- **Diseño Glassmorphism:** Una estética moderna basada en transparencias, desenfoques y gradientes vibrantes que ofrecen un aspecto profesional y tecnológico.
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

### Frontend
- **React (Vite):** Framework principal para una SPA rápida y reactiva.
- **Vanilla CSS:** Uso avanzado de variables, Flexbox/Grid y efectos visuales de última generación sin dependencias externas pesadas.
- **Axios:** Gestión de peticiones asíncronas al servidor.
- **React Router:** Sistema de navegación fluido entre módulos.

---

## Verificación e Integración Final

> [!IMPORTANT]
> **ESTADO DEL PROYECTO: ESTABLE Y VALIDADO**  
> El sistema ha superado con éxito las pruebas de integración *end-to-end*. La comunicación entre el frontend (React), el backend (Spring Boot) y la base de datos (MariaDB) es robusta y está lista para producción.

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

