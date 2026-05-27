package com.rpteam.barberstore.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rpteam.barberstore.dto.request.AlterarSenhaRequestDTO;
import com.rpteam.barberstore.dto.request.BarbeiroRequestDTO;
import com.rpteam.barberstore.dto.response.BarbeiroResponseDTO;
import com.rpteam.barberstore.service.BarbeiroService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/barbeiros")
@RequiredArgsConstructor
public class BarbeiroController {

    private final BarbeiroService barbeiroService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BarbeiroResponseDTO> criar(@Valid @RequestBody BarbeiroRequestDTO dto) {
        BarbeiroResponseDTO response = barbeiroService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarbeiroResponseDTO> obterPorId(@PathVariable Long id) {
        BarbeiroResponseDTO response = barbeiroService.obterPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<BarbeiroResponseDTO>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BarbeiroResponseDTO> response = barbeiroService.listar(pageable);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('BARBEIRO')")
    public ResponseEntity<BarbeiroResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody BarbeiroRequestDTO dto) {
        BarbeiroResponseDTO response = barbeiroService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        barbeiroService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/alterar-senha")
    @PreAuthorize("hasAnyAuthority('BARBEIRO', 'ADMIN')")
    public ResponseEntity<Void> alterarSenha(
            @PathVariable Long id,
            @Valid @RequestBody AlterarSenhaRequestDTO dto) {
        try {
            barbeiroService.alterarSenha(id, dto.getSenhaAtual(), dto.getNovaSenha());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}
