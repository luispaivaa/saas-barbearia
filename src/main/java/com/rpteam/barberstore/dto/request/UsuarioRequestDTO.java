package com.rpteam.barberstore.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class UsuarioRequestDTO {

    @NotBlank(message = "Email não pode estar em branco")
    @Email(message = "Email deve ser válido")
    protected String email;

    @NotBlank(message = "Senha não pode estar em branco")
    @Size(min = 6, max = 255, message = "Senha deve ter entre 6 e 255 caracteres")
    protected String senha;
}

