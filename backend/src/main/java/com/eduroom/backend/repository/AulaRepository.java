package com.eduroom.backend.repository;

import com.eduroom.backend.model.Aula;
import com.eduroom.backend.model.Centro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AulaRepository extends JpaRepository<Aula, Long> {

    // para devolver una lista de aulas de un centro
    List<Aula> findByCentro(Centro centro);

}