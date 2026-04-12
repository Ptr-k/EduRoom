package com.eduroom.backend.dto;

import com.eduroom.backend.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO PARA ENVIAR RESPUESTA DEL LOGIN AL FRONTEND
 * la respuesta del login, en simples palabras
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token; // token JWT que se guarda en localStorage
    private Usuario usuario; // usuario con sus datos completos
    private String message; // mensaje de confirmación

    // constructor con mensaje automatico
    public LoginResponse(String token, Usuario usuario) {
        this.token = token;
        this.usuario = usuario;
        this.message = "Login exitoso";
    }
}
