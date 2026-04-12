package com.eduroom.backend.service;

import com.eduroom.backend.exception.ResourceNotFoundException;
import com.eduroom.backend.model.Aula;
import com.eduroom.backend.model.Centro;
import com.eduroom.backend.repository.AulaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AulaService {

    @Autowired
    private AulaRepository aulaRepo;

    @Autowired
    private CentroService centroServ;

    public List<Aula> encontrarTodos() {
        return aulaRepo.findAll();
    }

    public Aula encontrarPorId(Long id) {
        return aulaRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aula", id));
    }

    public Aula guardar(Aula aula) {
        return aulaRepo.save(aula);
    }

    public void borrarPorId(Long id) {
        if (!aulaRepo.existsById(id)) {
            throw new ResourceNotFoundException("Aula", id);
        }
        aulaRepo.deleteById(id);
    }

    public List<Aula> encontrarPorIdCentro(Long centroId) {
        // primero se encuentra el centro por id
        Centro centro = centroServ.encontrarPorId(centroId);
        if (centro == null) {
            throw new ResourceNotFoundException("Centro", centroId);
            // y si no existe el centro, lanza una exception
        }
            return aulaRepo.findByCentro(centro);
    }
}