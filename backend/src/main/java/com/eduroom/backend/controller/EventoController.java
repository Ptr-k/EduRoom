package com.eduroom.backend.controller;

import com.eduroom.backend.model.Evento;
import com.eduroom.backend.service.EventoService;
import com.eduroom.backend.service.QrCodeService;
import com.google.zxing.WriterException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "http://localhost:3000") // permitir solicitudes desde el frontend por su localhost
public class EventoController {
    // TODO ESTO ES LA PARTE DEL MAPPING Y API
    // POSTS Y GETS

    @Autowired
    private EventoService eventoService;

    @Autowired
    private QrCodeService qrCodeService;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

     // GET /api/eventos
     // obtener todos los eventos que hay
    @GetMapping
    public ResponseEntity<List<Evento>> getAllEventos() {
        return ResponseEntity.ok(eventoService.encontrarTodos());
    }

    // GET /api/eventos/{id}
    // obtener un evento por ID
    @GetMapping("/{id}")
    public ResponseEntity<Evento> getEventoById(@PathVariable Long id) {
        return ResponseEntity.ok(eventoService.encontrarPorId(id));
    }

    // POST /api/eventos
    // crear un nuevo evento
    @PostMapping
    public ResponseEntity<Evento> createEvento(@RequestBody Evento evento) {
        Evento nuevoEvento = eventoService.crearEvento(evento);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoEvento);
    }

     // DELETE /api/eventos/{id}
     // eliminar evento
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvento(@PathVariable Long id) {
        eventoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }


     // GET /api/eventos/{id}/qr - bbtener imagen QR del evento
     // devuelve una imagen PNG que redirige a la página de registro
    @GetMapping("/{id}/qr")
    public ResponseEntity<byte[]> getQrCode(@PathVariable Long id) {
        try {
            Evento evento = eventoService.encontrarPorId(id);

            // URL que apunta a la pagina de registros para el evento
            String registroUrl = frontendUrl + "/eventos/" + evento.getQrToken() + "/registro";

            byte[] qrImage = qrCodeService.generarQR(registroUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentLength(qrImage.length);

            return new ResponseEntity<>(qrImage, headers, HttpStatus.OK);
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
