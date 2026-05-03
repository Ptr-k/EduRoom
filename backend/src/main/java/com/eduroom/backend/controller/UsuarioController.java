package com.eduroom.backend.controller;

import com.eduroom.backend.model.Usuario;
import com.eduroom.backend.service.JwtService;
import com.eduroom.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtService jwtService;

    /**
     * DELETE /api/usuarios/me
     * Permite a un usuario (ADMIN o PROFESOR) borrar su propia cuenta.
     */
    @DeleteMapping("/usuarios/me")
    public ResponseEntity<?> borrarMiCuenta(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);
            Usuario usuario = usuarioService.encontrarPorEmail(email);

            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Usuario no encontrado"));
            }

            usuarioService.borrarPorId(usuario.getId());
            return ResponseEntity.ok(Map.of("message", "Cuenta eliminada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al eliminar la cuenta. Es posible que tengas reservas o datos asociados que impiden el borrado."));
        }
    }

    /**
     * GET /api/admin/logs
     * Permite a un ADMIN descargar el archivo de logs del sistema.
     */
    @GetMapping("/admin/logs")
    public ResponseEntity<Resource> descargarLogs() {
        try {
            File logFile = new File("logs/eduroom.log");
            if (!logFile.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Resource resource = new FileSystemResource(logFile);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"eduroom.log\"")
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
