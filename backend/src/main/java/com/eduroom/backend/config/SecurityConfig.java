package com.eduroom.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * config de la seguridad de Spring Security
 * define las rutas que son accesibles y como se encriptan las contraseñas
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // para encriptar contraseñas mediante BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // se configura las rutas publicas y las que se requieren autentificación
    // también se maneja las sesiones del JWT
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CRSF deshabilitado porque no se utilizan cookies
                .csrf(csrf -> csrf.disable())

                // permite que el frontend haga peticiones al backend gracias al cors
                // usa la config de CorsConfig.java automáticamente
                .cors(Customizer.withDefaults())

                // Session Management: SIN sesiones (STATELESS)
                // No guardamos sesiones en el servidor, cada petición incluye el token JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // RUTAS PÚBLICAS (no hace falta iniciar sesión)
                        .requestMatchers("/api/auth/**").permitAll() // login y registro
                        .requestMatchers("/api/eventos/qr/**").permitAll() // escanear QR

                        // TEMPORALMENTE: permitir todo para desarrollo
                        // EN PRODUCCIÓN, cambiar a .authenticated() para requerir login
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}
