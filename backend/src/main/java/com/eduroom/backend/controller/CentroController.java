package com.eduroom.backend.controller;

import com.eduroom.backend.model.Centro;
import com.eduroom.backend.model.Usuario;
import com.eduroom.backend.service.CentroService;
import com.eduroom.backend.service.JwtService;
import com.eduroom.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

/**
 * Controlador REST para los centros educativos.
 *
 * - ADMIN: puede ver todos los centros
 * - PROFESOR: solo ve su centro asignado
 */
@RestController
@RequestMapping("/api/centros")
@CrossOrigin(origins = "http://localhost:3000")
public class CentroController {

    @Autowired
    private CentroService centroService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioService usuarioService;

    /**
     * GET /api/centros
     * Devuelve los centros según el rol del usuario:
     * - ADMIN: todos los centros
     * - PROFESOR: solo su centro
     */
    @GetMapping
    public ResponseEntity<List<Centro>> getCentros(@RequestHeader("Authorization") String authHeader) {
        // Extraer el token del header "Bearer <token>"
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        Usuario usuario = usuarioService.encontrarPorEmail(email);

        if (usuario.getRol() == Usuario.Rol.ADMIN) {
            // ADMIN ve todos los centros
            return ResponseEntity.ok(centroService.encontrarTodos());
        } else {
            // PROFESOR solo ve su centro
            if (usuario.getCentro() != null) {
                return ResponseEntity.ok(Collections.singletonList(usuario.getCentro()));
            }
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    /**
     * GET /api/centros/{id}
     * Obtener un centro por su ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Centro> getCentroById(@PathVariable Long id) {
        return ResponseEntity.ok(centroService.encontrarPorId(id));
    }

    /**
     * POST /api/centros
     * Crear un nuevo centro (solo ADMIN)
     */
    @PostMapping
    public ResponseEntity<Centro> crearCentro(@RequestBody Centro centro) {
        return ResponseEntity.ok(centroService.guardar(centro));
    }

    /**
     * DELETE /api/centros/{id}
     * Eliminar un centro (solo ADMIN)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCentro(@PathVariable Long id) {
        centroService.borrarPorId(id);
        return ResponseEntity.noContent().build();
    }
}
