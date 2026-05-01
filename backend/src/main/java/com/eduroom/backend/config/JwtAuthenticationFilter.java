package com.eduroom.backend.config;

import com.eduroom.backend.model.Usuario;
import com.eduroom.backend.service.JwtService;
import com.eduroom.backend.service.UsuarioService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

/**
 * Filtro JWT para autenticar peticiones con cabecera Authorization: Bearer <token>
 *     (token de seguridad utilizado para autenticar usuarios en aplicaciones web y APIs)
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioService usuarioService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
        try {
            final String email = jwtService.extractEmail(token);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Usuario usuario = usuarioService.encontrarPorEmail(email);

                if (usuario != null && jwtService.isTokenValid(token, email)) {
                    // Mapear el rol a la autoridad de Spring Security (prefijo ROLE_)
                    String roleName = "ROLE_" + usuario.getRol().name(); // ADMIN o PROFESOR
                    List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(roleName));

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(email, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception ignored) {
            // si hay algún error con el token, se deja seguir sin autenticar
            // en la capa de seguridad se maneja los errores
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        // endpoints públicos que no requieren pasar por el filtro JWT
        return path.startsWith("/api/auth/") || path.matches("^/api/eventos/\\d+/qr$");
    }
}
