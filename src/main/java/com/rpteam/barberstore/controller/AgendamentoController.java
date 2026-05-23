package com.rpteam.barberstore.controller;

import com.rpteam.barberstore.dto.request.AgendamentoRequestDTO;
import com.rpteam.barberstore.dto.response.AgendamentoResponseDTO;
import com.rpteam.barberstore.service.AgendamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
@RequiredArgsConstructor
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    /**
     * HU1: Como cliente, gostaria de agendar um serviço para cortar o meu cabelo.
     * POST /api/agendamentos
     */
    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> agendar(@Valid @RequestBody AgendamentoRequestDTO dto) {
        AgendamentoResponseDTO resposta = agendamentoService.agendarServico(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    /**
     * HU2: Como barbeiro, gostaria de ver todos os meus agendamentos para saber como será minha rotina.
     * GET /api/agendamentos/barbeiro/{barbeiroId}
     */
    @GetMapping("/barbeiro/{barbeiroId}")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarAgendamentosDoBarbeiro(@PathVariable Long barbeiroId) {
        List<AgendamentoResponseDTO> resposta = agendamentoService.listarAgendamentosPorBarbeiro(barbeiroId);
        return ResponseEntity.ok(resposta);
    }

    /**
     * HU2: Ver agendamentos do barbeiro em uma data específica.
     * GET /api/agendamentos/barbeiro/{barbeiroId}/data?data=30/05/2026
     */
    @GetMapping("/barbeiro/{barbeiroId}/data")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarAgendamentosDoBarbeiroEData(
            @PathVariable Long barbeiroId,
            @RequestParam @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate data) {
        List<AgendamentoResponseDTO> resposta = agendamentoService.listarAgendamentosPorBarbeiroEData(barbeiroId, data);
        return ResponseEntity.ok(resposta);
    }

    /**
     * Listar agendamentos do cliente.
     * GET /api/agendamentos/cliente/{clienteId}
     */
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarAgendamentosDoCliente(@PathVariable Long clienteId) {
        List<AgendamentoResponseDTO> resposta = agendamentoService.listarAgendamentosCliente(clienteId);
        return ResponseEntity.ok(resposta);
    }

    /**
     * Obter um agendamento por ID.
     * GET /api/agendamentos/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoResponseDTO> obterPorId(@PathVariable Long id) {
        AgendamentoResponseDTO resposta = agendamentoService.obterPorId(id);
        return ResponseEntity.ok(resposta);
    }

    /**
     * Cancelar um agendamento.
     * DELETE /api/agendamentos/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarAgendamento(@PathVariable Long id) {
        agendamentoService.cancelarAgendamento(id);
        return ResponseEntity.noContent().build();
    }
}
