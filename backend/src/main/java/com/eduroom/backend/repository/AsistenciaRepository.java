package com.eduroom.backend.repository;

import com.eduroom.backend.model.Asistencia;
import com.eduroom.backend.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    // para devolver una lista de asistencias de un evento específico
    List<Asistencia> findByEvento(Evento evento);
}
