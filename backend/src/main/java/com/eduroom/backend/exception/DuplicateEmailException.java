package com.eduroom.backend.exception;

/**
 * Exception utilizada en el caso que se intente crear un
 * usuario con un email que ya existe en la base de datos
 */
public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String message) {
        super(message);
    }
}
