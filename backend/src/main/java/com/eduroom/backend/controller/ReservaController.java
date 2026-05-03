package com.eduroom.backend.controller;

import com.eduroom.backend.model.Aula;
import com.eduroom.backend.model.Reserva;
import com.eduroom.backend.service.AulaService;
import com.eduroom.backend.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @Autowired
    private AulaService aulaService;

    // POST /api/reservas - crear una nueva reserva
    @PostMapping
    public ResponseEntity<Reserva> crearReserva(@RequestBody Reserva reserva) {
        Reserva creada = reservaService.crearReserva(reserva);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    // GET /api/reservas/centro/{centroId} - listar todas las reservas de un centro
    @GetMapping("/centro/{centroId}")
    public ResponseEntity<List<Reserva>> getReservasPorCentro(@PathVariable Long centroId) {
        List<Reserva> reservas = reservaService.encontrarTodos()
                .stream()
                .filter(r -> r.getAula() != null && r.getAula().getCentro() != null &&
                        r.getAula().getCentro().getId().equals(centroId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(reservas);
    }

    // GET /api/reservas/aula/{aulaId}?fecha=YYYY-MM-DD - listar reservas por aula y fecha
    @GetMapping("/aula/{aulaId}")
    public ResponseEntity<List<Reserva>> getReservasPorAulaYFecha(
            @PathVariable Long aulaId,
            @RequestParam(name = "fecha", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha
    ) {
        Aula aula = aulaService.encontrarPorId(aulaId);
        if (fecha == null) {
            // si no se pasa fecha, devolvemos todas las reservas del aula
            List<Reserva> todas = reservaService.encontrarTodos().stream()
                    .filter(r -> r.getAula() != null && r.getAula().getId().equals(aulaId))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(todas);
        }
        return ResponseEntity.ok(reservaService
                .encontrarTodos()
                .stream()
                .filter(r -> r.getAula() != null && r.getAula().getId().equals(aula.getId()) && fecha.equals(r.getFecha()))
                .collect(Collectors.toList()));
    }
}
