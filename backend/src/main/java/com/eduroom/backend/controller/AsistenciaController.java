package com.eduroom.backend.controller;

import com.eduroom.backend.model.Asistencia;
import com.eduroom.backend.service.AsistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/asistencia")
@CrossOrigin(origins = "http://localhost:3000")
public class AsistenciaController {

    @Autowired
    private AsistenciaService asistenciaService;

    public static class RegistroAsistenciaRequest {
        private String nombreAlumno;
        
        public String getNombreAlumno() {
            return nombreAlumno;
        }
        
        public void setNombreAlumno(String nombreAlumno) {
            this.nombreAlumno = nombreAlumno;
        }
    }

    @PostMapping("/registro/{qrToken}")
    public ResponseEntity<Asistencia> registrarAsistencia(
            @PathVariable String qrToken, 
            @RequestBody RegistroAsistenciaRequest request) {
        try {
            Asistencia asistencia = asistenciaService.registrarAsistencia(qrToken, request.getNombreAlumno());
            return ResponseEntity.ok(asistencia);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<Asistencia>> getAsistenciasPorEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(asistenciaService.encontrarPorEvento(eventoId));
    }
}
