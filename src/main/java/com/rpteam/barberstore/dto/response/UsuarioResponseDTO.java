package com.rpteam.barberstore.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class UsuarioResponseDTO {

    protected Long id;

    protected String email;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    protected LocalDateTime dataCriacao;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    protected LocalDateTime dataAtualizacao;

    protected Boolean ativo;
}

