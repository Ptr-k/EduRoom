package com.eduroom.backend.exception;

/**
 * Exception en el caso que una reserva
 * interfiera con otra que ya estaba antes
 */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
