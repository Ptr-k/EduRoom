package com.eduroom.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * SERVICIO PARA GENERAR Y VALIDAR TOKENS JWT (los de inicio de sesión)
 *
 * tiene algo de seguridad básica ya que es un token firmado digitalmente
 * y se configura dentro del proyecto
 */
@Service
public class JwtService {

    // CLAVE SACADA DE APPLICACION.PROPERTIES
    @Value("${app.jwt.secret}")
    private String secretKey;

    // tiempo de expiracion del token. TAMBIÉN SACADO DE APPLICATION PROPERTIES
    @Value("${app.jwt.expiration}")
    private long expirationTime;

    // la clave se guarda en una key para que se pueda firmar
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // se genera el token JWT para el usuario
    public String generateToken(String email, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId); // la id del usuario es guardada dentro

        return Jwts.builder()
                // cuerpo del token
                .setClaims(claims)
                .setSubject(email) // el email del usuario es guardado dentro
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // para extraer el email del token
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // para extraer el id del usuario del token
    public Long extractUserId(String token) {
        return extractAllClaims(token).get("userId", Long.class);
    }

    // validación del token
    public boolean isTokenValid(String token, String email) {
        final String tokenEmail = extractEmail(token);
        // confirma que el email del token coincida con el email puesto
        return (tokenEmail.equals(email) && !isTokenExpired(token));
    }

    // verifica si el token ha expirado
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // se obtiene el cuerpo del token
    // o directamente se extrae los datos internos
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // Usa la clave secreta para verificar la firma
                .build()
                .parseClaimsJws(token) // Desencripta el token
                .getBody(); // Obtiene los datos internos
    }
}
