package com.eduroom.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador de demostración para evidenciar la seguridad:
 * - /api/protected/pin  g (autenticado)
 * - /api/user/hello (ROLE_ADMIN o ROLE_PROFESOR)
 * - /api/admin/hello (solo ROLE_ADMIN)
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class DemoSecurityController {

    @GetMapping("/api/protected/ping")
    public ResponseEntity<Map<String, Object>> ping(Principal principal) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", "pong");
        body.put("authenticatedAs", principal != null ? principal.getName() : null);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/api/user/hello")
    public ResponseEntity<Map<String, String>> helloUser(Principal principal) {
        Map<String, String> body = new HashMap<>();
        body.put("message", "Hola usuario/profesor");
        body.put("who", principal != null ? principal.getName() : null);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/api/admin/hello")
    public ResponseEntity<Map<String, String>> helloAdmin(Principal principal) {
        Map<String, String> body = new HashMap<>();
        body.put("message", "Hola admin");
        body.put("who", principal != null ? principal.getName() : null);
        return ResponseEntity.ok(body);
    }
}
