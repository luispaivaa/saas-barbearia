package com.rpteam.barberstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Builder
public class ClienteResponseDTO extends UsuarioResponseDTO {

    private String nome;

    private String telefone;

    private Boolean aceiteTermosLGPD;
}
