package com.eduroom.backend.service;

import com.eduroom.backend.dto.LoginRequest;
import com.eduroom.backend.dto.LoginResponse;
import com.eduroom.backend.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Servicio de autenticación.
 *
 * ¿Qué hace?
 * Maneja todo el proceso de inicio de sesión (login):
 * 1. Verifica que el usuario exista
 * 2. Comprueba que la contraseña sea correcta
 * 3. Genera un token JWT si todo está bien
 *
 * Es como el recepcionista de un hotel: verifica tu identidad y te da la llave de tu habitación.
 */
@Service
public class AuthService {

    // Servicio para buscar usuarios en la base de datos
    @Autowired
    private UsuarioService usuarioService;

    // Servicio para generar tokens JWT
    @Autowired
    private JwtService jwtService;

    // Encoder para verificar contraseñas encriptadas con BCrypt
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Método principal de login.
     *
     * @param request Contiene email y password del usuario
     * @return LoginResponse con el token JWT y datos del usuario
     * @throws RuntimeException si las credenciales son incorrectas
     */
    public LoginResponse login(LoginRequest request) {
        // 1. Buscar usuario por email en la base de datos
        Usuario usuario = usuarioService.encontrarPorEmail(request.getEmail());

        // Si no existe el usuario, lanzar error genérico por seguridad
        // (nunca decir "email no existe" o "contraseña incorrecta", siempre "credenciales inválidas")
        if (usuario == null) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // 2. Verificar que la contraseña sea correcta
        // passwordEncoder.matches() compara:
        // - request.getPassword() = "micontraseña123" (texto plano que envió el usuario)
        // - usuario.getPasswordHash() = "$2a$10$N9qo8uLOickgx2Z..." (contraseña encriptada en BD)
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // 3. Si llegamos aquí, las credenciales son correctas
        // Generar un token JWT con el email y el ID del usuario
        String token = jwtService.generateToken(usuario.getEmail(), usuario.getId());

        // 4. Retornar respuesta con el token y los datos del usuario
        // El frontend guardará este token en localStorage y lo usará en cada petición
        return new LoginResponse(token, usuario);
    }
}
