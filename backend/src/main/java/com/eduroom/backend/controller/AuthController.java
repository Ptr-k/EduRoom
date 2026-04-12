package com.eduroom.backend.controller;

import com.eduroom.backend.dto.LoginRequest;
import com.eduroom.backend.dto.LoginResponse;
import com.eduroom.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * CONTROLADOR PARA EL LOGIN Y REGISTRO (autentificación)
 *
 * recibe las peticiones del frontend y devuelve respuestas
 * por ahora solo está el de inicio de sesión
 */
@RestController
@RequestMapping("/api/auth") // las rutas empiezan así
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;


    // POST /api/auth/login
    // endpoint para el inciio de sesión sesión
    @PostMapping("/login") // POST /api/auth/login
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        // se valida automaticamente que la contraseña o email no estén vacios

        try {
            LoginResponse response = authService.login(request);

            // devuelve OK si consigue hacer login
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // si no devuelve un error
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // clase para devolver mensajes de error
    // ESTÁ EN FORMATO JSON
    static class ErrorResponse {
        private String message;
        public ErrorResponse(String message) {
            this.message = message;
        }
        public String getMessage() {
            return message;
        }
        public void setMessage(String message) {
            this.message = message;
        }
    }
}
