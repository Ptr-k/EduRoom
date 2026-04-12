package com.eduroom.backend.repository;

import com.eduroom.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // para devolver un usuario por su email
    Usuario findByEmail(String email);

    // para ver si existe un usuario con ese email
    // y así no permitir que se registren dos usuarios con el mismo email
    boolean existsByEmail(String email);

}