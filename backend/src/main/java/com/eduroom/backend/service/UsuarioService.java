package com.eduroom.backend.service;

import com.eduroom.backend.exception.DuplicateEmailException;
import com.eduroom.backend.exception.ResourceNotFoundException;
import com.eduroom.backend.model.Usuario;
import com.eduroom.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
}