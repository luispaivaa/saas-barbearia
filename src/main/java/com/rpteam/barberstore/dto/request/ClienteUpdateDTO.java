package com.rpteam.barberstore.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteUpdateDTO {

    @Size(min = 3, max = 150, message = "Nome deve ter entre 3 e 150 caracteres")
    private String nome;

    @Size(min = 10, max = 20, message = "Telefone deve ter entre 10 e 20 caracteres")
    private String telefone;
}
