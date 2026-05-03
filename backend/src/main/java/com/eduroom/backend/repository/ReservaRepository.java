package com.eduroom.backend.repository;

import com.eduroom.backend.model.Reserva;
import com.eduroom.backend.model.Aula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    // para devolver una lista de reservas de un aula en una fecha
    List<Reserva> findByAulaAndFecha(Aula aula, LocalDate fecha);

    // método para obtener reservas en espera ordenadas por fecha de creación
    // para la cola de espera
    List<Reserva> findByEstadoOrderByCreatedAtAsc(Reserva.EstadoReserva estado);

    // listar todas las reservas de un centro (a través de su aula)
    List<Reserva> findByAula_Centro_Id(Long centroId);
}