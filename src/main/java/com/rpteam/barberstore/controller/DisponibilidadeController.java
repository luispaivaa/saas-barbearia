package com.rpteam.barberstore.controller;

import com.rpteam.barberstore.dto.request.DisponibilidadeRequestDTO;
import com.rpteam.barberstore.dto.response.DisponibilidadeResponseDTO;
import com.rpteam.barberstore.service.DisponibilidadeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/disponibilidades")
@RequiredArgsConstructor
public class DisponibilidadeController {

    private final DisponibilidadeService disponibilidadeService;

    @PostMapping
    public ResponseEntity<DisponibilidadeResponseDTO> criar(@Valid @RequestBody DisponibilidadeRequestDTO dto) {
        DisponibilidadeResponseDTO resposta = disponibilidadeService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisponibilidadeResponseDTO> obterPorId(@PathVariable Long id) {
        DisponibilidadeResponseDTO resposta = disponibilidadeService.obterPorId(id);
        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/barbeiro/{barbeiroId}")
    public ResponseEntity<List<DisponibilidadeResponseDTO>> listarPorBarbeiro(@PathVariable Long barbeiroId) {
        List<DisponibilidadeResponseDTO> resposta = disponibilidadeService.listarPorBarbeiro(barbeiroId);
        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/barbeiro/{barbeiroId}/data")
    public ResponseEntity<List<DisponibilidadeResponseDTO>> listarPorBarbeiroEData(
            @PathVariable Long barbeiroId,
            @RequestParam @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate data) {
        List<DisponibilidadeResponseDTO> resposta = disponibilidadeService.listarPorBarbeiroEData(barbeiroId, data);
        return ResponseEntity.ok(resposta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DisponibilidadeResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody DisponibilidadeRequestDTO dto) {
        DisponibilidadeResponseDTO resposta = disponibilidadeService.atualizar(id, dto);
        return ResponseEntity.ok(resposta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        disponibilidadeService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
