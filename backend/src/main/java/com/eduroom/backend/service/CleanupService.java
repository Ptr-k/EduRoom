package com.eduroom.backend.service;

import com.eduroom.backend.model.Evento;
import com.eduroom.backend.model.Reserva;
import com.eduroom.backend.repository.EventoRepository;
import com.eduroom.backend.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class CleanupService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    // Ejecutar cada minuto para limpiar actividades y reservas que ya pasaron su hora
    @Scheduled(fixedRate = 60000)
    public void limpiarPasados() {
        LocalDate hoy = LocalDate.now();
        LocalTime ahora = LocalTime.now();

        // Limpiar eventos (actividades)
        List<Evento> eventos = eventoRepository.findAll();
        for (Evento e : eventos) {
            if (e.getFecha() != null && e.getHoraFin() != null) {
                if (e.getFecha().isBefore(hoy) || (e.getFecha().isEqual(hoy) && e.getHoraFin().isBefore(ahora))) {
                    eventoRepository.delete(e);
                }
            }
        }

        // Limpiar reservas
        List<Reserva> reservas = reservaRepository.findAll();
        for (Reserva r : reservas) {
            if (r.getFecha() != null && r.getHoraFin() != null) {
                if (r.getFecha().isBefore(hoy) || (r.getFecha().isEqual(hoy) && r.getHoraFin().isBefore(ahora))) {
                    reservaRepository.delete(r);
                }
            }
        }
    }
}
