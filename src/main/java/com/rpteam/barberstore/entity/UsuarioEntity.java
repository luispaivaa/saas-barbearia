package com.rpteam.barberstore.entity;

import jakarta.persistence.*;
import lombok.*;

@MappedSuperclass
@Getter
@Setter
public abstract class UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String senha;

}
