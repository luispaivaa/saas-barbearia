package com.rpteam.barberstore.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.rpteam.barberstore.entity.enums.StatusAgendamento;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgendamentoResponseDTO {

    private Long id;

    private ClienteResponseDTO cliente;

    private BarbeiroResponseDTO barbeiro;

    private ServicoResponseDTO servico;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataAgendada;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime horaAgendada;

    private StatusAgendamento status;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime dataCriacao;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime dataAtualizacao;
}
