package com.rpteam.barberstore.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import com.rpteam.barberstore.dto.request.AuthLoginRequest;
import com.rpteam.barberstore.dto.response.AuthResponse;
import com.rpteam.barberstore.dto.response.ClienteResponseDTO;
import com.rpteam.barberstore.entity.Cliente;
import com.rpteam.barberstore.security.JwtAuthenticationFilter;
import com.rpteam.barberstore.service.ClienteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final ClienteService clienteService;
    private final com.rpteam.barberstore.repository.UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthLoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getSenha()
                    )
            );

            com.rpteam.barberstore.entity.Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new com.rpteam.barberstore.exception.EntityNotFoundException("Usuário não encontrado"));

            String token = jwtAuthenticationFilter.generateToken(
                    usuario.getEmail(),
                    usuario.getTipo(),
                    usuario.getId()
            );

            return ResponseEntity.ok(new AuthResponse(token, usuario.getTipo(), usuario.getId(), usuario.getEmail()));

        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, null, null, null));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }
}
