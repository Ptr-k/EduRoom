package com.eduroom.backend.service;

import com.eduroom.backend.exception.QrExpirationException;
import com.eduroom.backend.exception.ResourceNotFoundException;
import com.eduroom.backend.model.Evento;
import com.eduroom.backend.model.Usuario;
import com.eduroom.backend.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private UsuarioService usuarioService;


    public List<Evento> encontrarTodos() {
        return eventoRepository.findAll();
    }

    public Evento encontrarPorId(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", id));
    }

    // para crear un evento nuevo, con su debido qr
    public Evento crearEvento(Evento evento) {
        // se valida que el usuario exista para poder crear el evento
        Usuario creador = usuarioService.encontrarPorId(evento.getCreador().getId());
        evento.setCreador(creador); // Asegura el objeto completo

        // se crea el token del QR y se le pone una fehca de expiración
        evento.setQrToken(UUID.randomUUID().toString());
        evento.setQrExpiracion(evento.getFecha());

        return eventoRepository.save(evento);
    }

    public void deleteById(Long id) {
        if (!eventoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Evento", id);
        }
        eventoRepository.deleteById(id);
    }


    public Evento econtrarPorQr(String qrToken) {
        Optional<Evento> eventoOpt = eventoRepository.findByQrToken(qrToken);

        if (eventoOpt.isEmpty()) {
            throw new ResourceNotFoundException("No existe evento con el QR.");
        }

        Evento evento = eventoOpt.get();

        // se tiene que asegurar que no ha caducado el qr
        if (evento.getQrExpiracion().isBefore(LocalDate.now())) {
            throw new QrExpirationException(qrToken);
        }

        return evento;
    }
}