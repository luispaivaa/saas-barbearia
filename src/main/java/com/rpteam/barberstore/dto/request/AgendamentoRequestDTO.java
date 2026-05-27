package com.rpteam.barberstore.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgendamentoRequestDTO {

    @NotNull(message = "ID do cliente não pode ser nulo")
    private Long clienteId;

    @NotNull(message = "ID do barbeiro não pode ser nulo")
    private Long barbeiroId;

    @NotNull(message = "ID do serviço não pode ser nulo")
    private Long servicoId;

    @NotNull(message = "Data agendada não pode ser nula")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataAgendada;

    @NotNull(message = "Hora agendada não pode ser nula")
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime horaAgendada;
}
