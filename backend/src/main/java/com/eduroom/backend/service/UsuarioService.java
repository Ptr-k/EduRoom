package com.eduroom.backend.service;

import com.eduroom.backend.dto.CrearProfesorRequest;
import com.eduroom.backend.exception.DuplicateEmailException;
import com.eduroom.backend.exception.ResourceNotFoundException;
import com.eduroom.backend.model.Centro;
import com.eduroom.backend.model.Usuario;
import com.eduroom.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repo;

    public List<Usuario> encontrarTodos() {
        return repo.findAll();
    }

    public Usuario encontrarPorId(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        // lanza la exception en el caso de que no exista, cosa que no
        // debería de suceder
    }

    public Usuario guardarUser(Usuario usuario) {
        // en el caso de que ya exista un usuario, lanza una exception
        if (repo.existsByEmail(usuario.getEmail())) {
            throw new DuplicateEmailException("Ya existe un usuario con ese email");
        }
        return repo.save(usuario);
    }

    public void borrarPorId(Long id) {
        repo.deleteById(id);
    }

    public Usuario encontrarPorEmail(String email) {
        return repo.findByEmail(email);
    }

    /**
     * Crea un nuevo profesor asociado a un centro.
     * Hashea la contraseña con BCrypt y asigna rol PROFESOR automáticamente.
     */
    public Usuario crearProfesor(Centro centro, CrearProfesorRequest request, PasswordEncoder encoder) {
        if (repo.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Ya existe un usuario con ese email");
        }
        Usuario profesor = new Usuario();
        profesor.setNombre(request.getNombre());
        profesor.setEmail(request.getEmail());
        profesor.setPasswordHash(encoder.encode(request.getPassword()));
        profesor.setRol(Usuario.Rol.PROFESOR);
        profesor.setCentro(centro);
        return repo.save(profesor);
    }
}