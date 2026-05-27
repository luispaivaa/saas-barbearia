package com.rpteam.barberstore.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServicoRequestDTO {

    @NotBlank(message = "Nome do serviço não pode estar em branco")
    @Size(min = 3, max = 150, message = "Nome deve ter entre 3 e 150 caracteres")
    private String nome;

    @NotNull(message = "Preço não pode ser nulo")
    @DecimalMin(value = "0.01", message = "Preço deve ser maior que 0")
    @Digits(integer = 8, fraction = 2, message = "Preço deve ter no máximo 8 dígitos inteiros e 2 decimais")
    private BigDecimal preco;

    @NotNull(message = "Tempo de duração não pode ser nulo")
    @Min(value = 5, message = "Tempo de duração mínimo é 5 minutos")
    @Max(value = 480, message = "Tempo de duração máximo é 480 minutos (8 horas)")
    private Integer tempoDuracaoEstimado;
}
