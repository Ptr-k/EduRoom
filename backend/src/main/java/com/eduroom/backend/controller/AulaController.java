package com.eduroom.backend.controller;

import com.eduroom.backend.model.Aula;
import com.eduroom.backend.service.AulaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aulas")
@CrossOrigin(origins = "http://localhost:3000")
public class AulaController {

    @Autowired
    private AulaService aulaService;

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
}
