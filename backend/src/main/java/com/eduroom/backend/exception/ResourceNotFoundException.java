package com.eduroom.backend.exception;

/**
 * Exception custom para cuando no se encuentra el recurso solicitado,
 * como lo es una clase, usuario, evento, etc...
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceType, Long id) {
        super(String.format("no encontrada con ID:", resourceType, id));
    }
}