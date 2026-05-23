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
public class DisponibilidadeRequestDTO {

    @NotNull(message = "ID do barbeiro não pode ser nulo")
    private Long barbeiroId;

    @NotNull(message = "Data de trabalho não pode ser nula")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataTrabalho;

    @NotNull(message = "Horário de início não pode ser nulo")
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime horarioInicio;

    @NotNull(message = "Horário de fim não pode ser nulo")
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime horarioFim;
}
