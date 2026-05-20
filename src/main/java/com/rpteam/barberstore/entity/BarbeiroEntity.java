package com.rpteam.barberstore.entity;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class BarbeiroEntity extends UsuarioEntity{
    private String nome;
    private String telefone;

}
