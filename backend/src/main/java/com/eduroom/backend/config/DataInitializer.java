package com.eduroom.backend.config;

import com.eduroom.backend.model.*;
import com.eduroom.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

/**
 * DATAINITIALIZER PARA ENTORNO DE PRUEBAS
 * crea un usuario ( admin ) para el inicio de sesión y datos mínimos de demo
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CentroRepository centroRepository;

    @Autowired
    private AulaRepository aulaRepository;

    @Override
    public void run(String... args) throws Exception {
        // Crear centro y aulas de demo si no existen
        Centro centroDemo = null;
        if (centroRepository.count() == 0) {
            centroDemo = new Centro();
            centroDemo.setNombre("IES Demo");
            centroDemo.setHorarioInicio(LocalTime.of(8, 15));
            centroDemo.setHorarioFin(LocalTime.of(14, 45));
            centroDemo = centroRepository.save(centroDemo);

            Aula a1 = new Aula();
            a1.setNombre("Aula 101");
            a1.setCapacidad(30);
            a1.setCentro(centroDemo);
            aulaRepository.save(a1);

            Aula a2 = new Aula();
            a2.setNombre("Laboratorio 1");
            a2.setCapacidad(25);
            a2.setCentro(centroDemo);
            aulaRepository.save(a2);

            System.out.println("Centro y aulas de demo creados.");
        } else {
            // tomar un centro existente para asignar al profesor si hace falta
            centroDemo = centroRepository.findAll().stream().findFirst().orElse(null);
        }

        String adminEmail = "admin@eduroom.com";
        if (usuarioRepository.findByEmail(adminEmail) == null) {
            Usuario admin = new Usuario();
            admin.setNombre("Administrador Principal");
            admin.setEmail(adminEmail);
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
            // asignar al centro demo si existe
            if (centroDemo != null) {
                profesor.setCentro(centroDemo);
            }
            usuarioRepository.save(profesor);

            System.out.println("=================================================");
            System.out.println("Usuario PROFESOR creado por defecto");
            System.out.println("Email: " + profesorEmail);
            System.out.println("Contraseña: profesor123");
            System.out.println("Centro asignado: " + (centroDemo != null ? centroDemo.getNombre() : "Ninguno"));
            System.out.println("=================================================");
        } else {
            System.out.println("El usuario PROFESOR ya existe en la base de datos.");
        }
    }
}
