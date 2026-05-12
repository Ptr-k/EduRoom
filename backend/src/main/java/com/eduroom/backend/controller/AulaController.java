package com.eduroom.backend.controller;

import com.eduroom.backend.model.Aula;
import com.eduroom.backend.model.Centro;
import com.eduroom.backend.service.AulaService;
import com.eduroom.backend.service.CentroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/aulas")
@CrossOrigin(origins = "http://localhost:3000")
public class AulaController {

    @Autowired
    private AulaService aulaService;

    @Autowired
    private CentroService centroService;

    // GET /api/aulas/centro/{centroId}
    @GetMapping("/centro/{centroId}")
    public ResponseEntity<List<Aula>> getAulasByCentro(@PathVariable Long centroId) {
        return ResponseEntity.ok(aulaService.encontrarPorIdCentro(centroId));
    }

    // GET /api/aulas/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Aula> getAulaById(@PathVariable Long id) {
        return ResponseEntity.ok(aulaService.encontrarPorId(id));
    }

    /**
     * POST /api/aulas/centro/{centroId}
     * Crear una nueva aula en un centro (solo ADMIN)
     */
    @PostMapping("/centro/{centroId}")
    public ResponseEntity<?> crearAula(
            @PathVariable Long centroId,
            @RequestBody Aula aulaRequest) {
        try {
            Centro centro = centroService.encontrarPorId(centroId);
            aulaRequest.setCentro(centro);
            Aula saved = aulaService.guardar(aulaRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al crear el aula: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/aulas/{id}
     * Eliminar un aula (solo ADMIN)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAula(@PathVariable Long id) {
        aulaService.borrarPorId(id);
        return ResponseEntity.noContent().build();
    }
}
