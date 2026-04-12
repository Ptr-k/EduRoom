package com.eduroom.backend.repository;

import com.eduroom.backend.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EventoRepository extends JpaRepository<Evento, Long> {

    // para devolver un evento por su QR
    Optional<Evento> findByQrToken(String qrToken);

    List<Evento> findByFecha(LocalDate fecha);

    List<Evento> findByCreadorId(Long creadorId);
}
