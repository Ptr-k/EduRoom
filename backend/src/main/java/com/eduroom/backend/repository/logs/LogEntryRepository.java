package com.eduroom.backend.repository.logs;

import com.eduroom.backend.model.logs.LogEntry;
import com.eduroom.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface LogEntryRepository extends JpaRepository<LogEntry, Long> {

    // para crear una lista de los logs de un usuario
    List<LogEntry> findByUsuario(Usuario usuario);

    // para una lista de los logs que tengan una acción
    // en concreto, como lo es borrar, editar, etc...
    List<LogEntry> findByAccion(String accion);

    // lista de logs de un usuario con una acción buscada
    List<LogEntry> findByUsuarioAndAccion(Usuario usuario, String accion);

    // para buscar entre dos horas
    List<LogEntry> findByTimestampBetween(LocalDateTime inicio, LocalDateTime fin);
}
