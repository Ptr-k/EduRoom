package com.eduroom.backend.config;

import com.eduroom.backend.model.Usuario;
import com.eduroom.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * DATAINITIALIZER PARA ENTORNO DE PRUEBAS
 * crea un usuario ( admin ) para el inicio de sesión
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // antes que nada se comprueba si el usuario existe o no
        // en el caso que la
        String adminEmail = "admin@eduroom.com";

        if (usuarioRepository.findByEmail(adminEmail) == null) {
            Usuario admin = new Usuario();
            admin.setNombre("Administrador Principal");
            admin.setEmail(adminEmail);
            // se encripta la contraseña antes de guardarla
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRol(Usuario.Rol.ADMIN);
            usuarioRepository.save(admin);

            System.out.println("=================================================");
            System.out.println("Usuario ADMIN creado por defecto");
            System.out.println("Email: " + adminEmail);
            System.out.println("Contraseña: admin123");
            System.out.println("=================================================");
        } else {
            System.out.println("El usuario ADMIN ya existe en la base de datos.");
        }

        // Crear un usuario PROFESOR de prueba si no existe
        String profesorEmail = "profesor@eduroom.com";
        if (usuarioRepository.findByEmail(profesorEmail) == null) {
            Usuario profesor = new Usuario();
            profesor.setNombre("Profesor Ejemplo");
            profesor.setEmail(profesorEmail);
            profesor.setPasswordHash(passwordEncoder.encode("profesor123"));
            profesor.setRol(Usuario.Rol.PROFESOR);
            usuarioRepository.save(profesor);

            System.out.println("=================================================");
            System.out.println("Usuario PROFESOR creado por defecto");
            System.out.println("Email: " + profesorEmail);
            System.out.println("Contraseña: profesor123");
            System.out.println("=================================================");
        } else {
            System.out.println("El usuario PROFESOR ya existe en la base de datos.");
        }
    }
}
