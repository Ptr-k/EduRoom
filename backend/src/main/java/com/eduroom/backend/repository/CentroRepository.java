package com.eduroom.backend.repository;

import com.eduroom.backend.model.Centro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CentroRepository extends JpaRepository<Centro, Long> {
    /** repositorio para la entidad Centro
     * no hace falta ingresar nada dentror de esta interfaz
     */
}
