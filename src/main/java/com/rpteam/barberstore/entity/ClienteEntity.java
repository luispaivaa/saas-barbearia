package com.rpteam.barberstore.entity;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ClienteEntity extends UsuarioEntity{
    private String nome;
    private String telefone;
    private boolean aceitouLGPD;


}
