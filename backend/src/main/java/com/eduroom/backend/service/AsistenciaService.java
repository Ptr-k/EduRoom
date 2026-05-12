package com.eduroom.backend.service;

import com.eduroom.backend.model.Asistencia;
import com.eduroom.backend.model.Evento;
import com.eduroom.backend.repository.AsistenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AsistenciaService {

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private EventoService eventoService;

    public Asistencia registrarAsistencia(String qrToken, String nombreAlumno) {
        // Obtenemos el evento usando el método econtrarPorQr (con el typo original para
        // que coincida)
        Evento evento = eventoService.econtrarPorQr(qrToken);

        Asistencia asistencia = new Asistencia();
        asistencia.setEvento(evento);
        asistencia.setNombreAlumno(nombreAlumno);
        asistencia.setTimestampCheckin(LocalDateTime.now());

        return asistenciaRepository.save(asistencia);
    }

    public List<Asistencia> encontrarPorEvento(Long eventoId) {
        Evento evento = eventoService.encontrarPorId(eventoId);
        return asistenciaRepository.findByEvento(evento);
    }
}
