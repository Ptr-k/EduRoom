package com.eduroom.backend.service;

import com.eduroom.backend.exception.ResourceNotFoundException;
import com.eduroom.backend.model.Centro;
import com.eduroom.backend.repository.CentroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CentroService {

    @Autowired
    private CentroRepository repo;

    public List<Centro> encontrarTodos() {
        return repo.findAll();
    }

    public Centro encontrarPorId(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Centro", id));
                // lanza la exception en el caso de que no exista
    }

    public Centro guardar(Centro centro) {
        return repo.save(centro);
    }

    public void borrarPorId(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Centro", id);
            // lanza la exception en el caso de que no exista
        }
        repo.deleteById(id);
    }
}