package com.eduroom.backend.service;

import com.eduroom.backend.exception.ResourceNotFoundException;
import com.eduroom.backend.model.*;
import com.eduroom.backend.repository.ReservaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository rervRepo;

    @Autowired
    private AulaService aulaServ;

    @Autowired
    private UsuarioService usrServ;


    // crea una nueva reserva. si hay un conflicto, la reserva entra en estado "EN_ESPERA"
    public Reserva crearReserva(Reserva reserva) {
        Aula aula = aulaServ.encontrarPorId(reserva.getAula().getId());

        // se confirma que exista el profesor(usuario) para poder crear la reserva
        Optional<Usuario> optionalProfesor = Optional.ofNullable(usrServ.encontrarPorId(reserva.getProfesor().getId()));
        Usuario profesor = optionalProfesor.orElseThrow(
                () -> new ResourceNotFoundException("Usuario (Profesor)", reserva.getProfesor().getId())
        );


        List<Reserva> reservasExistentes = rervRepo.findByAulaAndFecha(
                aula, reserva.getFecha()
        );

        boolean hayConflicto = false;
        for (Reserva r : reservasExistentes) {
            // solo se consideran las reservas ACTIVAS
            if (r.getEstado() == Reserva.EstadoReserva.ACTIVA) {
                if (hayConflicto(r.getHoraInicio(), r.getHoraFin(), reserva.getHoraInicio(), reserva.getHoraFin())) {
                    hayConflicto = true;
                    break;
                }
            }
        }

        reserva.setAula(aula);
        reserva.setProfesor(profesor);

        if (hayConflicto) {
            reserva.setEstado(Reserva.EstadoReserva.EN_ESPERA);
            // se pone la reserva en estado "en_espera"
        } else {
            reserva.setEstado(Reserva.EstadoReserva.ACTIVA);
        }

        return rervRepo.save(reserva);
    }


    // método para saber si una reserva entra en conflicto con otra
    private boolean hayConflicto(LocalTime inicio1, LocalTime fin1, LocalTime inicio2, LocalTime fin2) {
        return inicio1.isBefore(fin2) && inicio2.isBefore(fin1);
    }

    public List<Reserva> encontrarTodos() {
        return rervRepo.findAll();
    }

    public Reserva encontrarPorId(Long id) {
        return rervRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", id));
    }

    public void borrarPorId(Long id) {
        if (!rervRepo.existsById(id)) {
            throw new ResourceNotFoundException("Reserva", id);
        }
        rervRepo.deleteById(id);
    }

    // obtiene la lista de reservas con el estado de "en_espera" en orden de creación
    public List<Reserva> findReservasEnEsperaOrdenadas() {
        return rervRepo.findByEstadoOrderByCreatedAtAsc(Reserva.EstadoReserva.EN_ESPERA);
    }

}