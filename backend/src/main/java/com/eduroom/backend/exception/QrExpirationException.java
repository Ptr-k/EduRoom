package com.eduroom.backend.exception;

public class QrExpirationException extends RuntimeException {
    public QrExpirationException(String message) {
        super(message);
    }
}
